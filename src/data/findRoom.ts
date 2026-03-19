import { FiltersState, RoommateMatch } from "../types";

export const defaultFilters: FiltersState = {
  maxRent: 1400,
  maxCommute: 45,
  petFriendly: "any",
  amenities: []
};

export const amenityOptions = [
  "Laundry",
  "Dishwasher",
  "Gym",
  "Roof deck",
  "Near transit",
  "Parking",
  "Furnished"
] as const;

export const roomMatches: RoommateMatch[] = [
  {
    id: "rm-101",
    roomTitle: "Sunny room in Clifton terrace",
    neighborhood: "Clifton",
    monthlyRent: 1080,
    moveIn: "2026-08-18",
    leaseLength: "12 months",
    commuteMinutes: 22,
    petFriendly: true,
    amenities: ["Laundry", "Dishwasher", "Near transit", "Roof deck"],
    compatibilityTarget: {
      basics: 4.3,
      lifestyle: 4.5,
      interests: 3.1,
      dealbreakers: 4.3,
      privacy: 3.8
    },
    roommate: {
      name: "Maya Patel",
      age: 22,
      major: "Computer Science",
      vibe: "Early riser, tidy, low-drama home routine",
      bio: "Prefers calm weeknights, shared meal prep, and clear chore rotation."
    },
    whyMatch: [
      "Budget sits inside the most common target band",
      "Quiet evening routine lines up with tidy shared spaces",
      "Commute stays under 25 minutes"
    ],
    quickQuestions: [
      "How do you split chores right now?",
      "What time does the apartment usually wind down?",
      "Would a friend visit on weekdays be okay?"
    ]
  },
  {
    id: "rm-102",
    roomTitle: "Redland two-bed near Gloucester Road",
    neighborhood: "Redland",
    monthlyRent: 1240,
    moveIn: "2026-09-01",
    leaseLength: "12 months",
    commuteMinutes: 18,
    petFriendly: false,
    amenities: ["Laundry", "Near transit", "Furnished"],
    compatibilityTarget: {
      basics: 4.0,
      lifestyle: 3.9,
      interests: 3.5,
      dealbreakers: 4.1,
      privacy: 4.0
    },
    roommate: {
      name: "Ari Bennett",
      age: 24,
      major: "Architecture",
      vibe: "Organized, calm, likes clean common areas",
      bio: "Works hybrid, hosts a friend for dinner sometimes, keeps a detailed household calendar."
    },
    whyMatch: [
      "Strong match on structure and clear house rules",
      "Fast transit access and furnished room lower move-in friction",
      "Host already prefers quiet common areas"
    ],
    quickQuestions: [
      "How flexible is the move-in date?",
      "What are the guest rules?",
      "Do you share groceries or keep things separate?"
    ]
  },
  {
    id: "rm-103",
    roomTitle: "Bright room with gym and parking",
    neighborhood: "Temple Meads",
    monthlyRent: 1325,
    moveIn: "2026-08-25",
    leaseLength: "9 months",
    commuteMinutes: 28,
    petFriendly: true,
    amenities: ["Gym", "Parking", "Dishwasher", "Laundry"],
    compatibilityTarget: {
      basics: 3.6,
      lifestyle: 3.2,
      interests: 4.4,
      dealbreakers: 3.6,
      privacy: 3.2
    },
    roommate: {
      name: "Jordan Park",
      age: 23,
      major: "Mechanical Engineering",
      vibe: "Active, social, likes shared dinners and weekend plans",
      bio: "Often at the gym, likes inviting friends over on Saturdays, keeps weeknights respectful."
    },
    whyMatch: [
      "Shared social energy and activity level are high",
      "Room package includes amenities that justify the higher rent",
      "Good option if pet-friendly matters"
    ],
    quickQuestions: [
      "How often do friends come by?",
      "Do you prefer cooking together?",
      "Is parking included in the base rent?"
    ]
  },
  {
    id: "rm-104",
    roomTitle: "Low-key room near Bishopston",
    neighborhood: "Bishopston",
    monthlyRent: 960,
    moveIn: "2026-09-10",
    leaseLength: "6 months",
    commuteMinutes: 34,
    petFriendly: false,
    amenities: ["Near transit", "Laundry"],
    compatibilityTarget: {
      basics: 3.7,
      lifestyle: 4.2,
      interests: 2.9,
      dealbreakers: 4.4,
      privacy: 4.5
    },
    roommate: {
      name: "Sofia Rivera",
      age: 25,
      major: "Business Analytics",
      vibe: "Private, organized, prefers direct communication",
      bio: "Keeps to herself during the week, values respectful quiet and clear boundaries."
    },
    whyMatch: [
      "Best option for tighter privacy and explicit guest rules",
      "Lower rent gives more budget margin",
      "Boundary-heavy household style matches dealbreaker-first profiles"
    ],
    quickQuestions: [
      "What are your quiet hours?",
      "Would you ever renew past six months?",
      "How do you handle overnight guests?"
    ]
  },
  {
    id: "rm-105",
    roomTitle: "Furnished room near Harbourside",
    neighborhood: "Harbourside",
    monthlyRent: 1160,
    moveIn: "2026-08-30",
    leaseLength: "12 months",
    commuteMinutes: 26,
    petFriendly: true,
    amenities: ["Furnished", "Near transit", "Dishwasher", "Laundry"],
    compatibilityTarget: {
      basics: 4.1,
      lifestyle: 3.5,
      interests: 4.0,
      dealbreakers: 3.8,
      privacy: 3.5
    },
    roommate: {
      name: "Noah Chen",
      age: 24,
      major: "Media Studies",
      vibe: "Friendly, flexible, likes movie nights but keeps the apartment respectful",
      bio: "Good communicator, open to shared cooking, and likes a furnished place that is easy to settle into."
    },
    whyMatch: [
      "Move-in is straightforward because the room is furnished",
      "Balanced social vibe without being too loud",
      "Pet-friendly and transit-accessible"
    ],
    quickQuestions: [
      "Are utilities included?",
      "What is the guest policy?",
      "Would you do a video tour first?"
    ]
  },
  {
    id: "rm-106",
    roomTitle: "Cotham flatshare with bright study corner",
    neighborhood: "Cotham",
    monthlyRent: 1185,
    moveIn: "2026-09-03",
    leaseLength: "10 months",
    commuteMinutes: 19,
    petFriendly: false,
    amenities: ["Laundry", "Dishwasher", "Furnished", "Near transit"],
    compatibilityTarget: {
      basics: 4.2,
      lifestyle: 4.0,
      interests: 3.2,
      dealbreakers: 4.0,
      privacy: 3.9
    },
    roommate: {
      name: "Amelia Brooks",
      age: 23,
      major: "English Literature",
      vibe: "Calm, studious, likes a clean kitchen and soft background music",
      bio: "Usually works from the library, keeps shared spaces neat, and prefers clear communication over passive-aggressive notes."
    },
    whyMatch: [
      "Balanced fit for tidy routines and moderate social energy",
      "Furnished setup makes move-in lighter",
      "Commute stays short without pushing rent to the top of the range"
    ],
    quickQuestions: [
      "How do you handle cleaning supplies and shared basics?",
      "Do you usually work from home or campus?",
      "Would you be open to a video call before a viewing?"
    ]
  },
  {
    id: "rm-107",
    roomTitle: "Garden-level room in Bedminster",
    neighborhood: "Bedminster",
    monthlyRent: 985,
    moveIn: "2026-08-22",
    leaseLength: "12 months",
    commuteMinutes: 31,
    petFriendly: true,
    amenities: ["Laundry", "Near transit", "Parking"],
    compatibilityTarget: {
      basics: 3.8,
      lifestyle: 3.7,
      interests: 3.4,
      dealbreakers: 4.1,
      privacy: 3.6
    },
    roommate: {
      name: "Rory Walsh",
      age: 26,
      major: "Graphic Design",
      vibe: "Relaxed, practical, likes a friendly home without constant hosting",
      bio: "Works freelance, values fair bills and clean shared spaces, and prefers guests to be planned ahead."
    },
    whyMatch: [
      "One of the lower-rent options without stretching commute too far",
      "Pet-friendly setup supports renters who need that filter",
      "House expectations are clear without feeling overly strict"
    ],
    quickQuestions: [
      "How are bills split each month?",
      "What is the parking situation like in practice?",
      "How often do you usually have visitors over?"
    ]
  },
  {
    id: "rm-108",
    roomTitle: "Quiet Stoke Bishop room near green space",
    neighborhood: "Stoke Bishop",
    monthlyRent: 915,
    moveIn: "2026-09-14",
    leaseLength: "9 months",
    commuteMinutes: 17,
    petFriendly: false,
    amenities: ["Furnished", "Laundry", "Near transit"],
    compatibilityTarget: {
      basics: 4.0,
      lifestyle: 4.6,
      interests: 2.8,
      dealbreakers: 4.4,
      privacy: 4.2
    },
    roommate: {
      name: "Priya Shah",
      age: 22,
      major: "Neuroscience",
      vibe: "Early routine, quiet evenings, likes a highly predictable flat",
      bio: "Usually up early for placements, prefers respectful housemates, and keeps a structured weekly cleaning schedule."
    },
    whyMatch: [
      "Strong fit for early starts and quieter home routines",
      "Lower rent with a short commute creates good value",
      "Privacy and boundary expectations are already explicit"
    ],
    quickQuestions: [
      "What time do weekdays usually start in the flat?",
      "Do you use a chore rota or shared checklist?",
      "Would the lease likely renew after nine months?"
    ]
  },
  {
    id: "rm-109",
    roomTitle: "Southville room above a shared kitchen-diner",
    neighborhood: "Southville",
    monthlyRent: 1120,
    moveIn: "2026-08-28",
    leaseLength: "12 months",
    commuteMinutes: 24,
    petFriendly: true,
    amenities: ["Dishwasher", "Laundry", "Near transit", "Furnished"],
    compatibilityTarget: {
      basics: 4.1,
      lifestyle: 3.4,
      interests: 4.3,
      dealbreakers: 3.7,
      privacy: 3.2
    },
    roommate: {
      name: "Ellis Morgan",
      age: 24,
      major: "Film Studies",
      vibe: "Creative, sociable, likes shared dinners and the occasional group plan",
      bio: "Enjoys a lively but respectful flat, often cooks with housemates, and keeps late nights mostly to weekends."
    },
    whyMatch: [
      "Better match for renters who want a social home atmosphere",
      "Furnished room and dishwasher reduce day-one friction",
      "Transit access stays solid while keeping a central neighborhood"
    ],
    quickQuestions: [
      "How often do flat dinners or movie nights happen?",
      "Are overnight guests okay on weekends?",
      "Is there storage space for a bike?"
    ]
  },
  {
    id: "rm-110",
    roomTitle: "Montpelier warehouse-style double room",
    neighborhood: "Montpelier",
    monthlyRent: 1270,
    moveIn: "2026-09-07",
    leaseLength: "12 months",
    commuteMinutes: 20,
    petFriendly: false,
    amenities: ["Laundry", "Dishwasher", "Near transit", "Roof deck"],
    compatibilityTarget: {
      basics: 3.9,
      lifestyle: 3.3,
      interests: 4.5,
      dealbreakers: 3.5,
      privacy: 3.1
    },
    roommate: {
      name: "Jules Carter",
      age: 25,
      major: "Music Technology",
      vibe: "Creative, outgoing, likes a stylish shared space with clear quiet hours",
      bio: "Works on music projects during the day, keeps evenings social but manageable, and wants upfront conversations about noise."
    },
    whyMatch: [
      "Higher-energy renters will fit the shared vibe better here",
      "Roof deck and location create a stronger amenities package",
      "Commute remains efficient despite the more premium rent"
    ],
    quickQuestions: [
      "What are the quiet hours for the building?",
      "How often is the roof deck used for hosting?",
      "Are utilities stable across the year?"
    ]
  },
  {
    id: "rm-111",
    roomTitle: "Totterdown hilltop room with parking",
    neighborhood: "Totterdown",
    monthlyRent: 1035,
    moveIn: "2026-08-26",
    leaseLength: "12 months",
    commuteMinutes: 16,
    petFriendly: true,
    amenities: ["Laundry", "Parking", "Near transit"],
    compatibilityTarget: {
      basics: 4.4,
      lifestyle: 3.8,
      interests: 3.3,
      dealbreakers: 4.2,
      privacy: 3.7
    },
    roommate: {
      name: "Nadia Green",
      age: 23,
      major: "Economics",
      vibe: "Organized, communicative, flexible but not messy",
      bio: "Works partly from home, prefers planned guests, and likes having house expectations written down early."
    },
    whyMatch: [
      "High practical fit on commute, lease stability, and house structure",
      "Parking plus pet-friendly policy makes this one more versatile",
      "Good midpoint option between strict and social household styles"
    ],
    quickQuestions: [
      "Would you be open to signing a shared house agreement?",
      "How often is the parking space available?",
      "Do you expect the house to renew next year?"
    ]
  },
  {
    id: "rm-112",
    roomTitle: "Redcliffe apartment room near Temple Meads",
    neighborhood: "Redcliffe",
    monthlyRent: 1210,
    moveIn: "2026-09-05",
    leaseLength: "11 months",
    commuteMinutes: 12,
    petFriendly: false,
    amenities: ["Furnished", "Dishwasher", "Laundry", "Near transit"],
    compatibilityTarget: {
      basics: 4.5,
      lifestyle: 3.9,
      interests: 3.6,
      dealbreakers: 4.0,
      privacy: 3.8
    },
    roommate: {
      name: "Daniel Okafor",
      age: 24,
      major: "Finance",
      vibe: "Structured, friendly, prefers a polished apartment over a chaotic one",
      bio: "Usually keeps weekday nights quiet, likes the apartment to stay presentable, and values a very short commute."
    },
    whyMatch: [
      "Best fit for commute-first renters who still want a tidy shared home",
      "Strong practical match on furnished move-in and lease length",
      "Good option for people who want central access without a party flat"
    ],
    quickQuestions: [
      "How strict are the weekday quiet hours?",
      "Is the move-in date fixed or flexible?",
      "Do you expect shared items to be bought together?"
    ]
  }
];
