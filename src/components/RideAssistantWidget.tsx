import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, X, Sparkles, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

interface AssistantPayload {
  summary: string;
  rides: { name: string; price: number }[];
  best: string;
  reason: string;
  tips: string[];
}

const SESSION_KEY = "ride_assistant_session_id";
const CHAT_KEY = "ride_assistant_messages";
const OPEN_KEY = "ride_assistant_open";
const LAST_ANALYZED_KEY = "ride_assistant_last_analyzed_signature";
const DETAILED_ANALYSIS_PROMPT =
  "Analyze my current pickup and drop trip in detail and suggest the best ride option now. Explain clearly why it is best using fare, ETA, route traffic, comfort, and platform comparison. Also provide one cheaper fallback and one faster fallback.";

const initialAssistantMessage: ChatMessage = {
  role: "assistant",
  content: "Hi, I am your Ride Assistant. Ask me about best ride, fare tips, traffic, or booking strategy.",
};

function createSessionId() {
  return `ra_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function extractRideContext() {
  try {
    const raw = localStorage.getItem("ride_context");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function cleanPayload(value: any): any {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanPayload(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    Object.entries(value).forEach(([key, val]) => {
      const cleaned = cleanPayload(val);
      if (cleaned !== undefined) out[key] = cleaned;
    });
    return out;
  }

  if (value === null || value === undefined) return undefined;
  return value;
}

function hasUsableRideContext(context: any) {
  return (
    context &&
    typeof context.distance === "number" &&
    typeof context.duration === "number" &&
    typeof context.currentFare === "number" &&
    typeof context.pickupAddress === "string" &&
    context.pickupAddress.length > 0 &&
    typeof context.dropoffAddress === "string" &&
    context.dropoffAddress.length > 0
  );
}

function buildReadableResponse(ai: AssistantPayload) {
  const rideLine = ai.rides?.length
    ? `Top options: ${ai.rides.slice(0, 3).map((r) => `${r.name} Rs${r.price}`).join(", ")}`
    : "";
  const tips = ai.tips?.length ? `Tips: ${ai.tips.join(" | ")}` : "";
  return [ai.summary, `Best: ${ai.best}`, ai.reason, rideLine, tips].filter(Boolean).join("\n");
}

function buildLocalFallbackMessage(userText: string, context: any) {
  const distance = typeof context?.distance === "number" ? context.distance : null;
  const duration = typeof context?.duration === "number" ? context.duration : null;
  const currentFare = typeof context?.currentFare === "number" ? context.currentFare : null;
  const prices = context?.prices && typeof context.prices === "object" ? context.prices : {};

  const options = Object.entries(prices)
    .filter(([, value]) => typeof value === "number")
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => a.value - b.value);

  if (!distance || !duration || !currentFare || options.length === 0) {
    return "I can help with ride suggestions. Please select pickup and drop, then click Ride Now.";
  }

  const best = options[0];
  const second = options[1];
  const wantsDetailed =
    userText.toLowerCase().includes("detail") ||
    userText.toLowerCase().includes("analysis") ||
    userText.toLowerCase().includes("best");

  const lines = [
    "AI server is currently unavailable, so here is a quick local suggestion:",
    `Trip: ${distance} km, ~${duration} min, estimated fare Rs${currentFare}.`,
    `Best now: ${best.name} at Rs${best.value} (lowest estimated fare).`,
  ];

  if (second) lines.push(`Alternative: ${second.name} at Rs${second.value}.`);
  if (wantsDetailed) {
    lines.push("Start the AI server to get deeper reasoning on traffic, comfort, and booking timing.");
  }

  return lines.join("\n");
}

export default function RideAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    const savedOpen = localStorage.getItem(OPEN_KEY) === "1";
    const savedMessages = localStorage.getItem(CHAT_KEY);

    const sid = savedSession || createSessionId();
    setSessionId(sid);
    if (!savedSession) localStorage.setItem(SESSION_KEY, sid);
    setOpen(savedOpen);

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      } catch {
        // ignore parse errors
      }
    } else {
      localStorage.setItem(CHAT_KEY, JSON.stringify([initialAssistantMessage]));
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    void (async () => {
      try {
        const res = await fetch(`/api/ride-assistant/session/${sessionId}`);
        if (!res.ok) return;
        const data = await res.json();
        const serverMessages = Array.isArray(data?.messages) ? (data.messages as ChatMessage[]) : [];
        if (serverMessages.length) setMessages(serverMessages.slice(-30));
      } catch {
        // ignore and continue with local cache
      }
    })();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    localStorage.setItem(SESSION_KEY, sessionId);
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-30)));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(OPEN_KEY, open ? "1" : "0");
  }, [open]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);
  const canRequestDetailedAnalysis = useMemo(
    () => !loading && hasUsableRideContext(extractRideContext()),
    [loading]
  );

  const sendMessage = useCallback(
    async (forcedMessage?: string) => {
      const outbound = (forcedMessage ?? input).trim();
      if (!outbound || !sessionId || loading) return;

      const userMessage: ChatMessage = { role: "user", content: outbound };
      setMessages((prev) => [...prev, userMessage].slice(-30));
      if (!forcedMessage) setInput("");
      setLoading(true);

      try {
        const context = cleanPayload(extractRideContext());

        const requestAssistant = async () => {
          const res = await fetch("/api/ride-assistant/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, message: outbound, context }),
          });

          const raw = await res.text();
          let data: any = {};
          if (raw.trim().length > 0) {
            try {
              data = JSON.parse(raw);
            } catch {
              throw new Error("Assistant returned an invalid response. Please try again.");
            }
          }

          if (!res.ok) {
            throw new Error(
              data?.message ||
                data?.error ||
                "Assistant request failed. Please check if AI server is running."
            );
          }

          return data;
        };

        let data: any;
        try {
          data = await requestAssistant();
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 450));
          data = await requestAssistant();
        }

        const aiText = data?.ai
          ? buildReadableResponse(data.ai as AssistantPayload)
          : data?.aiText || "No response.";

        const assistantMessage: ChatMessage = { role: "assistant", content: aiText };
        setMessages((prev) => [...prev, assistantMessage].slice(-30));
      } catch (error) {
        const fallback = buildLocalFallbackMessage(outbound, extractRideContext());
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `${fallback}\n\n${
              error instanceof Error ? error.message : "Please try again."
            }`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, sessionId]
  );

  const handleClearChat = useCallback(async () => {
    if (!sessionId) return;

    try {
      await fetch(`/api/ride-assistant/session/${sessionId}`, { method: "DELETE" });
    } catch {
      // ignore network errors; local reset still applies
    }

    setMessages([initialAssistantMessage]);
    localStorage.setItem(CHAT_KEY, JSON.stringify([initialAssistantMessage]));
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ autoOpenAssistant?: boolean; signature?: string; nudgeOnly?: boolean }>;
      const signature = custom.detail?.signature || "";
      const shouldAutoOpen = Boolean(custom.detail?.autoOpenAssistant);
      const nudgeOnly = Boolean(custom.detail?.nudgeOnly);
      const last = localStorage.getItem(LAST_ANALYZED_KEY) || "";
      const context = extractRideContext();

      if (!shouldAutoOpen || !signature || signature === last || !hasUsableRideContext(context)) return;

      setOpen(true);
      localStorage.setItem(LAST_ANALYZED_KEY, signature);

      if (nudgeOnly) {
        const nudgeText =
          "I can help with ride details and suggestions. Ask me things like: best platform now, cheaper option, faster route, or whether to book now or wait.";
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant" && lastMessage?.content === nudgeText) return prev;
          return [...prev, { role: "assistant", content: nudgeText }].slice(-30);
        });
        return;
      }

      void sendMessage(DETAILED_ANALYSIS_PROMPT);
    };

    window.addEventListener("ride-context-updated", handler as EventListener);
    return () => {
      window.removeEventListener("ride-context-updated", handler as EventListener);
    };
  }, [sendMessage, sessionId]);

  return (
    <div className="fixed right-5 bottom-5 z-[1200]">
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full h-14 px-5 shadow-[0_12px_30px_hsl(var(--primary)/0.34)]"
          variant="default"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Ride Assistant
        </Button>
      )}

      {open && (
        <Card className="w-[340px] sm:w-[380px] h-[500px] p-0 overflow-hidden border border-border shadow-2xl bg-card/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
            <div>
              <p className="font-semibold text-sm">Ride Assistant</p>
              <p className="text-xs text-muted-foreground">Smart fare and route helper</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => void handleClearChat()} title="Clear chat">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`max-w-[92%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground inline-flex items-center">
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-card">
            <Button
              type="button"
              variant="outline"
              className="w-full mb-2"
              disabled={!canRequestDetailedAnalysis}
              onClick={() => void sendMessage(DETAILED_ANALYSIS_PROMPT)}
            >
              Get Detailed AI Analysis
            </Button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Chat about ride..."
                className="h-10 flex-1 min-w-0"
              />
              <Button type="submit" size="icon" disabled={!canSend} className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground mt-2 inline-flex items-center">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat is cached locally and resumed on return.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
