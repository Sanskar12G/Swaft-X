export interface Location {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

// Popular locations across major Indian cities
export const locations: Location[] = [
  // Bengaluru
  { id: "blr-1", name: "Koramangala", area: "Koramangala 4th Block", city: "Bengaluru", lat: 12.9352, lng: 77.6245 },
  { id: "blr-2", name: "Indiranagar", area: "100 Feet Road", city: "Bengaluru", lat: 12.9784, lng: 77.6408 },
  { id: "blr-3", name: "Whitefield", area: "ITPL Main Road", city: "Bengaluru", lat: 12.9698, lng: 77.7500 },
  { id: "blr-4", name: "HSR Layout", area: "Sector 1", city: "Bengaluru", lat: 12.9116, lng: 77.6389 },
  { id: "blr-5", name: "Electronic City", area: "Phase 1", city: "Bengaluru", lat: 12.8399, lng: 77.6770 },
  { id: "blr-6", name: "MG Road", area: "MG Road Metro", city: "Bengaluru", lat: 12.9756, lng: 77.6065 },
  { id: "blr-7", name: "Jayanagar", area: "4th Block", city: "Bengaluru", lat: 12.9299, lng: 77.5838 },
  { id: "blr-8", name: "BTM Layout", area: "2nd Stage", city: "Bengaluru", lat: 12.9166, lng: 77.6101 },
  { id: "blr-9", name: "Marathahalli", area: "ORR Junction", city: "Bengaluru", lat: 12.9591, lng: 77.6974 },
  { id: "blr-10", name: "JP Nagar", area: "6th Phase", city: "Bengaluru", lat: 12.9063, lng: 77.5857 },
  { id: "blr-11", name: "Hebbal", area: "Hebbal Flyover", city: "Bengaluru", lat: 13.0358, lng: 77.5970 },
  { id: "blr-12", name: "Yelahanka", area: "New Town", city: "Bengaluru", lat: 13.1005, lng: 77.5963 },
  { id: "blr-13", name: "Bannerghatta Road", area: "Arekere", city: "Bengaluru", lat: 12.8800, lng: 77.6012 },
  { id: "blr-14", name: "Kempegowda Bus Station", area: "Majestic", city: "Bengaluru", lat: 12.9772, lng: 77.5713 },
  { id: "blr-15", name: "KR Puram", area: "Railway Station", city: "Bengaluru", lat: 13.0073, lng: 77.6960 },
  // Mumbai
  { id: "mum-1", name: "Andheri", area: "Andheri West", city: "Mumbai", lat: 19.1197, lng: 72.8464 },
  { id: "mum-2", name: "Bandra", area: "Bandra West", city: "Mumbai", lat: 19.0596, lng: 72.8295 },
  { id: "mum-3", name: "Powai", area: "Hiranandani", city: "Mumbai", lat: 19.1176, lng: 72.9060 },
  { id: "mum-4", name: "Lower Parel", area: "Phoenix Mills", city: "Mumbai", lat: 18.9932, lng: 72.8301 },
  { id: "mum-5", name: "Juhu", area: "Juhu Beach", city: "Mumbai", lat: 19.0883, lng: 72.8264 },
  { id: "mum-6", name: "Colaba", area: "Gateway of India", city: "Mumbai", lat: 18.9067, lng: 72.8147 },
  { id: "mum-7", name: "Dadar", area: "Dadar TT", city: "Mumbai", lat: 19.0178, lng: 72.8478 },
  { id: "mum-8", name: "Malad", area: "Malad West", city: "Mumbai", lat: 19.1874, lng: 72.8484 },
  // Delhi
  { id: "del-1", name: "Connaught Place", area: "CP Inner Circle", city: "Delhi", lat: 28.6315, lng: 77.2167 },
  { id: "del-2", name: "Hauz Khas", area: "Hauz Khas Village", city: "Delhi", lat: 28.5494, lng: 77.2001 },
  { id: "del-3", name: "Saket", area: "Select Citywalk", city: "Delhi", lat: 28.5244, lng: 77.2167 },
  { id: "del-4", name: "Dwarka", area: "Sector 21", city: "Delhi", lat: 28.5733, lng: 77.0424 },
  { id: "del-5", name: "Nehru Place", area: "Nehru Place Metro", city: "Delhi", lat: 28.5491, lng: 77.2532 },
  { id: "del-6", name: "Karol Bagh", area: "Ajmal Khan Road", city: "Delhi", lat: 28.6519, lng: 77.1907 },
  // Hyderabad
  { id: "hyd-1", name: "Hitech City", area: "Madhapur", city: "Hyderabad", lat: 17.4483, lng: 78.3915 },
  { id: "hyd-2", name: "Gachibowli", area: "DLF Cyber City", city: "Hyderabad", lat: 17.4401, lng: 78.3489 },
  { id: "hyd-3", name: "Banjara Hills", area: "Road No. 12", city: "Hyderabad", lat: 17.4156, lng: 78.4347 },
  { id: "hyd-4", name: "Secunderabad", area: "Railway Station", city: "Hyderabad", lat: 17.4399, lng: 78.5018 },
  // Chennai
  { id: "chn-1", name: "T. Nagar", area: "Pondy Bazaar", city: "Chennai", lat: 13.0418, lng: 80.2341 },
  { id: "chn-2", name: "Adyar", area: "Adyar Signal", city: "Chennai", lat: 13.0063, lng: 80.2574 },
  { id: "chn-3", name: "Anna Nagar", area: "2nd Avenue", city: "Chennai", lat: 13.0850, lng: 80.2101 },
  { id: "chn-4", name: "OMR", area: "Sholinganallur", city: "Chennai", lat: 12.9010, lng: 80.2279 },
  // Pune
  { id: "pun-1", name: "Hinjewadi", area: "Phase 1", city: "Pune", lat: 18.5912, lng: 73.7390 },
  { id: "pun-2", name: "Koregaon Park", area: "North Main Road", city: "Pune", lat: 18.5362, lng: 73.8936 },
  { id: "pun-3", name: "Kharadi", area: "EON IT Park", city: "Pune", lat: 18.5514, lng: 73.9406 },
  // Kolkata
  { id: "kol-1", name: "Salt Lake", area: "Sector V", city: "Kolkata", lat: 22.5726, lng: 88.4312 },
  { id: "kol-2", name: "Park Street", area: "Park Street Metro", city: "Kolkata", lat: 22.5530, lng: 88.3514 },
  { id: "kol-3", name: "New Town", area: "Rajarhat", city: "Kolkata", lat: 22.5958, lng: 88.4846 },
];

export function searchLocations(query: string): Location[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return locations
    .filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
    )
    .slice(0, 6);
}

export function getDistance(a: Location, b: Location): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Find closest location to given coordinates
export function findClosestLocation(lat: number, lng: number): Location {
  const ref: Location = { id: "current", name: "Current Location", area: "", city: "", lat, lng };
  let best = locations[0];
  let bestDist = getDistance(ref, locations[0]);
  for (const loc of locations) {
    const d = getDistance(ref, loc);
    if (d < bestDist) {
      best = loc;
      bestDist = d;
    }
  }
  return best;
}

type RideType = "auto" | "bike" | "cab";

interface FareResult {
  service: string;
  price: number;
  eta: string;
  color: string;
}

// Base rates per km for each service and ride type
const baseRates: Record<RideType, Record<string, { perKm: number; base: number; minFare: number }>> = {
  auto: {
    "Namma Yatri": { perKm: 13, base: 30, minFare: 30 },
    "Rapido": { perKm: 14, base: 25, minFare: 35 },
    "Ola": { perKm: 16, base: 40, minFare: 50 },
    "Uber": { perKm: 18, base: 45, minFare: 55 },
  },
  bike: {
    "Rapido": { perKm: 6, base: 15, minFare: 25 },
    "Uber Moto": { perKm: 7, base: 20, minFare: 30 },
    "Ola Bike": { perKm: 7.5, base: 18, minFare: 28 },
    "Namma Yatri": { perKm: 6.5, base: 15, minFare: 25 },
  },
  cab: {
    "Ola": { perKm: 14, base: 80, minFare: 100 },
    "Uber": { perKm: 15, base: 85, minFare: 110 },
    "Rapido": { perKm: 13, base: 70, minFare: 90 },
    "Namma Yatri": { perKm: 12, base: 65, minFare: 85 },
  },
};

const serviceColors: Record<string, string> = {
  "Namma Yatri": "bg-emerald-500",
  "Rapido": "bg-amber-400",
  "Ola": "bg-amber-500",
  "Uber": "bg-foreground",
  "Uber Moto": "bg-foreground",
  "Ola Bike": "bg-amber-500",
};

export function calculateFares(pickup: Location, drop: Location, rideType: RideType): FareResult[] {
  const distance = getDistance(pickup, drop);
  // Add some surge randomness (0.9 to 1.3x)
  const surgeSeed = (pickup.lat * 1000 + drop.lng * 1000) % 10;

  const rates = baseRates[rideType];
  return Object.entries(rates).map(([service, rate]) => {
    const surgeFactor = 0.95 + ((surgeSeed + service.length) % 8) * 0.05;
    const rawPrice = rate.base + rate.perKm * distance * surgeFactor;
    const price = Math.max(rate.minFare, Math.round(rawPrice));
    const etaBase = Math.floor(2 + Math.random() * 6);
    return {
      service,
      price,
      eta: `${etaBase} min`,
      color: serviceColors[service] || "bg-foreground",
    };
  });
}
