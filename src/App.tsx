import { FormEvent, useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav";
import AccountPage from "./pages/AccountPage";
import VerifyPage from "./pages/VerifyPage";
import QuizPage from "./pages/QuizPage";
import SummaryPage from "./pages/SummaryPage";
import PathChoicePage from "./pages/PathChoicePage";
import ProfilePage from "./pages/ProfilePage";
import OwnerProfilePage from "./pages/OwnerProfilePage";
import BrowseListingsPage from "./pages/find-room/BrowseListingsPage";
import FiltersPage from "./pages/find-room/FiltersPage";
import SuggestionsPage from "./pages/find-room/SuggestionsPage";
import MatchFeedPage from "./pages/find-room/MatchFeedPage";
import MatchDetailPage from "./pages/find-room/MatchDetailPage";
import SavedListPage from "./pages/find-room/SavedListPage";
import SendIntroPage from "./pages/find-room/SendIntroPage";
import GroupChatPage from "./pages/find-room/GroupChatPage";
import GroupChatThreadPage from "./pages/find-room/GroupChatThreadPage";
import CreateListingPage from "./pages/host-room/CreateListingPage";
import OwnerSuggestionsPage from "./pages/host-room/OwnerSuggestionsPage";
import OwnerMatchFeedPage from "./pages/host-room/OwnerMatchFeedPage";
import OwnerCandidateDetailPage from "./pages/host-room/OwnerCandidateDetailPage";
import OwnerSavedListPage from "./pages/host-room/OwnerSavedListPage";
import OwnerSendIntroPage from "./pages/host-room/OwnerSendIntroPage";
import {
  DEMO_VERIFICATION_CODE,
  categoryMeta,
  initialAccountState,
  initialProfileNotes,
  privacyLevelOptions,
  questionBank,
  scaleChoices,
  starterAccounts
} from "./data/onboarding";
import { defaultFilters, roomMatches } from "./data/findRoom";
import { initialOwnerListing, ownerCandidateMatches } from "./data/ownerRoom";
import { buildFakeGroupReply, groupChatThreads } from "./data/groupChat";
import { getFilteredMatches, scoreRoomMatch, toggleAmenity } from "./lib/findRoom";
import { rankOwnerCandidates } from "./lib/ownerRoom";
import {
  getCategoryAverage,
  getCategoryQuestionCounts,
  getPrivacyLevelMeta,
  isQuestionAnswered,
  isQuestionVisible,
  matchReasons,
  validateAccount
} from "./lib/onboarding";
import {
  AccountState,
  CategoryId,
  ChatMessage,
  MatchTarget,
  OwnerListingDraft,
  ProfileNotesState,
  QuizAnswers,
  ScoredOwnerCandidate,
  ScoredRoomMatch,
  ScreenId,
  RoomAmenity,
  StatusState
} from "./types";
import "./styles.css";

type DetailReturnScreen = "browseListings" | "suggestions" | "matchFeed" | "savedList" | "chatThread";
type IntroBackScreen = "matchFeed" | "matchDetail" | "savedList";
type RenterNavScreen = "browseListings" | "suggestions" | "savedList" | "groupChat" | "profile";
type OwnerDetailReturnScreen = "ownerSuggestions" | "ownerMatchFeed" | "ownerSavedList";
type OwnerIntroBackScreen = "ownerMatchFeed" | "ownerCandidateDetail" | "ownerSavedList";
type OwnerNavScreen = "ownerListing" | "ownerSuggestions" | "ownerSavedList" | "ownerProfile";
type JourneyMode = "renter" | "owner";

const emptyStatus: StatusState = { kind: "idle", message: "" };
const renterNavItems = [
  { id: "browseListings", label: "Browse", badge: "HO" },
  { id: "suggestions", label: "Matches", badge: "MT" },
  { id: "savedList", label: "Interested", badge: "SV" },
  { id: "groupChat", label: "Chats", badge: "GC" },
  { id: "profile", label: "Profile", badge: "ME" }
] as const;
const ownerNavItems = [
  { id: "ownerListing", label: "Listing", badge: "RM" },
  { id: "ownerSuggestions", label: "Matches", badge: "MT" },
  { id: "ownerSavedList", label: "Saved", badge: "SV" },
  { id: "ownerProfile", label: "Profile", badge: "ME" }
] as const;

function buildIntroDraft(name: string, match: ScoredRoomMatch) {
  const senderName = name.trim() || "a renter";

  return [
    `Hi ${match.roommate.name},`,
    "",
    `I'm ${senderName} and I am interested in ${match.roomTitle} in ${match.neighborhood}.`,
    "Our profile fit looks strong, and I wanted to ask a couple of questions before booking a viewing.",
    ""
  ].join("\n");
}

function buildOwnerIntroDraft(name: string, candidate: ScoredOwnerCandidate, listing: OwnerListingDraft) {
  const senderName = name.trim() || "the host";

  return [
    `Hi ${candidate.name},`,
    "",
    `I'm ${senderName} and I am reaching out about my room listing, ${listing.title}, in ${listing.neighborhood}.`,
    "Your profile looks like a strong fit for the house setup, so I wanted to ask a couple of quick questions before arranging a viewing.",
    ""
  ].join("\n");
}

function App() {
  const [screen, setScreen] = useState<ScreenId>("account");
  const [journeyMode, setJourneyMode] = useState<JourneyMode>("renter");
  const [account, setAccount] = useState<AccountState>(initialAccountState);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [profileNotes, setProfileNotes] = useState<ProfileNotesState>(initialProfileNotes);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [status, setStatus] = useState<StatusState>(emptyStatus);
  const [filters, setFilters] = useState(defaultFilters);
  const [feedIndex, setFeedIndex] = useState(0);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [detailReturnScreen, setDetailReturnScreen] = useState<DetailReturnScreen>("suggestions");
  const [introBackScreen, setIntroBackScreen] = useState<IntroBackScreen>("matchFeed");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [contactedIds, setContactedIds] = useState<string[]>([]);
  const [introDrafts, setIntroDrafts] = useState<Record<string, string>>({});
  const [chatDrafts, setChatDrafts] = useState<Record<string, string>>({});
  const [chatMessagesByMatch, setChatMessagesByMatch] = useState<Record<string, ChatMessage[]>>({});
  const [ownerListing, setOwnerListing] = useState<OwnerListingDraft>(initialOwnerListing);
  const [ownerFeedIndex, setOwnerFeedIndex] = useState(0);
  const [selectedOwnerCandidateId, setSelectedOwnerCandidateId] = useState<string | null>(null);
  const [ownerDetailReturnScreen, setOwnerDetailReturnScreen] = useState<OwnerDetailReturnScreen>("ownerSuggestions");
  const [ownerIntroBackScreen, setOwnerIntroBackScreen] = useState<OwnerIntroBackScreen>("ownerMatchFeed");
  const [ownerSavedIds, setOwnerSavedIds] = useState<string[]>([]);
  const [ownerLikedIds, setOwnerLikedIds] = useState<string[]>([]);
  const [ownerContactedIds, setOwnerContactedIds] = useState<string[]>([]);
  const [ownerIntroDrafts, setOwnerIntroDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const keyboardThreshold = 120;

    if (!viewport) {
      root.style.setProperty("--keyboard-offset", "0px");
      return;
    }

    let baselineViewportBottom = Math.max(window.innerHeight, viewport.height + viewport.offsetTop);

    const updateKeyboardOffset = () => {
      const viewportBottom = Math.max(window.innerHeight, viewport.height + viewport.offsetTop);
      const keyboardOffset = Math.max(0, baselineViewportBottom - viewportBottom);

      if (keyboardOffset < keyboardThreshold) {
        baselineViewportBottom = viewportBottom;
        root.style.setProperty("--keyboard-offset", "0px");
        root.classList.remove("keyboard-open");
        return;
      }

      root.style.setProperty("--keyboard-offset", `${keyboardOffset}px`);
      root.classList.add("keyboard-open");
    };

    updateKeyboardOffset();
    viewport.addEventListener("resize", updateKeyboardOffset);
    viewport.addEventListener("scroll", updateKeyboardOffset);
    window.addEventListener("resize", updateKeyboardOffset);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardOffset);
      viewport.removeEventListener("scroll", updateKeyboardOffset);
      window.removeEventListener("resize", updateKeyboardOffset);
      root.style.setProperty("--keyboard-offset", "0px");
      root.classList.remove("keyboard-open");
    };
  }, []);

  const activeQuestionBank = useMemo(
    () => questionBank.filter((question) => isQuestionVisible(question, account.privacyLevel)),
    [account.privacyLevel]
  );

  const totalQuestions = activeQuestionBank.length;
  const safeQuestionIndex = Math.min(questionIndex, Math.max(totalQuestions - 1, 0));
  const currentQuestion = activeQuestionBank[safeQuestionIndex] ?? activeQuestionBank[0];
  const nextQuestion = activeQuestionBank[safeQuestionIndex + 1] ?? null;
  const currentCategory =
    categoryMeta.find((category) => category.id === currentQuestion.category) ?? categoryMeta[0];
  const currentCategoryQuestions = activeQuestionBank.filter(
    (question) => question.category === currentQuestion.category
  );
  const currentCategoryQuestionNumber =
    currentCategoryQuestions.findIndex((question) => question.id === currentQuestion.id) + 1;
  const categoryQuestionCounts = useMemo(
    () => getCategoryQuestionCounts(activeQuestionBank),
    [activeQuestionBank]
  );
  const answeredCount = activeQuestionBank.filter((question) =>
    isQuestionAnswered(question, quizAnswers, profileNotes)
  ).length;
  const quizProgress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const privacyLevelMeta = getPrivacyLevelMeta(account.privacyLevel);

  const summaryCards = useMemo(
    () =>
      categoryMeta.map((category) => ({
        ...category,
        score: getCategoryAverage(category.id, quizAnswers, activeQuestionBank)
      })),
    [activeQuestionBank, quizAnswers]
  );

  const userScores = useMemo<MatchTarget>(
    () =>
      summaryCards.reduce<MatchTarget>(
        (scores, category) => {
          scores[category.id] = category.score || 3;
          return scores;
        },
        {
          basics: 3,
          lifestyle: 3,
          interests: 3,
          dealbreakers: 3,
          privacy: 3
        }
      ),
    [summaryCards]
  );

  const categoryTitleMap = useMemo(
    () =>
      categoryMeta.reduce<Record<CategoryId, string>>((titles, category) => {
        titles[category.id] = category.title;
        return titles;
      }, {} as Record<CategoryId, string>),
    []
  );

  const allScoredMatches = useMemo<ScoredRoomMatch[]>(
    () =>
      roomMatches
        .map((match) => ({
          ...match,
          score: scoreRoomMatch(userScores, match.compatibilityTarget, filters, match),
          alignedOn: matchReasons(userScores, match.compatibilityTarget, categoryTitleMap)
        }))
        .sort((left, right) => right.score - left.score),
    [categoryTitleMap, filters, userScores]
  );
  const scoredOwnerCandidates = useMemo<ScoredOwnerCandidate[]>(
    () => rankOwnerCandidates(userScores, ownerCandidateMatches, categoryTitleMap),
    [categoryTitleMap, userScores]
  );

  const filteredMatches = useMemo(
    () => getFilteredMatches(allScoredMatches, filters),
    [allScoredMatches, filters]
  );

  const currentFeedMatch = feedIndex < filteredMatches.length ? filteredMatches[feedIndex] : null;
  const selectedMatch = selectedMatchId
    ? allScoredMatches.find((match) => match.id === selectedMatchId) ?? null
    : null;
  const currentOwnerCandidate =
    ownerFeedIndex < scoredOwnerCandidates.length ? scoredOwnerCandidates[ownerFeedIndex] : null;
  const selectedOwnerCandidate = selectedOwnerCandidateId
    ? scoredOwnerCandidates.find((candidate) => candidate.id === selectedOwnerCandidateId) ?? null
    : null;
  const savedMatches = allScoredMatches.filter((match) => savedIds.includes(match.id));
  const savedOwnerCandidates = scoredOwnerCandidates.filter((candidate) => ownerSavedIds.includes(candidate.id));
  const chatEligibleIds = [...new Set([...likedIds, ...contactedIds])];
  const chatMatchPool = allScoredMatches.filter(
    (match) => chatEligibleIds.includes(match.id)
  );
  const activeChatMatch =
    selectedMatch && chatEligibleIds.includes(selectedMatch.id) ? selectedMatch : chatMatchPool[0] ?? null;
  const currentIntroDraft = selectedMatch
    ? introDrafts[selectedMatch.id] ?? buildIntroDraft(account.fullName, selectedMatch)
    : "";
  const currentOwnerIntroDraft = selectedOwnerCandidate
    ? ownerIntroDrafts[selectedOwnerCandidate.id] ?? buildOwnerIntroDraft(account.fullName, selectedOwnerCandidate, ownerListing)
    : "";
  const currentChatDraft = activeChatMatch ? chatDrafts[activeChatMatch.id] ?? "" : "";
  const activeChatThread = activeChatMatch ? getChatThread(activeChatMatch.id) : null;
  const showRenterNav = [
    "browseListings",
    "filters",
    "suggestions",
    "matchFeed",
    "matchDetail",
    "savedList",
    "sendIntro",
    "groupChat",
    "profile"
  ].includes(screen);
  const showOwnerNav = [
    "ownerListing",
    "ownerSuggestions",
    "ownerMatchFeed",
    "ownerCandidateDetail",
    "ownerSavedList",
    "ownerSendIntro",
    "ownerProfile"
  ].includes(screen);
  const showPrimaryNav = showRenterNav || showOwnerNav;
  const activeRenterNav = (() => {
    switch (screen) {
      case "browseListings":
      case "filters":
        return "browseListings";
      case "savedList":
        return "savedList";
      case "groupChat":
        return "groupChat";
      case "profile":
        return "profile";
      case "matchDetail":
        if (detailReturnScreen === "savedList") {
          return "savedList";
        }
        if (detailReturnScreen === "browseListings") {
          return "browseListings";
        }
        if (detailReturnScreen === "chatThread") {
          return "groupChat";
        }
        return "suggestions";
      case "chatThread":
        return "groupChat";
      case "sendIntro":
        return introBackScreen === "savedList" ? "savedList" : "suggestions";
      default:
        return "suggestions";
    }
  })() as RenterNavScreen;
  const activeOwnerNav = (() => {
    switch (screen) {
      case "ownerListing":
        return "ownerListing";
      case "ownerSavedList":
        return "ownerSavedList";
      case "ownerProfile":
        return "ownerProfile";
      case "ownerCandidateDetail":
        return ownerDetailReturnScreen === "ownerSavedList" ? "ownerSavedList" : "ownerSuggestions";
      case "ownerSendIntro":
        return ownerIntroBackScreen === "ownerSavedList" ? "ownerSavedList" : "ownerSuggestions";
      default:
        return "ownerSuggestions";
    }
  })() as OwnerNavScreen;

  function clearStatus() {
    setStatus(emptyStatus);
  }

  function resetPrototype() {
    setScreen("account");
    setJourneyMode("renter");
    setAccount(initialAccountState);
    setQuizAnswers({});
    setProfileNotes(initialProfileNotes);
    setQuestionIndex(0);
    setStatus(emptyStatus);
    setFilters(defaultFilters);
    setFeedIndex(0);
    setSelectedMatchId(null);
    setDetailReturnScreen("suggestions");
    setIntroBackScreen("matchFeed");
    setSavedIds([]);
    setLikedIds([]);
    setContactedIds([]);
    setIntroDrafts({});
    setChatDrafts({});
    setChatMessagesByMatch({});
    setOwnerListing(initialOwnerListing);
    setOwnerFeedIndex(0);
    setSelectedOwnerCandidateId(null);
    setOwnerDetailReturnScreen("ownerSuggestions");
    setOwnerIntroBackScreen("ownerMatchFeed");
    setOwnerSavedIds([]);
    setOwnerLikedIds([]);
    setOwnerContactedIds([]);
    setOwnerIntroDrafts({});
  }

  function getChatThread(matchId: string) {
    const match = allScoredMatches.find((item) => item.id === matchId);
    if (!match) {
      return null;
    }

    return {
      ...(groupChatThreads[matchId] ?? {
        matchId,
        title: `${match.neighborhood} house group`,
        participants: [],
        messages: []
      }),
      participants: [
        {
          id: "me",
          name: account.fullName || "You",
          role: "me" as const,
          label: "You"
        },
        ...(groupChatThreads[matchId]?.participants ?? [])
      ],
      messages: [...(groupChatThreads[matchId]?.messages ?? []), ...(chatMessagesByMatch[matchId] ?? [])]
    };
  }

  function updateAccount<K extends keyof AccountState>(field: K, value: AccountState[K]) {
    setAccount((current) => ({ ...current, [field]: value }));
    if (status.kind === "error") {
      clearStatus();
    }
  }

  function updateFilters<K extends keyof typeof filters>(field: K, value: (typeof filters)[K]) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function getVisibleQuestionBank(privacyLevel = account.privacyLevel) {
    return questionBank.filter((question) => isQuestionVisible(question, privacyLevel));
  }

  function moveToNextUnansweredQuestion(privacyLevel = account.privacyLevel) {
    const visibleQuestions = getVisibleQuestionBank(privacyLevel);
    const firstUnansweredIndex = visibleQuestions.findIndex(
      (question) => !isQuestionAnswered(question, quizAnswers, profileNotes)
    );

    setQuestionIndex(firstUnansweredIndex === -1 ? Math.max(visibleQuestions.length - 1, 0) : firstUnansweredIndex);
  }

  function addSavedMatch(matchId: string) {
    setSavedIds((current) => (current.includes(matchId) ? current : [...current, matchId]));
  }

  function addLikedMatch(matchId: string) {
    setLikedIds((current) => (current.includes(matchId) ? current : [...current, matchId]));
  }

  function updateOwnerListing<K extends keyof OwnerListingDraft>(field: K, value: OwnerListingDraft[K]) {
    setOwnerListing((current) => ({ ...current, [field]: value }));
  }

  function toggleOwnerAmenity(amenity: RoomAmenity) {
    setOwnerListing((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity]
    }));
  }

  function addSavedOwnerCandidate(candidateId: string) {
    setOwnerSavedIds((current) => (current.includes(candidateId) ? current : [...current, candidateId]));
  }

  function addLikedOwnerCandidate(candidateId: string) {
    setOwnerLikedIds((current) => (current.includes(candidateId) ? current : [...current, candidateId]));
  }

  function storeDefaultIntro(match: ScoredRoomMatch) {
    setIntroDrafts((current) => {
      if (current[match.id]) {
        return current;
      }

      return {
        ...current,
        [match.id]: buildIntroDraft(account.fullName, match)
      };
    });
  }

  function storeDefaultOwnerIntro(candidate: ScoredOwnerCandidate) {
    setOwnerIntroDrafts((current) => {
      if (current[candidate.id]) {
        return current;
      }

      return {
        ...current,
        [candidate.id]: buildOwnerIntroDraft(account.fullName, candidate, ownerListing)
      };
    });
  }

  function openOwnerCandidateDetail(candidateId: string, returnScreen: OwnerDetailReturnScreen) {
    setSelectedOwnerCandidateId(candidateId);
    setOwnerDetailReturnScreen(returnScreen);
    setScreen("ownerCandidateDetail");
  }

  function openMatchDetail(matchId: string, returnScreen: DetailReturnScreen) {
    setSelectedMatchId(matchId);
    setDetailReturnScreen(returnScreen);
    setScreen("matchDetail");
  }

  function openIntro(matchId: string, backScreen: IntroBackScreen) {
    const match = allScoredMatches.find((item) => item.id === matchId);
    if (!match) {
      return;
    }

    addSavedMatch(match.id);
    addLikedMatch(match.id);
    storeDefaultIntro(match);
    setSelectedMatchId(match.id);
    setIntroBackScreen(backScreen);
    setScreen("sendIntro");
    clearStatus();
  }

  function openOwnerIntro(candidateId: string, backScreen: OwnerIntroBackScreen) {
    const candidate = scoredOwnerCandidates.find((item) => item.id === candidateId);
    if (!candidate) {
      return;
    }

    addSavedOwnerCandidate(candidate.id);
    addLikedOwnerCandidate(candidate.id);
    storeDefaultOwnerIntro(candidate);
    setSelectedOwnerCandidateId(candidate.id);
    setOwnerIntroBackScreen(backScreen);
    setScreen("ownerSendIntro");
    clearStatus();
  }

  function openGroupChat(matchId: string) {
    const match = allScoredMatches.find((item) => item.id === matchId);
    if (!match) {
      return;
    }

    if (!chatEligibleIds.includes(match.id)) {
      setStatus({ kind: "error", message: "Like this house first to unlock the group chat." });
      return;
    }

    setSelectedMatchId(match.id);
    setScreen("chatThread");
    clearStatus();
  }

  function appendChatMessage(matchId: string, message: ChatMessage) {
    setChatMessagesByMatch((current) => ({
      ...current,
      [matchId]: [...(current[matchId] ?? []), message]
    }));
  }

  function handleUseStarter(values: Pick<AccountState, "fullName" | "email" | "phone" | "password">) {
    setAccount((current) => ({ ...current, ...values }));
    setStatus({ kind: "success", message: "Starter account loaded. Continue when ready." });
  }

  function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationMessage = validateAccount(account);
    if (validationMessage) {
      setStatus({ kind: "error", message: validationMessage });
      return;
    }

    setScreen("verify");
    setStatus({ kind: "success", message: "Account details look valid for this prototype." });
  }

  function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (account.verificationCode.trim() !== DEMO_VERIFICATION_CODE) {
      setStatus({ kind: "error", message: "Use the demo verification code before starting the questionnaire." });
      return;
    }

    moveToNextUnansweredQuestion(account.privacyLevel);
    setScreen("quiz");
    setStatus({
      kind: "success",
      message: `${privacyLevelMeta.questionCount} privacy questions are queued for this profile.`
    });
  }

  function handleScaleCommit(value: number) {
    if (currentQuestion.type !== "scale") {
      return;
    }

    setQuizAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
    clearStatus();

    if (safeQuestionIndex >= totalQuestions - 1) {
      setScreen("summary");
      setStatus({ kind: "success", message: "Questionnaire complete. Review the renter profile." });
      return;
    }

    clearStatus();
    setQuestionIndex(safeQuestionIndex + 1);
  }

  function handleQuizBack() {
    if (safeQuestionIndex === 0) {
      setScreen("verify");
      clearStatus();
      return;
    }

    setQuestionIndex(safeQuestionIndex - 1);
    clearStatus();
  }

  function handleTextChange<K extends keyof ProfileNotesState>(field: K, value: ProfileNotesState[K]) {
    setProfileNotes((current) => ({ ...current, [field]: value }));
    if (status.kind === "error") {
      clearStatus();
    }
  }

  function handleTextSubmit() {
    if (currentQuestion.type !== "text") {
      return;
    }

    if (!profileNotes[currentQuestion.field].trim()) {
      setStatus({ kind: "error", message: "Add at least one item before moving to the next card." });
      return;
    }

    if (safeQuestionIndex >= totalQuestions - 1) {
      setScreen("summary");
      setStatus({ kind: "success", message: "Questionnaire complete. Review the renter profile." });
      return;
    }

    setQuestionIndex(safeQuestionIndex + 1);
    setStatus({ kind: "success", message: "Saved to the profile. Continue with the next question." });
  }

  function handleContinueToBranch() {
    if (answeredCount < totalQuestions) {
      moveToNextUnansweredQuestion();
      setScreen("quiz");
      setStatus({ kind: "error", message: "Finish the remaining questions before branching." });
      return;
    }

    setScreen("pathChoice");
    clearStatus();
  }

  function handleOwnerNavSelect(target: string) {
    clearStatus();

    switch (target as OwnerNavScreen) {
      case "ownerListing":
        setScreen("ownerListing");
        break;
      case "ownerSuggestions":
        setScreen("ownerSuggestions");
        break;
      case "ownerSavedList":
        setScreen("ownerSavedList");
        break;
      case "ownerProfile":
        setScreen("ownerProfile");
        break;
    }
  }

  function handleRenterNavSelect(target: string) {
    clearStatus();

    switch (target as RenterNavScreen) {
      case "browseListings":
        setScreen("browseListings");
        break;
      case "suggestions":
        if (!filteredMatches.length) {
          setScreen("browseListings");
          break;
        }

        setSelectedMatchId(filteredMatches[feedIndex]?.id ?? filteredMatches[0].id);
        setFeedIndex((current) => (current < filteredMatches.length ? current : 0));
        setScreen("matchFeed");
        break;
      case "savedList":
        setScreen("savedList");
        break;
      case "groupChat":
        setScreen("groupChat");
        break;
      case "profile":
        setScreen("profile");
        break;
      }
  }

  function handleStartRenterJourney() {
    setJourneyMode("renter");
    setFeedIndex(0);
    setSelectedMatchId(null);
    setScreen("browseListings");
  }

  function handleStartOwnerJourney() {
    setJourneyMode("owner");
    setOwnerFeedIndex(0);
    setSelectedOwnerCandidateId(null);
    setScreen("ownerListing");
  }

  function handleOpenFeed() {
    setFeedIndex(0);
    setSelectedMatchId(filteredMatches[0]?.id ?? null);
    setScreen("matchFeed");
  }

  function handleOpenOwnerFeed() {
    setOwnerFeedIndex(0);
    setSelectedOwnerCandidateId(scoredOwnerCandidates[0]?.id ?? null);
    setScreen("ownerMatchFeed");
  }

  function handlePassMatch() {
    setFeedIndex((current) => current + 1);
  }

  function handlePassOwnerCandidate() {
    setOwnerFeedIndex((current) => current + 1);
  }

  function handleSaveMatch(matchId: string | null) {
    if (!matchId) {
      return;
    }

    addSavedMatch(matchId);
  }

  function handleSaveAndAdvance() {
    if (!currentFeedMatch) {
      return;
    }

    addSavedMatch(currentFeedMatch.id);
    setFeedIndex((current) => current + 1);
  }

  function handleSaveOwnerCandidate(candidateId: string | null) {
    if (!candidateId) {
      return;
    }

    addSavedOwnerCandidate(candidateId);
  }

  function handleSaveOwnerAndAdvance() {
    if (!currentOwnerCandidate) {
      return;
    }

    addSavedOwnerCandidate(currentOwnerCandidate.id);
    setOwnerFeedIndex((current) => current + 1);
  }

  function handleOpenCurrentDetail() {
    if (!currentFeedMatch) {
      return;
    }

    openMatchDetail(currentFeedMatch.id, "matchFeed");
  }

  function handleOpenCurrentOwnerDetail() {
    if (!currentOwnerCandidate) {
      return;
    }

    openOwnerCandidateDetail(currentOwnerCandidate.id, "ownerMatchFeed");
  }

  function handleAppendQuestion(question: string) {
    if (!selectedMatch) {
      return;
    }

    setIntroDrafts((current) => {
      const existingDraft = current[selectedMatch.id] ?? buildIntroDraft(account.fullName, selectedMatch);
      const trimmedDraft = existingDraft.trimEnd();
      const nextLine = trimmedDraft.includes(question) ? trimmedDraft : `${trimmedDraft}\n- ${question}`;

      return {
        ...current,
        [selectedMatch.id]: `${nextLine}\n`
      };
    });
  }

  function handleAppendOwnerQuestion(question: string) {
    if (!selectedOwnerCandidate) {
      return;
    }

    setOwnerIntroDrafts((current) => {
      const existingDraft = current[selectedOwnerCandidate.id] ?? buildOwnerIntroDraft(account.fullName, selectedOwnerCandidate, ownerListing);
      const trimmedDraft = existingDraft.trimEnd();
      const nextLine = trimmedDraft.includes(question) ? trimmedDraft : `${trimmedDraft}\n- ${question}`;

      return {
        ...current,
        [selectedOwnerCandidate.id]: `${nextLine}\n`
      };
    });
  }

  function handleSendIntro() {
    if (!selectedMatch) {
      return;
    }

    const draft = (introDrafts[selectedMatch.id] ?? buildIntroDraft(account.fullName, selectedMatch)).trim();
    if (draft.length < 24) {
      setStatus({ kind: "error", message: "Write a slightly longer intro before sending it." });
      return;
    }

    addSavedMatch(selectedMatch.id);
    setContactedIds((current) => (current.includes(selectedMatch.id) ? current : [...current, selectedMatch.id]));
    setIntroDrafts((current) => ({ ...current, [selectedMatch.id]: draft }));
    appendChatMessage(selectedMatch.id, {
      id: `${selectedMatch.id}-intro-${Date.now()}`,
      senderId: "me",
      body: draft,
      sentAt: "Just now"
    });
    appendChatMessage(
      selectedMatch.id,
      buildFakeGroupReply(
        selectedMatch,
        (groupChatThreads[selectedMatch.id]?.messages.length ?? 0) + (chatMessagesByMatch[selectedMatch.id]?.length ?? 0)
      )
    );
    setChatDrafts((current) => ({ ...current, [selectedMatch.id]: "" }));

    if (introBackScreen === "matchFeed" || (introBackScreen === "matchDetail" && detailReturnScreen === "matchFeed")) {
      setFeedIndex((current) => current + 1);
    }

    setScreen("chatThread");
    setStatus({
      kind: "success",
      message: `Intro sent to ${selectedMatch.roommate.name}. The house group chat is now open.`
    });
  }

  function handleSendOwnerIntro() {
    if (!selectedOwnerCandidate) {
      return;
    }

    const draft = (ownerIntroDrafts[selectedOwnerCandidate.id] ?? buildOwnerIntroDraft(account.fullName, selectedOwnerCandidate, ownerListing)).trim();
    if (draft.length < 24) {
      setStatus({ kind: "error", message: "Write a slightly longer intro before sending it." });
      return;
    }

    addSavedOwnerCandidate(selectedOwnerCandidate.id);
    addLikedOwnerCandidate(selectedOwnerCandidate.id);
    setOwnerContactedIds((current) => (current.includes(selectedOwnerCandidate.id) ? current : [...current, selectedOwnerCandidate.id]));
    setOwnerIntroDrafts((current) => ({ ...current, [selectedOwnerCandidate.id]: draft }));
    setScreen("ownerSavedList");
    setStatus({
      kind: "success",
      message: `Intro sent to ${selectedOwnerCandidate.name}. Next step in the FigJam flow would be mutual like and chat.`
    });
  }

  function handleSendChatMessage() {
    if (!activeChatMatch) {
      return;
    }

    const draft = (chatDrafts[activeChatMatch.id] ?? "").trim();
    if (!draft) {
      setStatus({ kind: "error", message: "Type a message before sending it to the house chat." });
      return;
    }

    addSavedMatch(activeChatMatch.id);
    setContactedIds((current) => (current.includes(activeChatMatch.id) ? current : [...current, activeChatMatch.id]));
    appendChatMessage(activeChatMatch.id, {
      id: `${activeChatMatch.id}-user-${Date.now()}`,
      senderId: "me",
      body: draft,
      sentAt: "Just now"
    });
    appendChatMessage(
      activeChatMatch.id,
      buildFakeGroupReply(
        activeChatMatch,
        (groupChatThreads[activeChatMatch.id]?.messages.length ?? 0) + (chatMessagesByMatch[activeChatMatch.id]?.length ?? 0)
      )
    );
    setChatDrafts((current) => ({ ...current, [activeChatMatch.id]: "" }));
    setStatus({ kind: "success", message: "Message sent to the owner group chat." });
  }

  const renderedScreen = (() => {
    switch (screen) {
      case "account":
        return (
          <AccountPage
            account={account}
            starters={starterAccounts}
            status={status}
            onUseStarter={handleUseStarter}
            onChange={updateAccount}
            onSubmit={handleAccountSubmit}
          />
        );

      case "verify":
        return (
          <VerifyPage
            account={account}
            demoCode={DEMO_VERIFICATION_CODE}
            privacyLevelOptions={privacyLevelOptions}
            status={status}
            onChange={updateAccount}
            onBack={() => {
              setScreen("account");
              clearStatus();
            }}
            onSubmit={handleVerifySubmit}
          />
        );

      case "quiz":
        return (
          <QuizPage
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            quizProgress={quizProgress}
            questionIndex={safeQuestionIndex}
            currentQuestion={currentQuestion}
            nextQuestion={nextQuestion}
            currentCategory={currentCategory}
            currentCategoryQuestionsLength={currentCategoryQuestions.length}
            currentCategoryQuestionNumber={currentCategoryQuestionNumber}
            categoryMeta={categoryMeta}
            categoryQuestionCounts={categoryQuestionCounts}
            activeQuestionBank={activeQuestionBank}
            quizAnswers={quizAnswers}
            profileNotes={profileNotes}
            privacyLevelMeta={privacyLevelMeta}
            scaleChoices={scaleChoices}
            status={status}
            onScaleCommit={handleScaleCommit}
            onBack={handleQuizBack}
            onTextChange={handleTextChange}
            onTextSubmit={handleTextSubmit}
            isQuestionAnswered={(question) => isQuestionAnswered(question, quizAnswers, profileNotes)}
          />
        );

      case "summary":
        return (
          <SummaryPage
            account={account}
            privacyLevelMeta={privacyLevelMeta}
            answeredCount={answeredCount}
            summaryCards={summaryCards}
            profileNotes={profileNotes}
            status={status}
            onBack={() => {
              setQuestionIndex(Math.max(totalQuestions - 1, 0));
              setScreen("quiz");
              clearStatus();
            }}
            onContinue={handleContinueToBranch}
          />
        );

      case "pathChoice":
        return <PathChoicePage onChooseNeedRoom={handleStartRenterJourney} onChooseHaveRoom={handleStartOwnerJourney} />;

      case "ownerListing":
        return (
          <CreateListingPage
            listing={ownerListing}
            candidateCount={scoredOwnerCandidates.length}
            onChange={updateOwnerListing}
            onToggleAmenity={toggleOwnerAmenity}
            onContinue={() => setScreen("ownerSuggestions")}
          />
        );

      case "ownerSuggestions":
        return (
          <OwnerSuggestionsPage
            candidates={scoredOwnerCandidates}
            onBack={() => setScreen("ownerListing")}
            onOpenFeed={handleOpenOwnerFeed}
            onInspect={(candidateId) => openOwnerCandidateDetail(candidateId, "ownerSuggestions")}
          />
        );

      case "ownerMatchFeed":
        return (
          <OwnerMatchFeedPage
            listing={ownerListing}
            currentCandidate={currentOwnerCandidate}
            currentIndex={ownerFeedIndex}
            total={scoredOwnerCandidates.length}
            onBack={() => setScreen("ownerSuggestions")}
            onInspect={handleOpenCurrentOwnerDetail}
            onOpenSaved={() => setScreen("ownerSavedList")}
            onPass={handlePassOwnerCandidate}
            onSave={handleSaveOwnerAndAdvance}
            onLike={() => currentOwnerCandidate && openOwnerIntro(currentOwnerCandidate.id, "ownerMatchFeed")}
          />
        );

      case "ownerCandidateDetail":
        return (
          <OwnerCandidateDetailPage
            listing={ownerListing}
            candidate={selectedOwnerCandidate}
            onBack={() => setScreen(ownerDetailReturnScreen)}
            onSave={() => handleSaveOwnerCandidate(selectedOwnerCandidate?.id ?? null)}
            onLike={() => selectedOwnerCandidate && addLikedOwnerCandidate(selectedOwnerCandidate.id)}
            onOpenIntro={() => selectedOwnerCandidate && openOwnerIntro(selectedOwnerCandidate.id, "ownerCandidateDetail")}
          />
        );

      case "ownerSavedList":
        return (
          <OwnerSavedListPage
            candidates={savedOwnerCandidates}
            likedIds={ownerLikedIds}
            contactedIds={ownerContactedIds}
            onOpenCandidate={(candidateId) => openOwnerCandidateDetail(candidateId, "ownerSavedList")}
          />
        );

      case "ownerSendIntro":
        return (
          <OwnerSendIntroPage
            listing={ownerListing}
            candidate={selectedOwnerCandidate}
            draft={currentOwnerIntroDraft}
            status={status}
            onChangeDraft={(value) => {
              if (!selectedOwnerCandidate) {
                return;
              }

              setOwnerIntroDrafts((current) => ({ ...current, [selectedOwnerCandidate.id]: value }));
              if (status.kind === "error") {
                clearStatus();
              }
            }}
            onAppendQuestion={handleAppendOwnerQuestion}
            onBack={() => {
              setScreen(ownerIntroBackScreen);
              clearStatus();
            }}
            onSend={handleSendOwnerIntro}
          />
        );

      case "ownerProfile":
        return (
          <OwnerProfilePage
            account={account}
            listing={ownerListing}
            privacyLevelMeta={privacyLevelMeta}
            summaryCards={summaryCards}
            profileNotes={profileNotes}
            savedCount={savedOwnerCandidates.length}
            contactedCount={ownerContactedIds.length}
            onBackToSignIn={resetPrototype}
          />
        );

      case "browseListings":
        return (
          <BrowseListingsPage
            matches={filteredMatches}
            onOpenFilters={() => setScreen("filters")}
            onOpenSuggestions={() => setScreen("suggestions")}
            onOpenMatch={(matchId) => openMatchDetail(matchId, "browseListings")}
          />
        );

      case "filters":
        return (
          <FiltersPage
            filters={filters}
            resultCount={filteredMatches.length}
            onChange={updateFilters}
            onToggleAmenity={(amenity) =>
              setFilters((current) => ({
                ...current,
                amenities: toggleAmenity(current.amenities, amenity)
              }))
            }
            onBack={() => setScreen("browseListings")}
            onApply={() => {
              setFeedIndex(0);
              setScreen("suggestions");
            }}
          />
        );

      case "suggestions":
        return (
          <SuggestionsPage
            matches={filteredMatches}
            onBack={() => setScreen("filters")}
            onOpenFeed={handleOpenFeed}
            onInspect={(matchId) => openMatchDetail(matchId, "suggestions")}
          />
        );

      case "matchFeed":
        return (
          <MatchFeedPage
            currentMatch={currentFeedMatch}
            currentIndex={feedIndex}
            total={filteredMatches.length}
            onBack={() => setScreen("suggestions")}
            onInspect={handleOpenCurrentDetail}
            onOpenSaved={() => setScreen("savedList")}
            onPass={handlePassMatch}
            onSave={handleSaveAndAdvance}
            onLike={() => currentFeedMatch && openIntro(currentFeedMatch.id, "matchFeed")}
          />
        );

      case "matchDetail":
        return (
          <MatchDetailPage
            match={selectedMatch}
            onBack={() => setScreen(detailReturnScreen)}
            onSave={() => handleSaveMatch(selectedMatch?.id ?? null)}
            canOpenChat={selectedMatch ? chatEligibleIds.includes(selectedMatch.id) : false}
            onOpenChat={() => selectedMatch && openGroupChat(selectedMatch.id)}
            onLike={() => selectedMatch && openIntro(selectedMatch.id, "matchDetail")}
            onOpenIntro={() => selectedMatch && openIntro(selectedMatch.id, "matchDetail")}
          />
        );

      case "savedList":
        return (
          <SavedListPage
            savedMatches={savedMatches}
            likedIds={likedIds}
            contactedIds={contactedIds}
            onOpenMatch={(matchId) => openMatchDetail(matchId, "savedList")}
            onOpenChat={openGroupChat}
          />
        );

      case "sendIntro":
        return (
          <SendIntroPage
            match={selectedMatch}
            draft={currentIntroDraft}
            status={status}
            onChangeDraft={(value) => {
              if (!selectedMatch) {
                return;
              }

              setIntroDrafts((current) => ({ ...current, [selectedMatch.id]: value }));
              if (status.kind === "error") {
                clearStatus();
              }
            }}
            onAppendQuestion={handleAppendQuestion}
            onBack={() => {
              setScreen(introBackScreen);
              clearStatus();
            }}
            onSend={handleSendIntro}
          />
        );

      case "groupChat":
        return (
          <GroupChatPage
            threadMatches={chatMatchPool}
            activeMatchId={activeChatMatch?.id ?? null}
            getThread={getChatThread}
            onOpenThread={(matchId) => {
              setSelectedMatchId(matchId);
              clearStatus();
              setScreen("chatThread");
            }}
          />
        );

      case "chatThread":
        return (
          <GroupChatThreadPage
            activeMatch={activeChatMatch}
            activeThread={activeChatThread}
            draft={currentChatDraft}
            status={status}
            onBack={() => {
              setScreen("groupChat");
              clearStatus();
            }}
            onOpenMatch={() => activeChatMatch && openMatchDetail(activeChatMatch.id, "chatThread")}
            onChangeDraft={(value) => {
              if (!activeChatMatch) {
                return;
              }

              setChatDrafts((current) => ({ ...current, [activeChatMatch.id]: value }));
              if (status.kind === "error") {
                clearStatus();
              }
            }}
            onSend={handleSendChatMessage}
          />
        );

      case "profile":
        return (
          <ProfilePage
            account={account}
            privacyLevelMeta={privacyLevelMeta}
            answeredCount={answeredCount}
            summaryCards={summaryCards}
            profileNotes={profileNotes}
            savedCount={savedMatches.length}
            contactedCount={contactedIds.length}
            onBackToSignIn={resetPrototype}
          />
        );
    }
  })();

  return (
    <div className="app">
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <div className="orb orb-c" aria-hidden="true" />

      <div className="stage-shell">
        <div className="app-layout">
          <div
            className={[
              "app-view",
              showPrimaryNav ? "app-view-with-nav" : ""
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {renderedScreen}
          </div>
        </div>
      </div>

      {showPrimaryNav ? (
        <BottomNav
          items={
            (journeyMode === "owner" ? ownerNavItems : renterNavItems) as unknown as Array<{
              id: string;
              label: string;
              badge: string;
            }>
          }
          activeId={journeyMode === "owner" ? activeOwnerNav : activeRenterNav}
          onSelect={journeyMode === "owner" ? handleOwnerNavSelect : handleRenterNavSelect}
        />
      ) : null}
    </div>
  );
}

export default App;
