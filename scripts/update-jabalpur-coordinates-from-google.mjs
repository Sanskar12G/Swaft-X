import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "src", "data", "jabalpurLocations.ts");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_MAPS_API_KEY (or VITE_GOOGLE_MAPS_API_KEY) in environment.");
  process.exit(1);
}

const source = await fs.readFile(DATA_FILE, "utf8");

const lineRegex =
  /(\{\s*name:\s*"([^"]+)",\s*area:\s*"([^"]+)",\s*lat:\s*)(-?\d+(?:\.\d+)?)(,\s*lng:\s*)(-?\d+(?:\.\d+)?)(,\s*fullAddress:\s*"([^"]+)"\s*\},?)/g;

const entries = [];
let match;
while ((match = lineRegex.exec(source)) !== null) {
  entries.push({
    fullMatch: match[0],
    prefix: match[1],
    name: match[2],
    area: match[3],
    currentLat: Number(match[4]),
    middle: match[5],
    currentLng: Number(match[6]),
    suffix: match[7],
    fullAddress: match[8],
  });
}

if (!entries.length) {
  console.error("No location entries found in jabalpurLocations.ts");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocode(address) {
  const query = `${address}, India`;
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("region", "in");

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();

  if (data.status !== "OK" || !data.results?.length) {
    return null;
  }

  const location = data.results[0].geometry?.location;
  if (!location) return null;

  return {
    lat: Number(location.lat),
    lng: Number(location.lng),
    formattedAddress: data.results[0].formatted_address || address,
  };
}

let updatedSource = source;
let successCount = 0;
let failCount = 0;

for (const entry of entries) {
  try {
    const result = await geocode(entry.fullAddress);
    if (!result) {
      failCount += 1;
      console.warn(`No result: ${entry.name} (${entry.fullAddress})`);
      await sleep(120);
      continue;
    }

    const lat = result.lat.toFixed(6);
    const lng = result.lng.toFixed(6);
    const replacement = `${entry.prefix}${lat}${entry.middle}${lng}${entry.suffix}`;
    updatedSource = updatedSource.replace(entry.fullMatch, replacement);
    successCount += 1;
    console.log(`Updated: ${entry.name} -> ${lat}, ${lng}`);
  } catch (error) {
    failCount += 1;
    console.warn(`Failed: ${entry.name} (${entry.fullAddress}) :: ${String(error)}`);
  }

  // Light delay to reduce hitting API rate limits.
  await sleep(120);
}

await fs.writeFile(DATA_FILE, updatedSource, "utf8");

console.log(`Done. Updated ${successCount} locations, failed ${failCount}.`);

