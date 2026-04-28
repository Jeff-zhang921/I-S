export type StatusState =
  | { kind: "idle"; message: string }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export type ScreenId =
  | "account"
  | "accountDetails"
  | "citySelection"
  | "verify"
  | "commitmentLevel"
  | "lifestyleSurvey"
  | "quiz"
  | "summary"
  | "pathChoice"
  | "browseListings"
  | "filters"
  | "suggestions"
  | "matchFeed"
  | "matchDetail"
  | "savedList"
  | "sendIntro"
  | "ownerListing"
  | "ownerSuggestions"
  | "ownerMatchFeed"
  | "ownerCandidateDetail"
  | "ownerSavedList"
  | "ownerSendIntro"
  | "ownerGroupChat"
  | "ownerChatThread"
  | "ownerProfile"
  | "profile"
  | "groupChat"
  | "chatThread";

export type CategoryId = "basics" | "lifestyle" | "interests" | "dealbreakers" | "privacy";
export type VerificationMethod = "email" | "phone";
export type ProfileField = "mustHaves" | "dealbreakers";
export type PrivacyLevel = "open" | "balanced" | "private";
export type CommitmentLevel = "casual" | "active" | "ready";

export type AccountState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  targetCity: string;
  verificationMethod: VerificationMethod;
  verificationCode: string;
  privacyLevel: PrivacyLevel;
  commitmentLevel: CommitmentLevel;
};

export type EditableProfileState = Pick<AccountState, "fullName" | "email" | "phone" | "targetCity">;

export type BaseQuestion = {
  id: string;
  category: CategoryId;
  prompt: string;
  hint: string;
  privacyLevels?: PrivacyLevel[];
};

export type ScaleQuestion = BaseQuestion & {
  type: "scale";
};

export type TextQuestion = BaseQuestion & {
  category: "dealbreakers";
  type: "text";
  field: ProfileField;
  placeholder: string;
  buttonLabel: string;
  suggestions?: string[];
};

export type Question = ScaleQuestion | TextQuestion;

export type CategoryMeta = {
  id: CategoryId;
  title: string;
  summary: string;
  accent: string;
};

export type MatchTarget = Record<CategoryId, number>;
export type QuizAnswers = Record<string, number>;
export type ProfileNotesState = Record<ProfileField, string>;

export type StarterAccount = {
  title: string;
  description: string;
  values: Pick<AccountState, "fullName" | "email" | "phone" | "password" | "targetCity">;
};

export type PrivacyLevelOption = {
  value: PrivacyLevel;
  title: string;
  summaryLabel: string;
  description: string;
  impactLabel: string;
  questionCount: number;
};

export type CommitmentLevelOption = {
  value: CommitmentLevel;
  title: string;
  shortLabel: string;
  description: string;
};

export type ScaleChoice = {
  value: number;
  label: string;
};

export type HouseType = "Flat" | "Terrace" | "Apartment" | "House" | "Warehouse";
export type MoveInTiming = "any" | "available_now" | "within_month" | "later";
export type ResidentMix = "students" | "professionals" | "mixed";
export type HouseEnergy = "quiet" | "balanced" | "social";
export type FlatmateLifeStage = "student" | "professional";
export type HabitKey = "cleanliness" | "sleep" | "noise";

export type FiltersState = {
  minRent: number;
  maxRent: number;
  maxCommute: number;
  petFriendly: "any" | "yes" | "no";
  locationQuery: string;
  radiusMiles: number;
  moveInTiming: MoveInTiming;
  houseTypes: HouseType[];
  occupantCountMin: number;
  occupantCountMax: number;
  professionalsOnly: boolean;
  quietHouse: boolean;
  socialHouse: boolean;
  commitmentLevels: CommitmentLevel[];
  amenities: string[];
};

export type RoomAmenity = "Laundry" | "Dishwasher" | "Gym" | "Roof deck" | "Near transit" | "Parking" | "Furnished";

export type OwnerListingDraft = {
  title: string;
  neighborhood: string;
  monthlyRent: number;
  houseRating: number;
  availableFrom: string;
  leaseLength: string;
  roomSize: string;
  bathrooms: string;
  householdSize: string;
  bills: string;
  summary: string;
  houseRules: string;
  petFriendly: boolean;
  amenities: RoomAmenity[];
  photoUrls: string[];
};

export type RoommateMatch = {
  id: string;
  roomTitle: string;
  neighborhood: string;
  monthlyRent: number;
  moveIn: string;
  leaseLength: string;
  commuteMinutes: number;
  petFriendly: boolean;
  amenities: RoomAmenity[];
  compatibilityTarget: MatchTarget;
  roommate: {
    name: string;
    age: number;
    major: string;
    vibe: string;
    bio: string;
  };
  whyMatch: string[];
  quickQuestions: string[];
};

export type FlatmateProfile = {
  lifeStage: FlatmateLifeStage;
  courseOrJob: string;
  interests: string[];
  habits: Record<HabitKey, number>;
  lookingFor: string;
  commitmentLevel: CommitmentLevel;
};

export type ScoredRoomMatch = RoommateMatch & {
  score: number;
  alignedOn: string;
};

export type OwnerCandidate = {
  id: string;
  name: string;
  age: number;
  major: string;
  budget: string;
  moveInWindow: string;
  leasePreference: string;
  vibe: string;
  bio: string;
  profilePhoto: string;
  highlights: string[];
  whyMatch: string[];
  quickQuestions: string[];
  compatibilityTarget: MatchTarget;
};

export type ScoredOwnerCandidate = OwnerCandidate & {
  score: number;
  alignedOn: string;
};

export type ChatParticipantRole = "me" | "owner" | "roommate";

export type ChatParticipant = {
  id: string;
  name: string;
  role: ChatParticipantRole;
  label: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
};

export type GroupChatThread = {
  matchId: string;
  title: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
};

export type RoomPhoto = {
  src: string;
  alt: string;
};

export type RoomDetail = {
  summary: string;
  roomDescription: string;
  ownerNote: string;
  houseRating: number;
  reviewCount: number;
  bedrooms: number;
  bathrooms: number;
  currentOccupants: string;
  deposit: number;
  bills: string;
  availableFromNote: string;
  roomSize: string;
  idealFor: string[];
  houseHighlights: string[];
  houseRules: string[];
  neighborhoodNotes: string[];
  photos: RoomPhoto[];
};

export type ListingMeta = {
  houseType: HouseType;
  residentMix: ResidentMix;
  houseEnergy: HouseEnergy;
  distanceMiles: number;
  locationTags: string[];
  moveInCategory: MoveInTiming;
};

export type MatchInsightLine = {
  label: string;
  status: "positive" | "negative";
};
