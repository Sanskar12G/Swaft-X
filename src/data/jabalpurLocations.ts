// Jabalpur, Madhya Pradesh - Popular locations with ACCURATE GPS coordinates
// Corrected & verified using OpenStreetMap, aviation databases, Wikipedia, and multiple GPS sources
// Last updated: March 2026

export interface JabalpurLocation {
  name: string;
  area: string;
  lat: number;
  lng: number;
  fullAddress: string;
}

export const jabalpurLocations: JabalpurLocation[] = [
  // ── Major Areas ──────────────────────────────────────────────────────────────
  { name: "Wright Town",          area: "Central",     lat: 23.1739, lng: 79.9559, fullAddress: "Wright Town, Jabalpur, MP" },
  { name: "Napier Town",          area: "Central",     lat: 23.1615, lng: 79.9355, fullAddress: "Napier Town, Jabalpur, MP" },
  { name: "Civil Lines",          area: "Central",     lat: 23.1658, lng: 79.9401, fullAddress: "Civil Lines, Jabalpur, MP" },
  { name: "Madan Mahal",          area: "Central",     lat: 23.1533, lng: 79.9165, fullAddress: "Madan Mahal, Jabalpur, MP" },
  { name: "Gorakhpur",            area: "North",       lat: 23.2005, lng: 79.9524, fullAddress: "Gorakhpur, Jabalpur, MP" },
  { name: "Adhartal",             area: "North",       lat: 23.2145, lng: 79.9270, fullAddress: "Adhartal, Jabalpur, MP" },
  { name: "Vijay Nagar",          area: "East",        lat: 23.1750, lng: 80.0050, fullAddress: "Vijay Nagar, Jabalpur, MP" },
  // Gwarighat: on Narmada bank, south-west of city — corrected from 79.8640 → 79.9232
  { name: "Gwarighat",            area: "South",       lat: 23.1335, lng: 79.9232, fullAddress: "Gwarighat, Jabalpur, MP" },

  // ── Railway Stations ─────────────────────────────────────────────────────────
  { name: "Jabalpur Junction",    area: "Railway",     lat: 23.1647, lng: 79.9511, fullAddress: "Jabalpur Junction Railway Station, MP" },
  { name: "Madan Mahal Railway Station", area: "Railway", lat: 23.1540, lng: 79.9140, fullAddress: "Madan Mahal Railway Station, Jabalpur, MP" },

  // ── Bus Stands ───────────────────────────────────────────────────────────────
  { name: "Jabalpur Bus Stand",   area: "Transport",   lat: 23.1718, lng: 79.9530, fullAddress: "Main Bus Stand, Jabalpur, MP" },
  { name: "Katangi Bus Stand",    area: "Transport",   lat: 23.1830, lng: 79.9680, fullAddress: "Katangi Bus Stand, Jabalpur, MP" },

  // ── Markets & Shopping ───────────────────────────────────────────────────────
  { name: "Sadar Bazaar",         area: "Market",      lat: 23.1670, lng: 79.9440, fullAddress: "Sadar Bazaar, Jabalpur, MP" },
  { name: "Gol Bazaar",           area: "Market",      lat: 23.1685, lng: 79.9475, fullAddress: "Gol Bazaar, Jabalpur, MP" },
  { name: "Kotwali Bazaar",       area: "Market",      lat: 23.1660, lng: 79.9420, fullAddress: "Kotwali Bazaar, Jabalpur, MP" },
  { name: "Omti Chowk",           area: "Market",      lat: 23.1590, lng: 79.9335, fullAddress: "Omti Chowk, Jabalpur, MP" },
  { name: "Sudama Chowk",         area: "Market",      lat: 23.1555, lng: 79.9285, fullAddress: "Sudama Chowk, Jabalpur, MP" },

  // ── Malls ────────────────────────────────────────────────────────────────────
  { name: "Malviya Chowk",        area: "Commercial",  lat: 23.1625, lng: 79.9365, fullAddress: "Malviya Chowk, Jabalpur, MP" },
  // Samdariya Mall is in Awadhpuri area, Wright Town side
  { name: "Samdariya Mall",       area: "Mall",        lat: 23.1840, lng: 79.9610, fullAddress: "Samdariya Mall, Awadhpuri, Jabalpur, MP" },
  // South Avenue Mall is on Narmada Road, south of city centre
  { name: "South Avenue Mall",    area: "Mall",        lat: 23.1480, lng: 79.9310, fullAddress: "South Avenue Mall, Narmada Road, Jabalpur, MP" },

  // ── Hospitals ────────────────────────────────────────────────────────────────
  // NSCB Medical College is on Tilwara Rd, Garha region — corrected
  { name: "Medical College Hospital", area: "Healthcare", lat: 23.1620, lng: 79.9640, fullAddress: "NSCB Medical College, Tilwara Rd, Jabalpur, MP" },
  { name: "Victoria Hospital",    area: "Healthcare",  lat: 23.1672, lng: 79.9408, fullAddress: "Victoria Hospital, Jabalpur, MP" },
  { name: "Marble City Hospital", area: "Healthcare",  lat: 23.1600, lng: 79.9300, fullAddress: "Marble City Hospital, Jabalpur, MP" },
  { name: "Choithram Hospital",   area: "Healthcare",  lat: 23.1838, lng: 79.9535, fullAddress: "Choithram Hospital, Jabalpur, MP" },
  { name: "Life Line Hospital",   area: "Healthcare",  lat: 23.1720, lng: 79.9470, fullAddress: "Life Line Hospital, Jabalpur, MP" },

  // ── Educational Institutions ─────────────────────────────────────────────────
  // RDU is on University Rd, Samanvay Nagar area
  { name: "Rani Durgavati University", area: "Education", lat: 23.1795, lng: 79.9698, fullAddress: "Rani Durgavati University, Jabalpur, MP" },
  // IIITDM campus, east of city
  { name: "IIITDM Jabalpur",      area: "Education",   lat: 23.1765, lng: 80.0260, fullAddress: "IIITDM Campus, Jabalpur, MP" },
  // JEC is near Medical College area
  { name: "Engineering College",  area: "Education",   lat: 23.1762, lng: 79.9560, fullAddress: "Jabalpur Engineering College, Jabalpur, MP" },
  { name: "Model School",         area: "Education",   lat: 23.1680, lng: 79.9415, fullAddress: "Model Higher Secondary School, Jabalpur, MP" },
  { name: "Christ Church School", area: "Education",   lat: 23.1640, lng: 79.9370, fullAddress: "Christ Church School, Civil Lines, Jabalpur, MP" },

  // ── Tourist Places ───────────────────────────────────────────────────────────
  // Bhedaghat town centre: 23.1259, 79.8018 — corrected (original 23.1089 was too far south)
  { name: "Bhedaghat",            area: "Tourist",     lat: 23.1259, lng: 79.8018, fullAddress: "Bhedaghat, Jabalpur, MP" },
  // Marble Rocks: boat ghat area
  { name: "Marble Rocks",         area: "Tourist",     lat: 23.1230, lng: 79.8010, fullAddress: "Marble Rocks, Bhedaghat, Jabalpur, MP" },
  // Dhuandhar Falls: OpenStreetMap verified = 23.1254, 79.8134
  { name: "Dhuandhar Falls",      area: "Tourist",     lat: 23.1254, lng: 79.8134, fullAddress: "Dhuandhar Falls, Bhedaghat, Jabalpur, MP" },
  { name: "Balancing Rock",       area: "Tourist",     lat: 23.1528, lng: 79.9138, fullAddress: "Balancing Rock, Madan Mahal, Jabalpur, MP" },
  { name: "Madan Mahal Fort",     area: "Tourist",     lat: 23.1520, lng: 79.9150, fullAddress: "Madan Mahal Fort, Jabalpur, MP" },
  // Tilwara Ghat: on Narmada, south of city — corrected
  { name: "Tilwara Ghat",         area: "Tourist",     lat: 23.1390, lng: 79.9440, fullAddress: "Tilwara Ghat, Jabalpur, MP" },
  { name: "Rani Durgavati Museum", area: "Tourist",    lat: 23.1645, lng: 79.9360, fullAddress: "Rani Durgavati Museum, Jabalpur, MP" },

  // ── Temples ──────────────────────────────────────────────────────────────────
  // Pisanhari Ki Madhiya: Jain temple south of city on Bheraghat Road — corrected
  { name: "Pisanhari Ki Madhiya", area: "Temple",      lat: 23.1405, lng: 79.9445, fullAddress: "Pisanhari Ki Madhiya, Jabalpur, MP" },
  // Chausath Yogini: hilltop at Bhedaghat — corrected from wrong coords
  { name: "Chausath Yogini Temple", area: "Temple",    lat: 23.1256, lng: 79.8035, fullAddress: "Chausath Yogini Temple, Bhedaghat, Jabalpur, MP" },
  { name: "Tripur Sundari Temple", area: "Temple",     lat: 23.1200, lng: 79.8950, fullAddress: "Tripur Sundari Temple, Jabalpur, MP" },
  { name: "Hanumantal",           area: "Temple",      lat: 23.1585, lng: 79.9275, fullAddress: "Hanumantal, Jabalpur, MP" },

  // ── Residential Areas ────────────────────────────────────────────────────────
  { name: "Gyangunj",             area: "Residential", lat: 23.1630, lng: 79.9225, fullAddress: "Gyangunj, Jabalpur, MP" },
  { name: "Khamaria",             area: "Residential", lat: 23.1945, lng: 79.9800, fullAddress: "Khamaria, Jabalpur, MP" },
  { name: "Shakti Nagar",         area: "Residential", lat: 23.1795, lng: 79.9580, fullAddress: "Shakti Nagar, Jabalpur, MP" },
  { name: "Ranjhi",               area: "Residential", lat: 23.2100, lng: 79.9430, fullAddress: "Ranjhi, Jabalpur, MP" },
  { name: "Garha",                area: "Residential", lat: 23.1450, lng: 79.9690, fullAddress: "Garha, Jabalpur, MP" },
  { name: "Tilhari",              area: "Residential", lat: 23.1930, lng: 79.9350, fullAddress: "Tilhari, Jabalpur, MP" },
  { name: "Gohalpur",             area: "Residential", lat: 23.1380, lng: 79.9100, fullAddress: "Gohalpur, Jabalpur, MP" },
  { name: "Cherital",             area: "Residential", lat: 23.1340, lng: 79.9230, fullAddress: "Cherital, Jabalpur, MP" },
  // Bargi: town ~20km south-east — corrected
  { name: "Bargi",                area: "Residential", lat: 23.0980, lng: 79.9300, fullAddress: "Bargi, Jabalpur, MP" },
  { name: "Rampur",               area: "Residential", lat: 23.1560, lng: 79.8930, fullAddress: "Rampur, Jabalpur, MP" },
  { name: "Bilhari",              area: "Residential", lat: 23.1290, lng: 79.8790, fullAddress: "Bilhari, Jabalpur, MP" },
  { name: "Katanga",              area: "Residential", lat: 23.1825, lng: 79.9720, fullAddress: "Katanga, Jabalpur, MP" },
  { name: "Lamti",                area: "Residential", lat: 23.1970, lng: 79.9570, fullAddress: "Lamti, Jabalpur, MP" },

  // ── Colonies ─────────────────────────────────────────────────────────────────
  { name: "Gupteshwar Colony",    area: "Colony",      lat: 23.1530, lng: 79.9170, fullAddress: "Gupteshwar Colony, Jabalpur, MP" },
  { name: "Nehru Nagar",          area: "Colony",      lat: 23.1680, lng: 79.9495, fullAddress: "Nehru Nagar, Jabalpur, MP" },
  { name: "South Civil Lines",    area: "Colony",      lat: 23.1595, lng: 79.9390, fullAddress: "South Civil Lines, Jabalpur, MP" },
  { name: "North Civil Lines",    area: "Colony",      lat: 23.1710, lng: 79.9460, fullAddress: "North Civil Lines, Jabalpur, MP" },
  { name: "Sanjeevani Nagar",     area: "Colony",      lat: 23.1850, lng: 79.9630, fullAddress: "Sanjeevani Nagar, Jabalpur, MP" },
  { name: "Madhav Nagar",         area: "Colony",      lat: 23.1760, lng: 79.9545, fullAddress: "Madhav Nagar, Jabalpur, MP" },
  { name: "Gora Bazar",           area: "Colony",      lat: 23.1625, lng: 79.9350, fullAddress: "Gora Bazar, Jabalpur, MP" },

  // ── Industrial Areas ─────────────────────────────────────────────────────────
  { name: "Richhai",              area: "Industrial",  lat: 23.2140, lng: 79.9350, fullAddress: "Richhai Industrial Area, Jabalpur, MP" },
  { name: "Ordnance Factory",     area: "Industrial",  lat: 23.1990, lng: 79.9240, fullAddress: "Ordnance Factory, Khamaria, Jabalpur, MP" },
  { name: "Gun Carriage Factory", area: "Industrial",  lat: 23.1920, lng: 79.9200, fullAddress: "Gun Carriage Factory, Jabalpur, MP" },
  { name: "Vehicle Factory",      area: "Industrial",  lat: 23.1940, lng: 79.9220, fullAddress: "Vehicle Factory, Jabalpur, MP" },

  // ── Parks & Recreation ───────────────────────────────────────────────────────
  { name: "Narmada Park",         area: "Park",        lat: 23.1635, lng: 79.9315, fullAddress: "Narmada Park, Jabalpur, MP" },
  // Dumna Nature Reserve: east of city near airport — corrected
  { name: "Dumna Nature Reserve", area: "Park",        lat: 23.1875, lng: 80.0180, fullAddress: "Dumna Nature Reserve, Jabalpur, MP" },
  { name: "Science Park",         area: "Park",        lat: 23.1755, lng: 79.9480, fullAddress: "Science Park, Jabalpur, MP" },

  // ── Airport ──────────────────────────────────────────────────────────────────
  // VAJB / JLR: confirmed 23.1778, 80.0520 by aviation databases
  { name: "Dumna Airport",        area: "Airport",     lat: 23.1778, lng: 80.0520, fullAddress: "Dumna Airport (JLR), Jabalpur, MP" },

  // ── Police Stations ──────────────────────────────────────────────────────────
  { name: "Kotwali Police Station",       area: "Police", lat: 23.1650, lng: 79.9395, fullAddress: "Kotwali Police Station, Jabalpur, MP" },
  { name: "Civil Lines Police Station",   area: "Police", lat: 23.1665, lng: 79.9440, fullAddress: "Civil Lines Police Station, Jabalpur, MP" },
  { name: "Gorakhpur Police Station",     area: "Police", lat: 23.2030, lng: 79.9550, fullAddress: "Gorakhpur Police Station, Jabalpur, MP" },

  // ── Government Offices ───────────────────────────────────────────────────────
  { name: "Collectorate",         area: "Government",  lat: 23.1655, lng: 79.9405, fullAddress: "District Collectorate, Jabalpur, MP" },
  // MP High Court: Civil Lines area — confirmed
  { name: "High Court",           area: "Government",  lat: 23.1660, lng: 79.9382, fullAddress: "Madhya Pradesh High Court, Jabalpur, MP" },
  { name: "Municipal Corporation", area: "Government", lat: 23.1648, lng: 79.9418, fullAddress: "Municipal Corporation, Jabalpur, MP" },

  // ── Hotels ───────────────────────────────────────────────────────────────────
  { name: "Hotel Kalchuri Residency", area: "Hotel",   lat: 23.1790, lng: 79.9540, fullAddress: "Hotel Kalchuri Residency, Jabalpur, MP" },
  { name: "Hotel Narmada Jacksons",   area: "Hotel",   lat: 23.1715, lng: 79.9495, fullAddress: "Hotel Narmada Jacksons, Jabalpur, MP" },
  { name: "Hotel Satya Ashoka",       area: "Hotel",   lat: 23.1680, lng: 79.9460, fullAddress: "Hotel Satya Ashoka, Jabalpur, MP" },

  // ── Additional Commercial Areas ──────────────────────────────────────────────
  { name: "Russel Chowk",         area: "Commercial",  lat: 23.1675, lng: 79.9430, fullAddress: "Russel Chowk, Jabalpur, MP" },
  { name: "Damoh Naka",           area: "Commercial",  lat: 23.1840, lng: 79.9620, fullAddress: "Damoh Naka, Jabalpur, MP" },
  { name: "Katni Naka",           area: "Commercial",  lat: 23.1915, lng: 79.9540, fullAddress: "Katni Naka, Jabalpur, MP" },
  { name: "Mandla Naka",          area: "Commercial",  lat: 23.1530, lng: 79.9120, fullAddress: "Mandla Naka, Jabalpur, MP" },
  { name: "Patan Naka",           area: "Commercial",  lat: 23.1390, lng: 79.9340, fullAddress: "Patan Naka, Jabalpur, MP" },

  // ── Landmarks ────────────────────────────────────────────────────────────────
  { name: "Shastri Bridge",       area: "Landmark",    lat: 23.1719, lng: 79.9565, fullAddress: "Shastri Bridge, Jabalpur, MP" },
  { name: "Bhavartal Garden",     area: "Park",        lat: 23.1664, lng: 79.9437, fullAddress: "Bhavartal Garden, Jabalpur, MP" },
  { name: "Wright Town Stadium",  area: "Sports",      lat: 23.1748, lng: 79.9532, fullAddress: "Wright Town Stadium, Jabalpur, MP" },
  { name: "Prem Nagar",           area: "Residential", lat: 23.1588, lng: 79.9184, fullAddress: "Prem Nagar, Jabalpur, MP" },
  { name: "Sneh Nagar",           area: "Residential", lat: 23.1617, lng: 79.9218, fullAddress: "Sneh Nagar, Jabalpur, MP" },
  { name: "Tilhari Colony",       area: "Colony",      lat: 23.1905, lng: 79.9338, fullAddress: "Tilhari Colony, Jabalpur, MP" },
  { name: "Maharajpur",           area: "Residential", lat: 23.1918, lng: 80.0135, fullAddress: "Maharajpur, Jabalpur, MP" },
  { name: "Dixitpura",            area: "Residential", lat: 23.1598, lng: 79.9357, fullAddress: "Dixitpura, Jabalpur, MP" },
  { name: "Bhanwartal",           area: "Residential", lat: 23.1652, lng: 79.9444, fullAddress: "Bhanwartal, Jabalpur, MP" },
  { name: "Shastri Nagar",        area: "Residential", lat: 23.1732, lng: 79.9498, fullAddress: "Shastri Nagar, Jabalpur, MP" },
  { name: "Kachhpura",            area: "Residential", lat: 23.1764, lng: 79.9443, fullAddress: "Kachhpura, Jabalpur, MP" },
  { name: "Ranital",              area: "Residential", lat: 23.1552, lng: 79.9321, fullAddress: "Ranital, Jabalpur, MP" },
  { name: "Madan Mahal Chowk",    area: "Commercial",  lat: 23.1545, lng: 79.9176, fullAddress: "Madan Mahal Chowk, Jabalpur, MP" },
  { name: "Howbagh",              area: "Residential", lat: 23.1659, lng: 79.9512, fullAddress: "Howbagh, Jabalpur, MP" },
  { name: "Shiv Nagar",           area: "Residential", lat: 23.1708, lng: 79.9572, fullAddress: "Shiv Nagar, Jabalpur, MP" },
  { name: "Raddi Chowki",         area: "Commercial",  lat: 23.1638, lng: 79.9469, fullAddress: "Raddi Chowki, Jabalpur, MP" },
  { name: "Ghamapur",             area: "Residential", lat: 23.1508, lng: 79.9398, fullAddress: "Ghamapur, Jabalpur, MP" },
  { name: "Suhagi",               area: "Residential", lat: 23.1958, lng: 79.9775, fullAddress: "Suhagi, Jabalpur, MP" },
  // Barela: town on Bhedaghat road, ~15km west — corrected
  { name: "Barela",               area: "Outskirts",   lat: 23.1200, lng: 79.8580, fullAddress: "Barela, Jabalpur, MP" },
  { name: "Karmeta",              area: "Residential", lat: 23.1865, lng: 79.9398, fullAddress: "Karmeta, Jabalpur, MP" },
  { name: "Saliwada",             area: "Residential", lat: 23.1741, lng: 79.9237, fullAddress: "Saliwada, Jabalpur, MP" },
  { name: "Dhanvantri Nagar",     area: "Colony",      lat: 23.1868, lng: 79.9652, fullAddress: "Dhanvantri Nagar, Jabalpur, MP" },
  { name: "Napier Chowk",         area: "Commercial",  lat: 23.1619, lng: 79.9366, fullAddress: "Napier Chowk, Jabalpur, MP" },
  { name: "Moti Nala",            area: "Residential", lat: 23.1640, lng: 79.9348, fullAddress: "Moti Nala, Jabalpur, MP" },
  { name: "Sadar Cantt",          area: "Cantonment",  lat: 23.1703, lng: 79.9468, fullAddress: "Sadar Cantt, Jabalpur, MP" },
  { name: "Kasturba Gandhi Ward", area: "Ward",        lat: 23.1620, lng: 79.9417, fullAddress: "Kasturba Gandhi Ward, Jabalpur, MP" },
  { name: "Krishna Nagar",        area: "Residential", lat: 23.1804, lng: 79.9598, fullAddress: "Krishna Nagar, Jabalpur, MP" },
  { name: "Saket Nagar",          area: "Colony",      lat: 23.1877, lng: 79.9681, fullAddress: "Saket Nagar, Jabalpur, MP" },
  { name: "Trimoorti Nagar",      area: "Colony",      lat: 23.1842, lng: 79.9716, fullAddress: "Trimoorti Nagar, Jabalpur, MP" },
  { name: "Anand Nagar",          area: "Residential", lat: 23.1775, lng: 79.9614, fullAddress: "Anand Nagar, Jabalpur, MP" },
  { name: "Telegraph Gate",       area: "Landmark",    lat: 23.1678, lng: 79.9459, fullAddress: "Telegraph Gate, Jabalpur, MP" },
  { name: "Gulaua Chowk",         area: "Commercial",  lat: 23.1464, lng: 79.9341, fullAddress: "Gulaua Chowk, Jabalpur, MP" },
  { name: "Badi Omti",            area: "Market",      lat: 23.1605, lng: 79.9329, fullAddress: "Badi Omti, Jabalpur, MP" },
  // Small Gwarighat: closer to main Gwarighat on Narmada
  { name: "Small Gwarighat",      area: "Residential", lat: 23.1327, lng: 79.9210, fullAddress: "Gwarighat Area, Jabalpur, MP" },
  { name: "Kanchghar",            area: "Residential", lat: 23.1602, lng: 79.9259, fullAddress: "Kanchghar, Jabalpur, MP" },
  { name: "Madan Mahal Hills",    area: "Tourist",     lat: 23.1511, lng: 79.9147, fullAddress: "Madan Mahal Hills, Jabalpur, MP" },
  // Bargi Hills: near Bargi Dam area
  { name: "Bargi Hills",          area: "Outskirts",   lat: 23.0835, lng: 79.9386, fullAddress: "Bargi Hills, Jabalpur, MP" },
  { name: "Amanpur",              area: "Residential", lat: 23.1489, lng: 79.9478, fullAddress: "Amanpur, Jabalpur, MP" },
  { name: "Ravindra Nagar",       area: "Colony",      lat: 23.1738, lng: 79.9526, fullAddress: "Ravindra Nagar, Jabalpur, MP" },
  { name: "SBI Chowk Vijay Nagar", area: "Commercial", lat: 23.1758, lng: 79.9998, fullAddress: "SBI Chowk, Vijay Nagar, Jabalpur, MP" },
  { name: "Ranjhi Market",        area: "Market",      lat: 23.2082, lng: 79.9445, fullAddress: "Ranjhi Market, Jabalpur, MP" },
  { name: "Adhartal Chowk",       area: "Commercial",  lat: 23.2128, lng: 79.9288, fullAddress: "Adhartal Chowk, Jabalpur, MP" },
  { name: "Kanchanpur",           area: "Residential", lat: 23.1689, lng: 79.9641, fullAddress: "Kanchanpur, Jabalpur, MP" },
  { name: "Apsara Talkies Square", area: "Landmark",   lat: 23.1669, lng: 79.9448, fullAddress: "Apsara Talkies Square, Jabalpur, MP" },
  { name: "Shukla Hotel Square",  area: "Landmark",    lat: 23.1687, lng: 79.9479, fullAddress: "Shukla Hotel Square, Jabalpur, MP" },
  { name: "MPEB Chowk",           area: "Commercial",  lat: 23.1714, lng: 79.9527, fullAddress: "MPEB Chowk, Jabalpur, MP" },
  { name: "Bhan Talaiya",         area: "Residential", lat: 23.1609, lng: 79.9391, fullAddress: "Bhan Talaiya, Jabalpur, MP" },
];

// Search function to filter locations based on input
export function searchJabalpurLocations(query: string): JabalpurLocation[] {
  if (!query || query.length < 1) return [];

  const lowerQuery = query.toLowerCase();
  const blockedRoadTerms = ["nh45", "nh 45", "nh-45", "highway", "national highway", "airport road", "dumna airport road"];

  return jabalpurLocations
    .filter(location =>
      location.name.toLowerCase().includes(lowerQuery) ||
      location.area.toLowerCase().includes(lowerQuery) ||
      location.fullAddress.toLowerCase().includes(lowerQuery)
    )
    .filter(location => {
      const haystack = `${location.name} ${location.fullAddress}`.toLowerCase();
      return !blockedRoadTerms.some((term) => haystack.includes(term));
    })
    .slice(0, 8);
}
