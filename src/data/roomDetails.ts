import { RoomDetail, RoomPhoto } from "../types";

type Palette = {
  start: string;
  end: string;
  accent: string;
};

type DetailSeed = Omit<RoomDetail, "photos"> & {
  title: string;
  neighborhood: string;
  palette: Palette;
  photoLabels: [string, string, string];
};

function createListingImage(title: string, neighborhood: string, caption: string, palette: Palette) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="${caption} at ${title}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.start}" />
          <stop offset="100%" stop-color="${palette.end}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" rx="48" fill="url(#bg)"/>
      <circle cx="952" cy="148" r="88" fill="rgba(255,255,255,0.24)"/>
      <path d="M0 612 C176 556 264 708 444 668 C648 620 742 452 948 500 C1076 530 1146 598 1200 648 L1200 800 L0 800 Z" fill="rgba(255,255,255,0.14)"/>
      <rect x="150" y="244" width="900" height="418" rx="36" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.34)" stroke-width="6"/>
      <rect x="206" y="308" width="302" height="296" rx="20" fill="rgba(255,255,255,0.28)"/>
      <rect x="544" y="308" width="454" height="124" rx="20" fill="rgba(255,255,255,0.28)"/>
      <rect x="544" y="460" width="218" height="144" rx="20" fill="rgba(255,255,255,0.28)"/>
      <rect x="782" y="460" width="216" height="144" rx="20" fill="rgba(255,255,255,0.28)"/>
      <rect x="238" y="342" width="236" height="228" rx="16" fill="${palette.accent}" opacity="0.72"/>
      <rect x="578" y="340" width="386" height="60" rx="16" fill="${palette.accent}" opacity="0.6"/>
      <rect x="578" y="492" width="152" height="80" rx="16" fill="${palette.accent}" opacity="0.48"/>
      <rect x="816" y="492" width="150" height="80" rx="16" fill="${palette.accent}" opacity="0.48"/>
      <text x="206" y="126" fill="white" font-size="42" font-family="'Segoe UI', Arial, sans-serif" opacity="0.92">${neighborhood}</text>
      <text x="206" y="180" fill="white" font-size="74" font-weight="700" font-family="'Segoe UI', Arial, sans-serif">${title}</text>
      <text x="206" y="714" fill="white" font-size="36" font-family="'Segoe UI', Arial, sans-serif" opacity="0.96">${caption}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildPhotos(title: string, neighborhood: string, palette: Palette, labels: [string, string, string]): RoomPhoto[] {
  return labels.map((label) => ({
    src: createListingImage(title, neighborhood, label, palette),
    alt: `${label} at ${title}`
  }));
}

const detailSeeds: Record<string, DetailSeed> = {
  "rm-101": {
    title: "Sunny room in Clifton terrace",
    neighborhood: "Clifton",
    palette: { start: "#6d9ac4", end: "#f0b57a", accent: "#fdf1dc" },
    summary: "Bright terrace room with a roof deck, fast transit access, and a calm weekday routine.",
    roomDescription: "The room gets strong morning light, has space for a desk by the window, and sits in a restored Clifton terrace with a shared kitchen-diner.",
    ownerNote: "The owner prefers renters who want a clean, low-drama house and can commit before the late summer rush.",
    bedrooms: 3,
    bathrooms: 2,
    currentOccupants: "2 current tenants",
    deposit: 1080,
    bills: "Broadband included, utilities split monthly",
    availableFromNote: "Viewings open now for an August move-in.",
    roomSize: "Medium double room with desk nook",
    idealFor: ["quiet nights", "short commute", "tidy shared kitchen"],
    houseHighlights: ["roof deck for evening study breaks", "dishwasher", "separate hallway storage"],
    houseRules: ["quiet after 10:30pm on weekdays", "guest notice in the group chat", "shared chore rota"],
    neighborhoodNotes: ["short walk to Clifton Down", "cafes and groceries nearby", "easy bus links into the centre"],
    photoLabels: ["Terrace front and street view", "Shared kitchen with breakfast bar", "Roof deck corner at sunset"]
  },
  "rm-102": {
    title: "Redland two-bed near Gloucester Road",
    neighborhood: "Redland",
    palette: { start: "#7da3a3", end: "#f3d2a2", accent: "#f9f2e2" },
    summary: "Organized Redland flat with a furnished room and practical house rules already in place.",
    roomDescription: "This flatshare is a compact two-bed with a furnished bedroom, a calm living room, and a detailed shared calendar pinned in the kitchen.",
    ownerNote: "The owner wants someone who values structure, pays on time, and is comfortable with a more orderly household.",
    bedrooms: 2,
    bathrooms: 1,
    currentOccupants: "1 current tenant",
    deposit: 1240,
    bills: "Council tax excluded, broadband and water included",
    availableFromNote: "Flexible move-in within the first week of September.",
    roomSize: "Furnished double room with wardrobe",
    idealFor: ["predictable routine", "clean common areas", "fast move-in"],
    houseHighlights: ["fully furnished room", "near Gloucester Road", "strong storage for a two-bed"],
    houseRules: ["shared calendar for cleaning and guests", "no smoking indoors", "overnight guests by agreement"],
    neighborhoodNotes: ["close to cafes and local shops", "good buses to campus", "walkable stretch of Redland and Cotham"],
    photoLabels: ["Front sitting room and bay window", "Furnished bedroom layout", "Kitchen table and storage wall"]
  },
  "rm-103": {
    title: "Bright room with gym and parking",
    neighborhood: "Temple Meads",
    palette: { start: "#577aa2", end: "#ccd9ed", accent: "#eef5ff" },
    summary: "Amenity-heavy option with parking, gym access, and a more social flat atmosphere.",
    roomDescription: "The room sits inside a modern block near Temple Meads and includes shared access to an on-site gym, resident parking, and a brighter open-plan common area.",
    ownerNote: "The owner is fine with a more active home as long as the building quiet hours are respected.",
    bedrooms: 2,
    bathrooms: 2,
    currentOccupants: "1 current tenant",
    deposit: 1325,
    bills: "Utilities separate, broadband included",
    availableFromNote: "Available from late August with evening viewing slots.",
    roomSize: "Large double room with en-suite access",
    idealFor: ["social home", "parking need", "gym routine"],
    houseHighlights: ["resident gym", "allocated parking", "modern kitchen appliances"],
    houseRules: ["weekend guests okay with notice", "keep shared room tidy after hosting", "respect building quiet hours"],
    neighborhoodNotes: ["very close to Temple Meads", "easy commute routes", "newer apartment block feel"],
    photoLabels: ["Apartment exterior and entry", "Open-plan living area", "Resident gym and shared amenity zone"]
  },
  "rm-104": {
    title: "Low-key room near Bishopston",
    neighborhood: "Bishopston",
    palette: { start: "#8694a7", end: "#d9c8ba", accent: "#f5efe8" },
    summary: "Budget-conscious private room with explicit boundaries and a quieter household style.",
    roomDescription: "This is a simpler house share with a smaller common area, clear house expectations, and a practical room for someone who mostly wants a stable base.",
    ownerNote: "The owner wants a renter who values privacy, direct communication, and predictable rent payments over a social house culture.",
    bedrooms: 3,
    bathrooms: 1,
    currentOccupants: "2 current tenants",
    deposit: 960,
    bills: "Bills split evenly each month",
    availableFromNote: "Move-in can shift slightly if the right renter is confirmed early.",
    roomSize: "Compact double room",
    idealFor: ["privacy-focused renter", "lower budget", "explicit guest rules"],
    houseHighlights: ["lower rent band", "clear house boundaries", "simple transport link into the centre"],
    houseRules: ["quiet hours after 10pm", "overnight guests are rare", "clean as you go in kitchen and bathroom"],
    neighborhoodNotes: ["residential stretch near Bishopston", "practical for buses and cycling", "less noisy than central areas"],
    photoLabels: ["Front entrance and bike area", "Bedroom corner and desk wall", "Shared kitchen and utility zone"]
  },
  "rm-105": {
    title: "Furnished room near Harbourside",
    neighborhood: "Harbourside",
    palette: { start: "#4f88a8", end: "#e9c193", accent: "#fff1d5" },
    summary: "Easy move-in furnished room with balanced social energy and strong transit access.",
    roomDescription: "The room comes furnished and sits in a flat that feels settled from day one, with enough common space for shared dinners or film nights without getting chaotic.",
    ownerNote: "The owner likes renters who communicate clearly and do not need a lot of setup help after moving in.",
    bedrooms: 3,
    bathrooms: 2,
    currentOccupants: "2 current tenants",
    deposit: 1160,
    bills: "Water and broadband included, energy split",
    availableFromNote: "Available by the end of August.",
    roomSize: "Furnished double room",
    idealFor: ["easy move-in", "balanced social vibe", "waterfront location"],
    houseHighlights: ["fully furnished", "dishwasher", "strong transit links"],
    houseRules: ["keep the lounge usable for everyone", "guest plans shared in advance", "no smoking indoors"],
    neighborhoodNotes: ["close to Harbourside", "walkable to the centre", "lots of evening activity nearby"],
    photoLabels: ["Harbourside block exterior", "Furnished bedroom and wardrobe", "Shared dining space and kitchen"]
  },
  "rm-106": {
    title: "Cotham flatshare with bright study corner",
    neighborhood: "Cotham",
    palette: { start: "#8cb2c3", end: "#f3c3a5", accent: "#fdf0e2" },
    summary: "Study-friendly Cotham flat with a desk-ready room and moderate social energy.",
    roomDescription: "This flatshare is set up for focused weeks: bright desk zone, practical storage, and a shared living room that is used more for quiet downtime than hosting.",
    ownerNote: "The owner wants someone who will treat the room as a long-term study base rather than a short-stay stopgap.",
    bedrooms: 3,
    bathrooms: 1,
    currentOccupants: "2 current tenants",
    deposit: 1185,
    bills: "Broadband included, utilities shared",
    availableFromNote: "September start with weekday viewings available.",
    roomSize: "Double room with study corner",
    idealFor: ["study-heavy routine", "quiet weeknights", "furnished setup"],
    houseHighlights: ["built-in study nook", "dishwasher", "strong natural light"],
    houseRules: ["shared supplies tracked together", "quiet after 11pm", "respect work-from-home days"],
    neighborhoodNotes: ["between Redland and the centre", "good walking routes", "close to libraries and cafes"],
    photoLabels: ["Street view and front steps", "Desk corner by the window", "Living room and kitchen transition"]
  },
  "rm-107": {
    title: "Garden-level room in Bedminster",
    neighborhood: "Bedminster",
    palette: { start: "#77a17f", end: "#dfc69b", accent: "#f5f3df" },
    summary: "Lower-rent Bedminster option with outdoor access and a practical house setup.",
    roomDescription: "The room sits on the garden level with quick access to the back patio, making it useful for someone who wants lower rent without giving up basic amenities.",
    ownerNote: "The owner prefers renters who are easy to coordinate with and happy with a straightforward house setup.",
    bedrooms: 3,
    bathrooms: 1,
    currentOccupants: "2 current tenants",
    deposit: 985,
    bills: "Bills excluded, previous totals shared in the chat",
    availableFromNote: "Late-August move-in possible.",
    roomSize: "Standard double room",
    idealFor: ["budget-conscious renter", "pet-friendly need", "parking option"],
    houseHighlights: ["garden access", "parking option", "lower monthly rent"],
    houseRules: ["visitors by message first", "keep shared patio tidy", "rent transfers by standing order"],
    neighborhoodNotes: ["good for South Bristol routes", "shops nearby", "less central but practical"],
    photoLabels: ["Garden-level entrance", "Bedroom and patio door", "Back patio and utility area"]
  },
  "rm-108": {
    title: "Quiet Stoke Bishop room near green space",
    neighborhood: "Stoke Bishop",
    palette: { start: "#6f93a6", end: "#dce6cf", accent: "#f0f7ea" },
    summary: "Quiet, lower-cost Stoke Bishop room for early routines and strict weekday calm.",
    roomDescription: "The room is simple but bright, with a view toward green space and a house rhythm built around early mornings and quiet evenings.",
    ownerNote: "The owner is prioritizing reliability and calm living habits over social fit.",
    bedrooms: 4,
    bathrooms: 2,
    currentOccupants: "3 current tenants",
    deposit: 915,
    bills: "Fixed monthly bills bundle available",
    availableFromNote: "September move-in preferred.",
    roomSize: "Compact double with built-in storage",
    idealFor: ["early starts", "quiet weekdays", "lower rent"],
    houseHighlights: ["green outlook", "predictable quiet routine", "fixed bills option"],
    houseRules: ["quiet after 10pm", "bathroom rota shared weekly", "overnight guests very limited"],
    neighborhoodNotes: ["near green space", "bus route into the city", "more residential feel"],
    photoLabels: ["Exterior with green outlook", "Bedroom wall and storage", "Shared kitchen and breakfast corner"]
  },
  "rm-109": {
    title: "Southville room above a shared kitchen-diner",
    neighborhood: "Southville",
    palette: { start: "#8a735f", end: "#e6b794", accent: "#fff0e2" },
    summary: "Social Southville option with shared dinners, brighter common space, and central access.",
    roomDescription: "This house leans more social than average, with the room positioned above a large shared kitchen-diner that gets used most evenings.",
    ownerNote: "The owner is happy with a friendly atmosphere but still expects the house to stay respectful and clean after hosting.",
    bedrooms: 4,
    bathrooms: 2,
    currentOccupants: "3 current tenants",
    deposit: 1120,
    bills: "Utilities separate, broadband included",
    availableFromNote: "August move-in with flexible first-week handover.",
    roomSize: "Double room with shelving",
    idealFor: ["social home", "shared cooking", "central neighborhood"],
    houseHighlights: ["large kitchen-diner", "dishwasher", "easy walk into town"],
    houseRules: ["group chat used for visitors", "shared meals optional not expected", "reset common areas after hosting"],
    neighborhoodNotes: ["lively Southville stretch", "food spots nearby", "good cycle routes"],
    photoLabels: ["Street-facing exterior and row houses", "Kitchen-diner setup", "Bedroom and shelf wall"]
  },
  "rm-110": {
    title: "Montpelier warehouse-style double room",
    neighborhood: "Montpelier",
    palette: { start: "#4e6177", end: "#d5a987", accent: "#f2e5d8" },
    summary: "Creative Montpelier flat with a stronger amenities package and a more outgoing feel.",
    roomDescription: "The double room sits in a warehouse-style conversion with higher ceilings, larger shared spaces, and a roof deck used most during weekends.",
    ownerNote: "The owner wants clear conversations about noise because the flat is social but not chaotic.",
    bedrooms: 3,
    bathrooms: 2,
    currentOccupants: "2 current tenants",
    deposit: 1270,
    bills: "Broadband included, other bills shared",
    availableFromNote: "September move-in preferred after current lease handover.",
    roomSize: "Large double with industrial-style window",
    idealFor: ["creative renter", "amenity-heavy setup", "comfortable with weekend hosting"],
    houseHighlights: ["roof deck", "dishwasher", "larger shared lounge"],
    houseRules: ["quiet hours agreed in advance", "roof deck closes earlier on weeknights", "message before bringing groups over"],
    neighborhoodNotes: ["creative part of Bristol", "good rail and bus access", "more character-led housing stock"],
    photoLabels: ["Warehouse-style exterior", "High-ceiling bedroom", "Roof deck with seating"]
  },
  "rm-111": {
    title: "Totterdown hilltop room with parking",
    neighborhood: "Totterdown",
    palette: { start: "#7890b1", end: "#f0c6a1", accent: "#fff2e3" },
    summary: "Practical Totterdown room with parking, solid commute, and a well-structured house rhythm.",
    roomDescription: "This house is a strong all-rounder: stable lease, decent room size, practical parking, and enough common space without trying to be overly social.",
    ownerNote: "The owner likes renters who are organized, financially reliable, and comfortable using written house expectations.",
    bedrooms: 3,
    bathrooms: 2,
    currentOccupants: "2 current tenants",
    deposit: 1035,
    bills: "Utilities split equally, parking permit handled separately",
    availableFromNote: "Late-August move-in available.",
    roomSize: "Double room with under-bed storage",
    idealFor: ["balanced routine", "parking need", "structured house"],
    houseHighlights: ["parking", "short commute", "good lease stability"],
    houseRules: ["house agreement shared before move-in", "guest plans discussed first", "keep parking access clear"],
    neighborhoodNotes: ["hilltop Totterdown location", "easy route to Temple Meads", "residential but connected"],
    photoLabels: ["Front steps and parking area", "Bedroom and storage layout", "Shared lounge and dining corner"]
  },
  "rm-112": {
    title: "Redcliffe apartment room near Temple Meads",
    neighborhood: "Redcliffe",
    palette: { start: "#5b79a6", end: "#d2d8e7", accent: "#eef3ff" },
    summary: "Commute-first Redcliffe apartment with a tidy shared setup and polished common spaces.",
    roomDescription: "This apartment is ideal for someone who wants a short commute, furnished move-in, and a flatter that feels presentable rather than improvised.",
    ownerNote: "The owner is looking for a renter who values the apartment staying presentable and keeps weekday noise low.",
    bedrooms: 2,
    bathrooms: 2,
    currentOccupants: "1 current tenant",
    deposit: 1210,
    bills: "Water and broadband included, energy separate",
    availableFromNote: "Move-in fixed for early September unless arranged earlier.",
    roomSize: "Furnished double with built-in wardrobe",
    idealFor: ["commute-first choice", "tidy apartment", "central location"],
    houseHighlights: ["very short commute", "furnished room", "dishwasher and laundry"],
    houseRules: ["weekday quiet by 10:30pm", "shared items restocked together", "keep living room guest-ready"],
    neighborhoodNotes: ["steps from Temple Meads routes", "easy city access", "newer apartment building feel"],
    photoLabels: ["Apartment exterior near station", "Bedroom and wardrobe wall", "Kitchen island and lounge setup"]
  }
};

export const roomDetailById: Record<string, RoomDetail> = Object.fromEntries(
  Object.entries(detailSeeds).map(([id, seed]) => [
    id,
    {
      summary: seed.summary,
      roomDescription: seed.roomDescription,
      ownerNote: seed.ownerNote,
      bedrooms: seed.bedrooms,
      bathrooms: seed.bathrooms,
      currentOccupants: seed.currentOccupants,
      deposit: seed.deposit,
      bills: seed.bills,
      availableFromNote: seed.availableFromNote,
      roomSize: seed.roomSize,
      idealFor: seed.idealFor,
      houseHighlights: seed.houseHighlights,
      houseRules: seed.houseRules,
      neighborhoodNotes: seed.neighborhoodNotes,
      photos: buildPhotos(seed.title, seed.neighborhood, seed.palette, seed.photoLabels)
    }
  ])
) as Record<string, RoomDetail>;
