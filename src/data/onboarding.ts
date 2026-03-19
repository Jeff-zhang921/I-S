import {
  AccountState,
  CategoryMeta,
  MatchTarget,
  PrivacyLevelOption,
  ProfileNotesState,
  Question,
  ScaleChoice,
  StarterAccount
} from "../types";

export const DEMO_VERIFICATION_CODE = "246810";

export const screenTitles = {
  account: "Create account",
  verify: "Verify identity",
  quiz: "Questionnaire",
  summary: "Profile summary",
  pathChoice: "Choose path",
  browseListings: "Browse listings",
  filters: "Filters",
  suggestions: "Suggestions",
  matchFeed: "Match feed",
  matchDetail: "Match detail",
  savedList: "Saved list",
  sendIntro: "Send intro",
  profile: "Profile",
  groupChat: "Group chat",
  chatThread: "Chat thread"
} as const;

export const categoryMeta: CategoryMeta[] = [
  {
    id: "basics",
    title: "Basics",
    summary: "Budget, timing, and move-in priorities.",
    accent: "coral"
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    summary: "Daily routine and home habits.",
    accent: "mint"
  },
  {
    id: "interests",
    title: "Interests",
    summary: "Shared energy, hobbies, and social fit.",
    accent: "blue"
  },
  {
    id: "dealbreakers",
    title: "Boundaries",
    summary: "Must-haves and non-negotiables.",
    accent: "gold"
  },
  {
    id: "privacy",
    title: "Safety",
    summary: "Visibility, trust, and profile control.",
    accent: "rose"
  }
];

export const questionBank: Question[] = [
  {
    id: "commute_priority",
    category: "basics",
    prompt: "I would pay more if it meant a much shorter commute.",
    hint: "Rate how strongly this sounds like you.",
    type: "scale"
  },
  {
    id: "lock_place_early",
    category: "basics",
    prompt: "I want to lock down housing as early as possible.",
    hint: "Higher means you want less uncertainty.",
    type: "scale"
  },
  {
    id: "long_lease",
    category: "basics",
    prompt: "I prefer a longer lease over something temporary.",
    hint: "Higher means you value stability.",
    type: "scale"
  },
  {
    id: "budget_flex",
    category: "basics",
    prompt: "I can stretch my budget if the room and roommate are right.",
    hint: "Higher means you are more flexible on price.",
    type: "scale"
  },
  {
    id: "tidy_shared_spaces",
    category: "lifestyle",
    prompt: "I keep shared spaces very tidy without being reminded.",
    hint: "Think kitchen, bathroom, and living room habits.",
    type: "scale"
  },
  {
    id: "quiet_at_night",
    category: "lifestyle",
    prompt: "I want the apartment to stay quiet late at night.",
    hint: "Higher means quiet evenings matter a lot.",
    type: "scale"
  },
  {
    id: "early_routine",
    category: "lifestyle",
    prompt: "My weekdays usually start early.",
    hint: "Higher means you are more morning-oriented.",
    type: "scale"
  },
  {
    id: "guest_friendly",
    category: "lifestyle",
    prompt: "I am comfortable with guests being around fairly often.",
    hint: "Higher means you are more open to visitors.",
    type: "scale"
  },
  {
    id: "hang_out_roommate",
    category: "interests",
    prompt: "I want a roommate who actually hangs out with me.",
    hint: "Higher means you want more built-in social time.",
    type: "scale"
  },
  {
    id: "shared_hobbies",
    category: "interests",
    prompt: "Shared hobbies matter a lot when choosing a roommate.",
    hint: "Higher means common interests are a major factor.",
    type: "scale"
  },
  {
    id: "music_in_home",
    category: "interests",
    prompt: "Music playing in shared spaces is part of my normal routine.",
    hint: "Higher means you expect a more active home atmosphere.",
    type: "scale"
  },
  {
    id: "cook_together",
    category: "interests",
    prompt: "I enjoy cooking or eating with roommates.",
    hint: "Higher means food is part of the social vibe.",
    type: "scale"
  },
  {
    id: "chores_matter",
    category: "dealbreakers",
    prompt: "Clear chore expectations are non-negotiable for me.",
    hint: "Higher means you want structure from day one.",
    type: "scale"
  },
  {
    id: "guest_rules",
    category: "dealbreakers",
    prompt: "Overnight guest rules need to be explicit.",
    hint: "Higher means guest boundaries matter a lot.",
    type: "scale"
  },
  {
    id: "must_haves_text",
    category: "dealbreakers",
    prompt: "Type the must-haves you want attached to your profile.",
    hint: "Use commas or short lines such as quiet nights, natural light, short commute.",
    type: "text",
    field: "mustHaves",
    placeholder: "quiet after 10pm, clean kitchen, near Temple Meads",
    buttonLabel: "Save must-haves"
  },
  {
    id: "dealbreakers_text",
    category: "dealbreakers",
    prompt: "Type the dealbreakers you want attached to your profile.",
    hint: "These go directly into the profile so bad fits can filter out earlier.",
    type: "text",
    field: "dealbreakers",
    placeholder: "smoking indoors, unpaid rent, surprise overnight guests",
    buttonLabel: "Save dealbreakers"
  },
  {
    id: "visibility_comfort",
    category: "privacy",
    prompt: "I am comfortable with my profile being shown to a wider pool of matches.",
    hint: "Higher means you are comfortable being more discoverable.",
    privacyLevels: ["open", "balanced", "private"],
    type: "scale"
  },
  {
    id: "verified_only",
    category: "privacy",
    prompt: "I only want verified users to contact me.",
    hint: "Higher means trust gates are important.",
    privacyLevels: ["balanced", "private"],
    type: "scale"
  },
  {
    id: "share_after_match",
    category: "privacy",
    prompt: "I would rather unlock my full profile after mutual interest.",
    hint: "Higher means you prefer slower profile sharing.",
    privacyLevels: ["balanced", "private"],
    type: "scale"
  },
  {
    id: "safety_tools_first",
    category: "privacy",
    prompt: "Block and report tools matter as much as the match score.",
    hint: "Higher means trust and safety is a top priority.",
    privacyLevels: ["open", "balanced", "private"],
    type: "scale"
  },
  {
    id: "visibility_control",
    category: "privacy",
    prompt: "I want tight control over who can see my profile.",
    hint: "Higher means visibility settings matter a lot.",
    privacyLevels: ["private"],
    type: "scale"
  },
  {
    id: "message_gatekeeping",
    category: "privacy",
    prompt: "I want most profile details hidden until chat starts.",
    hint: "Higher means you want a stronger privacy gate before sharing details.",
    privacyLevels: ["private"],
    type: "scale"
  }
];

export const scaleChoices: ScaleChoice[] = [
  { value: 1, label: "Not me" },
  { value: 2, label: "A little" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Mostly" },
  { value: 5, label: "Exactly me" }
];

export const privacyLevelOptions: PrivacyLevelOption[] = [
  {
    value: "open",
    title: "Open",
    description: "Shorter privacy section focused on visibility comfort and core safety tools.",
    questionCount: 2
  },
  {
    value: "balanced",
    title: "Balanced",
    description: "Medium privacy section with verified messaging and profile-sharing control.",
    questionCount: 4
  },
  {
    value: "private",
    title: "Private",
    description: "Longest privacy section with tighter visibility and gated profile controls.",
    questionCount: 5
  }
];

export const starterAccounts: StarterAccount[] = [
  {
    title: "Demo account",
    description: "Quick-fill renter profile for frontend testing.",
    values: {
      fullName: "Maya Patel",
      email: "maya@bristol.ac.uk",
      phone: "(555) 010-1101",
      password: "demo1234"
    }
  }
];

export const initialAccountState: AccountState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  verificationMethod: "email",
  verificationCode: "",
  idCheckChoice: "skip",
  privacyLevel: "balanced"
};

export const initialProfileNotes: ProfileNotesState = {
  mustHaves: "",
  dealbreakers: ""
};

export const summaryTargets: MatchTarget[] = [
  {
    basics: 4.2,
    lifestyle: 4.5,
    interests: 2.8,
    dealbreakers: 4.3,
    privacy: 3.9
  },
  {
    basics: 3.4,
    lifestyle: 3.1,
    interests: 4.6,
    dealbreakers: 3.2,
    privacy: 3.0
  }
];
