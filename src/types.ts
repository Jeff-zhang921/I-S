export type StatusState =
  | { kind: "idle"; message: string }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export type ScreenId =
  | "account"
  | "verify"
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
  | "profile"
  | "groupChat"
  | "chatThread";

export type CategoryId = "basics" | "lifestyle" | "interests" | "dealbreakers" | "privacy";
export type VerificationMethod = "email" | "phone";
export type IdCheckChoice = "skip" | "include";
export type ProfileField = "mustHaves" | "dealbreakers";
export type PrivacyLevel = "open" | "balanced" | "private";

export type AccountState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  verificationMethod: VerificationMethod;
  verificationCode: string;
  idCheckChoice: IdCheckChoice;
  privacyLevel: PrivacyLevel;
};

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
  values: Pick<AccountState, "fullName" | "email" | "phone" | "password">;
};

export type PrivacyLevelOption = {
  value: PrivacyLevel;
  title: string;
  description: string;
  questionCount: number;
};

export type ScaleChoice = {
  value: number;
  label: string;
};

export type FiltersState = {
  maxRent: number;
  maxCommute: number;
  petFriendly: "any" | "yes";
  amenities: string[];
};

export type RoomAmenity = "Laundry" | "Dishwasher" | "Gym" | "Roof deck" | "Near transit" | "Parking" | "Furnished";

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

export type ScoredRoomMatch = RoommateMatch & {
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
