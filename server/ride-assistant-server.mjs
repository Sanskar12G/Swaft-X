import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const app = express();
const PORT = Number(process.env.AI_SERVER_PORT || 8787);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct";
const CACHE_FILE = path.join(process.cwd(), ".cache", "ride-assistant-sessions.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const MAX_MESSAGES = 20;
const MAX_USER_MESSAGE_LEN = 1200;
const RIDE_KEYWORDS = [
  "ride",
  "cab",
  "taxi",
  "book",
  "booking",
  "fare",
  "price",
  "cheapest",
  "best ride",
  "distance",
  "eta",
  "time",
  "traffic",
  "route",
  "pickup",
  "drop",
  "destination",
  "uber",
  "ola",
  "rapido",
  "economy",
  "luxury",
  "electric",
  "surge",
];

const SYSTEM_PROMPT = `
You are Ride Assistant for a smart cab app.
Use context carefully (distance, duration, rideType, ride details, prices, route signals).
Explain WHY one ride is better in practical terms (cost, ETA, comfort, eco impact).
Return ONLY valid JSON in this exact shape:
{
  "summary": "short helpful answer",
  "rides": [{"name":"Uber","price":123},{"name":"Ola","price":120},{"name":"Rapido","price":110}],
  "best": "Rapido",
  "reason": "why this is best in 1 sentence",
  "tips": ["tip 1", "tip 2"]
}
No markdown. No extra keys.
`;

const ChatInputSchema = z.object({
  sessionId: z.string().min(6).max(128).optional(),
  message: z.string().min(1).max(MAX_USER_MESSAGE_LEN),
  context: z
    .object({
      distance: z.number().nonnegative().nullish(),
      duration: z.number().nonnegative().nullish(),
      rideType: z.string().nullish(),
      currentFare: z.number().nonnegative().nullish(),
      prices: z.record(z.number().nonnegative()).optional(),
      selectedPlatform: z.string().nullish(),
      selectedRoute: z.string().nullish(),
      rideDetails: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullish(),
            basePrice: z.number().nullish(),
            perKm: z.number().nullish(),
            etaText: z.string().nullish(),
            multiplier: z.number().nullish(),
          })
        )
        .nullish(),
    })
    .passthrough()
    .optional(),
});

/** @type {Map<string, {messages: Array<{role:"user"|"assistant", content:string}>, updatedAt:number}>} */
const sessions = new Map();
let saveTimer = null;

function now() {
  return Date.now();
}

function newSessionId() {
  return `rs_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function safeParseJSON(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Try to parse JSON inside code fences
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
}

function buildFallback(context) {
  const base = context?.currentFare || 200;
  const prices = context?.prices || {
    Uber: Math.round(base * 1.12),
    Ola: Math.round(base * 1.05),
    Rapido: Math.round(base * 0.94),
  };
  const rides = Object.entries(prices).map(([name, price]) => ({ name, price }));
  rides.sort((a, b) => a.price - b.price);
  return {
    summary: `${rides[0].name} is currently the most affordable option.`,
    rides,
    best: rides[0]?.name || "Rapido",
    reason: "Fallback based on lowest estimated price.",
    tips: [
      "Try booking 5-10 minutes later during high demand.",
      "Check alternate route to reduce travel time and fare.",
    ],
  };
}

function isRideOnlyQuery(message, context) {
  const text = String(message || "").toLowerCase();
  const keywordMatch = RIDE_KEYWORDS.some((k) => text.includes(k));
  const hasRideContext =
    typeof context?.distance === "number" ||
    typeof context?.duration === "number" ||
    typeof context?.currentFare === "number" ||
    (context?.rideDetails && Array.isArray(context.rideDetails) && context.rideDetails.length > 0);
  return keywordMatch || hasRideContext;
}

function buildOffTopicResponse(context) {
  const fallback = buildFallback(context);
  return {
    summary: "I can only help with ride booking topics.",
    rides: fallback.rides,
    best: fallback.best,
    reason:
      "Please ask about ride fares, route choice, ETA, platform comparison, or which ride type is better.",
    tips: [
      "Try: Which ride is best for this trip?",
      "Try: Compare Uber, Ola, Rapido for my current route.",
      "Try: Should I wait 10 minutes or book now?",
    ],
  };
}

function sanitizeAssistantPayload(parsed, context) {
  if (!parsed || typeof parsed !== "object") return buildFallback(context);
  if (!Array.isArray(parsed.rides) || !parsed.best || !parsed.reason) return buildFallback(context);
  return {
    summary: String(parsed.summary || `${parsed.best} looks best right now.`),
    rides: parsed.rides
      .map((r) => ({ name: String(r.name || "Unknown"), price: Number(r.price || 0) }))
      .filter((r) => Number.isFinite(r.price) && r.price >= 0),
    best: String(parsed.best),
    reason: String(parsed.reason),
    tips: Array.isArray(parsed.tips) ? parsed.tips.map((t) => String(t)).slice(0, 3) : [],
  };
}

function pruneSessions() {
  const cutoff = now() - SESSION_TTL_MS;
  for (const [id, s] of sessions) {
    if (s.updatedAt < cutoff) sessions.delete(id);
  }
}

async function loadCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return;
    for (const row of data) {
      if (!row?.id || !Array.isArray(row?.messages)) continue;
      sessions.set(row.id, { messages: row.messages.slice(-MAX_MESSAGES), updatedAt: Number(row.updatedAt) || now() });
    }
    pruneSessions();
  } catch {
    // ignore missing cache
  }
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
      const out = [...sessions.entries()].map(([id, value]) => ({ id, ...value }));
      await fs.writeFile(CACHE_FILE, JSON.stringify(out), "utf8");
    } catch (e) {
      console.error("Failed to persist AI session cache:", e);
    }
  }, 300);
}

async function callOpenRouter(messages) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.2,
      messages,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenRouter failed (${response.status})`);
  }

  return data?.choices?.[0]?.message?.content || "";
}

app.use(cors());
app.use(express.json({ limit: "200kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, sessions: sessions.size });
});

app.get("/api/ride-assistant/session/:id", (req, res) => {
  const id = req.params.id;
  const existing = sessions.get(id);
  if (!existing) {
    return res.status(404).json({ error: "Session not found" });
  }
  return res.json({ sessionId: id, messages: existing.messages, updatedAt: existing.updatedAt });
});

app.post("/api/ride-assistant/chat", async (req, res) => {
  try {
    const parsed = ChatInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload", details: parsed.error.flatten() });
    }

    const { message, context } = parsed.data;
    const sessionId = parsed.data.sessionId || newSessionId();
    const existing = sessions.get(sessionId) || { messages: [], updatedAt: now() };

    if (!isRideOnlyQuery(message, context)) {
      const offTopic = buildOffTopicResponse(context);
      existing.messages.push({ role: "user", content: message.trim() });
      existing.messages.push({ role: "assistant", content: JSON.stringify(offTopic) });
      existing.messages = existing.messages.slice(-MAX_MESSAGES);
      existing.updatedAt = now();
      sessions.set(sessionId, existing);
      pruneSessions();
      scheduleSave();

      return res.json({
        sessionId,
        aiText: JSON.stringify(offTopic),
        ai: offTopic,
        cachedMessages: existing.messages.length,
      });
    }

    existing.messages.push({ role: "user", content: message.trim() });
    existing.messages = existing.messages.slice(-MAX_MESSAGES);

    let aiText = "";
    let aiParsed;
    try {
      aiText = await callOpenRouter([
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "system",
          content: `Context: ${JSON.stringify(context || {})}`,
        },
        ...existing.messages,
      ]);
      aiParsed = sanitizeAssistantPayload(safeParseJSON(aiText), context);
    } catch (e) {
      aiParsed = buildFallback(context);
      aiText = JSON.stringify(aiParsed);
      console.warn("AI provider unavailable, fallback served:", e instanceof Error ? e.message : e);
    }

    existing.messages.push({ role: "assistant", content: aiText || JSON.stringify(aiParsed) });
    existing.messages = existing.messages.slice(-MAX_MESSAGES);
    existing.updatedAt = now();
    sessions.set(sessionId, existing);

    pruneSessions();
    scheduleSave();

    return res.json({
      sessionId,
      aiText,
      ai: aiParsed,
      cachedMessages: existing.messages.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

app.delete("/api/ride-assistant/session/:id", (req, res) => {
  sessions.delete(req.params.id);
  scheduleSave();
  res.json({ ok: true });
});

await loadCache();
app.listen(PORT, () => {
  console.log(`Ride Assistant API running on http://localhost:${PORT}`);
});
