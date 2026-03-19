import { OwnerCandidate, OwnerListingDraft } from "../types";

export const initialOwnerListing: OwnerListingDraft = {
  title: "Sunny spare room near Clifton Village",
  neighborhood: "Clifton",
  monthlyRent: 980,
  availableFrom: "2026-09-01",
  leaseLength: "12 months",
  roomSize: "Large double room",
  bathrooms: "2 bathrooms",
  householdSize: "2 people total",
  bills: "Bills split monthly, around GBP140",
  summary:
    "Bright upper-floor room in a calm Bristol flatshare with space to work from home, a tidy kitchen, and easy bus access into the city centre.",
  houseRules:
    "Quiet after 11pm on weekdays, guests planned ahead, shared cleaning rota every Sunday evening, no smoking inside.",
  petFriendly: false,
  amenities: ["Laundry", "Dishwasher", "Near transit", "Furnished"],
  photoUrls: [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80"
  ]
};

export const ownerCandidateMatches: OwnerCandidate[] = [
  {
    id: "oc-101",
    name: "Ella Morgan",
    age: 23,
    major: "Psychology",
    budget: "GBP900-GBP1,050",
    moveInWindow: "Late August to early September",
    leasePreference: "10-12 months",
    vibe: "Clean routine, calm weekdays, likes a friendly flat without constant hosting",
    bio:
      "Usually on campus during the day, likes a quiet kitchen after work, and prefers setting expectations early instead of figuring things out through conflict.",
    profilePhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
    highlights: ["Tidy shared spaces", "Stable budget", "Longer lease preferred"],
    whyMatch: [
      "Lifestyle answers line up strongly on quiet evenings and cleaning habits",
      "Budget sits inside the rent band for this room without stretching",
      "Privacy expectations are balanced, which suits a two-person flatshare"
    ],
    quickQuestions: [
      "How do you usually handle shared chores?",
      "Would you want a trial coffee chat before a viewing?",
      "How often do friends stay over?"
    ],
    compatibilityTarget: {
      basics: 4.2,
      lifestyle: 4.4,
      interests: 3.2,
      dealbreakers: 4.3,
      privacy: 3.8
    }
  },
  {
    id: "oc-102",
    name: "Milo Carter",
    age: 24,
    major: "Architecture",
    budget: "GBP950-GBP1,120",
    moveInWindow: "September",
    leasePreference: "12 months",
    vibe: "Organized, respectful, likes a social dinner now and then but keeps the flat calm",
    bio:
      "Hybrid schedule with a few studio days in Bristol, prefers clean shared areas, and likes discussing guest rules up front so nobody has to guess.",
    profilePhoto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    highlights: ["Good communicator", "Open to shared cooking", "Predictable weekly routine"],
    whyMatch: [
      "Strong overlap on structure, direct communication, and moderate social energy",
      "Lease timing and move-in window fit your listing cleanly",
      "Would likely respect a simple guest-planning rule"
    ],
    quickQuestions: [
      "Do you usually work from home or mostly elsewhere?",
      "How important is furnished storage for you?",
      "Would you be okay with a Sunday cleaning rota?"
    ],
    compatibilityTarget: {
      basics: 4.1,
      lifestyle: 4.0,
      interests: 3.4,
      dealbreakers: 4.1,
      privacy: 3.7
    }
  },
  {
    id: "oc-103",
    name: "Nia Campbell",
    age: 22,
    major: "Psychology",
    budget: "GBP980-GBP1,180",
    moveInWindow: "Early September",
    leasePreference: "12 months",
    vibe: "Morning routine, clean bathroom habits, likes a peaceful home base",
    bio:
      "Keeps a pretty consistent weekday schedule, enjoys low-key evenings, and wants a flatshare where boundaries and shared responsibilities are obvious.",
    profilePhoto:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
    highlights: ["Boundary-aware", "Good fit for quiet homes", "Reliable routine"],
    whyMatch: [
      "Very close fit on cleanliness and weeknight quiet expectations",
      "Room budget and move-in timing line up with the listing",
      "Must-haves suggest this renter values the same kind of house rhythm"
    ],
    quickQuestions: [
      "What makes a shared space feel respectful to you?",
      "Do you ever host family overnight?",
      "Would you want separate shelves in the kitchen by default?"
    ],
    compatibilityTarget: {
      basics: 4.3,
      lifestyle: 4.5,
      interests: 3.0,
      dealbreakers: 4.4,
      privacy: 4.2
    }
  },
  {
    id: "oc-104",
    name: "Rory Walsh",
    age: 26,
    major: "Graphic Design",
    budget: "GBP850-GBP1,000",
    moveInWindow: "Mid September",
    leasePreference: "6-12 months",
    vibe: "Relaxed, practical, prefers a friendly flat without too many surprises",
    bio:
      "Works freelance, cares about fair bills and clear expectations, and likes homes that are social enough to feel warm but not loud every night.",
    profilePhoto:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80",
    highlights: ["Budget-conscious", "Easygoing communication", "Guest rules matter"],
    whyMatch: [
      "Solid fit on direct communication and practical household rules",
      "Budget is slightly lower but still realistic for this room",
      "Would likely respond well to a tidy but not rigid flat setup"
    ],
    quickQuestions: [
      "Would you want bills all split evenly every month?",
      "How often do you work from home?",
      "What kind of shared-space noise level feels normal to you?"
    ],
    compatibilityTarget: {
      basics: 3.8,
      lifestyle: 3.7,
      interests: 3.3,
      dealbreakers: 4.0,
      privacy: 3.6
    }
  },
  {
    id: "oc-105",
    name: "Leila Hassan",
    age: 24,
    major: "Law",
    budget: "GBP900-GBP1,050",
    moveInWindow: "Late August",
    leasePreference: "12 months",
    vibe: "Low-drama, study-focused, likes predictable shared spaces and quiet sleep hours",
    bio:
      "Often studies late but keeps noise low, values cleanliness, and prefers a home where guests are reasonable and boundaries are easy to understand.",
    profilePhoto:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=80",
    highlights: ["Quiet routine", "Strong lease fit", "Clear boundaries"],
    whyMatch: [
      "Strong alignment on guest rules and calm weeknight routines",
      "Would suit a room where the host wants structure without friction",
      "Privacy and dealbreaker scores are especially close"
    ],
    quickQuestions: [
      "Do you prefer cleaning as a rota or just as needed?",
      "Would you ever want to share groceries?",
      "How early do you usually wake up on weekdays?"
    ],
    compatibilityTarget: {
      basics: 4.0,
      lifestyle: 4.3,
      interests: 2.9,
      dealbreakers: 4.5,
      privacy: 4.3
    }
  },
  {
    id: "oc-106",
    name: "Samir Ali",
    age: 25,
    major: "Medicine",
    budget: "GBP1,000-GBP1,200",
    moveInWindow: "September",
    leasePreference: "12 months",
    vibe: "Private, respectful, wants a home that feels stable and easy to decompress in",
    bio:
      "Long placement hours mean he values a straightforward flatshare with very clear guest rules, fair cleaning expectations, and low common-area chaos.",
    profilePhoto:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=700&q=80",
    highlights: ["Privacy-first", "Reliable income", "Low-noise preference"],
    whyMatch: [
      "Very good fit if you want a roommate who values calm and predictability",
      "Budget and lease preferences are fully aligned with the room",
      "Would likely respect household boundaries with little prompting"
    ],
    quickQuestions: [
      "How often is overnight hosting okay in your flat?",
      "Would you expect quiet hours to be explicit?",
      "How do you usually divide fridge and cupboard space?"
    ],
    compatibilityTarget: {
      basics: 4.1,
      lifestyle: 4.2,
      interests: 2.8,
      dealbreakers: 4.4,
      privacy: 4.5
    }
  }
];
