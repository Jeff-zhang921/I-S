import { FormEvent, useMemo, useState } from "react";
import { fakeUsers } from "./data/fakeUsers";
import "./styles.css";

type StatusState =
  | { kind: "idle"; message: string }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

type ScreenId = "account" | "verify" | "quiz" | "summary";
type CategoryId = "basics" | "lifestyle" | "interests" | "dealbreakers" | "privacy";
type VerificationMethod = "email" | "phone";
type IdCheckChoice = "skip" | "include";

type AccountState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  verificationMethod: VerificationMethod;
  verificationCode: string;
  idCheckChoice: IdCheckChoice;
};

type Question = {
  id: string;
  category: CategoryId;
  prompt: string;
  hint: string;
};

type CategoryMeta = {
  id: CategoryId;
  title: string;
  summary: string;
  accent: string;
};

type MatchTarget = Record<CategoryId, number>;
type QuizAnswers = Record<string, number>;

const DEMO_VERIFICATION_CODE = "246810";

const screenOrder: ScreenId[] = ["account", "verify", "quiz", "summary"];

const screenTitles: Record<ScreenId, string> = {
  account: "Create account",
  verify: "Verify identity",
  quiz: "Questionnaire",
  summary: "Profile summary"
};

const categoryMeta: CategoryMeta[] = [
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
    summary: "Non-negotiables for living together.",
    accent: "gold"
  },
  {
    id: "privacy",
    title: "Safety",
    summary: "Visibility, trust, and profile control.",
    accent: "rose"
  }
];

const questionBank: Question[] = [
  {
    id: "commute_priority",
    category: "basics",
    prompt: "I would pay more if it meant a much shorter commute.",
    hint: "Rate how strongly this sounds like you."
  },
  {
    id: "lock_place_early",
    category: "basics",
    prompt: "I want to lock down housing as early as possible.",
    hint: "Higher means you want less uncertainty."
  },
  {
    id: "long_lease",
    category: "basics",
    prompt: "I prefer a longer lease over something temporary.",
    hint: "Higher means you value stability."
  },
  {
    id: "budget_flex",
    category: "basics",
    prompt: "I can stretch my budget if the room and roommate are right.",
    hint: "Higher means you are more flexible on price."
  },
  {
    id: "tidy_shared_spaces",
    category: "lifestyle",
    prompt: "I keep shared spaces very tidy without being reminded.",
    hint: "Think kitchen, bathroom, and living room habits."
  },
  {
    id: "quiet_at_night",
    category: "lifestyle",
    prompt: "I want the apartment to stay quiet late at night.",
    hint: "Higher means quiet evenings matter a lot."
  },
  {
    id: "early_routine",
    category: "lifestyle",
    prompt: "My weekdays usually start early.",
    hint: "Higher means you are more morning-oriented."
  },
  {
    id: "guest_friendly",
    category: "lifestyle",
    prompt: "I am comfortable with guests being around fairly often.",
    hint: "Higher means you are more open to visitors."
  },
  {
    id: "hang_out_roommate",
    category: "interests",
    prompt: "I want a roommate who actually hangs out with me.",
    hint: "Higher means you want more built-in social time."
  },
  {
    id: "shared_hobbies",
    category: "interests",
    prompt: "Shared hobbies matter a lot when choosing a roommate.",
    hint: "Higher means common interests are a major factor."
  },
  {
    id: "music_in_home",
    category: "interests",
    prompt: "Music playing in shared spaces is part of my normal routine.",
    hint: "Higher means you expect a more active home atmosphere."
  },
  {
    id: "cook_together",
    category: "interests",
    prompt: "I enjoy cooking or eating with roommates.",
    hint: "Higher means food is part of the social vibe."
  },
  {
    id: "chores_matter",
    category: "dealbreakers",
    prompt: "Clear chore expectations are non-negotiable for me.",
    hint: "Higher means you want structure from day one."
  },
  {
    id: "guest_rules",
    category: "dealbreakers",
    prompt: "Overnight guest rules need to be explicit.",
    hint: "Higher means guest boundaries matter a lot."
  },
  {
    id: "pet_open",
    category: "dealbreakers",
    prompt: "I am open to living with pets.",
    hint: "Higher means pets are welcome in your living setup."
  },
  {
    id: "smoke_free",
    category: "dealbreakers",
    prompt: "A smoke-free home is non-negotiable for me.",
    hint: "Higher means this is a hard requirement."
  },
  {
    id: "verified_only",
    category: "privacy",
    prompt: "I only want verified users to contact me.",
    hint: "Higher means trust gates are important."
  },
  {
    id: "share_after_match",
    category: "privacy",
    prompt: "I would rather unlock my full profile after mutual interest.",
    hint: "Higher means you prefer slower profile sharing."
  },
  {
    id: "safety_tools_first",
    category: "privacy",
    prompt: "Block and report tools matter as much as the match score.",
    hint: "Higher means trust and safety is a top priority."
  },
  {
    id: "visibility_control",
    category: "privacy",
    prompt: "I want tight control over who can see my profile.",
    hint: "Higher means visibility settings matter a lot."
  }
];

const scaleChoices = [
  { value: 1, label: "Not me" },
  { value: 2, label: "A little" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Mostly" },
  { value: 5, label: "Exactly me" }
];

const starterAccounts: Array<{
  title: string;
  description: string;
  values: Pick<AccountState, "fullName" | "email" | "phone" | "password">;
}> = [
  {
    title: "Quiet demo",
    description: "Low-drama account draft for quick testing.",
    values: {
      fullName: "Maya Patel",
      email: "maya@campus.edu",
      phone: "(555) 010-1101",
      password: "demo1234"
    }
  },
  {
    title: "Social demo",
    description: "More outgoing draft for fast page testing.",
    values: {
      fullName: "Ethan Kim",
      email: "ethan@campus.edu",
      phone: "(555) 010-4477",
      password: "roommate!"
    }
  }
];

const matchTargets: Record<string, MatchTarget> = {
  "u-101": {
    basics: 4.3,
    lifestyle: 4.5,
    interests: 2.7,
    dealbreakers: 4.4,
    privacy: 4.1
  },
  "u-102": {
    basics: 3.2,
    lifestyle: 2.9,
    interests: 4.6,
    dealbreakers: 3.1,
    privacy: 3.0
  },
  "u-103": {
    basics: 3.7,
    lifestyle: 3.4,
    interests: 4.0,
    dealbreakers: 3.8,
    privacy: 4.2
  }
};

const initialAccountState: AccountState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  verificationMethod: "email",
  verificationCode: "",
  idCheckChoice: "skip"
};

const categoryQuestionCounts = questionBank.reduce<Record<CategoryId, number>>(
  (counts, question) => {
    counts[question.category] += 1;
    return counts;
  },
  {
    basics: 0,
    lifestyle: 0,
    interests: 0,
    dealbreakers: 0,
    privacy: 0
  }
);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function validateAccount(account: AccountState) {
  if (!account.fullName.trim() || !account.email.trim() || !account.phone.trim() || !account.password.trim()) {
    return "Complete name, email, phone, and password before moving on.";
  }

  if (!/\S+@\S+\.\S+/.test(account.email)) {
    return "Use a valid email address for the prototype sign-up.";
  }

  if (account.phone.replace(/\D/g, "").length < 10) {
    return "Enter a phone number with at least 10 digits.";
  }

  if (account.password.trim().length < 8) {
    return "Use at least 8 characters for the prototype password.";
  }

  return "";
}

function getCategoryAverage(categoryId: CategoryId, answers: QuizAnswers) {
  const answeredScores = questionBank
    .filter((question) => question.category === categoryId)
    .map((question) => answers[question.id])
    .filter((score): score is number => typeof score === "number");

  if (!answeredScores.length) {
    return 0;
  }

  const total = answeredScores.reduce((sum, score) => sum + score, 0);
  return Number((total / answeredScores.length).toFixed(1));
}

function describeCategoryScore(score: number) {
  if (score >= 4.5) {
    return "Very strong";
  }

  if (score >= 3.8) {
    return "Strong";
  }

  if (score >= 3) {
    return "Balanced";
  }

  if (score >= 2.2) {
    return "Light";
  }

  return "Low";
}

function describeMatchScore(score: number) {
  if (score >= 92) {
    return "Very close fit";
  }

  if (score >= 84) {
    return "Strong fit";
  }

  if (score >= 76) {
    return "Good fit";
  }

  return "Possible fit";
}

function matchReasons(userScores: MatchTarget, targetScores: MatchTarget) {
  return categoryMeta
    .map((category) => ({
      title: category.title,
      diff: Math.abs(userScores[category.id] - targetScores[category.id])
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 2)
    .map((item) => item.title)
    .join(" + ");
}

function App() {
  const [screen, setScreen] = useState<ScreenId>("account");
  const [account, setAccount] = useState<AccountState>(initialAccountState);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [status, setStatus] = useState<StatusState>({ kind: "idle", message: "" });

  const screenIndex = screenOrder.indexOf(screen);
  const totalQuestions = questionBank.length;
  const answeredCount = Object.keys(quizAnswers).length;
  const quizProgress = (answeredCount / totalQuestions) * 100;
  const currentQuestion = questionBank[questionIndex];
  const nextQuestion = questionBank[questionIndex + 1] ?? null;
  const currentCategory = categoryMeta.find((category) => category.id === currentQuestion.category) ?? categoryMeta[0];
  const currentCategoryQuestions = questionBank.filter((question) => question.category === currentQuestion.category);
  const currentCategoryQuestionNumber =
    currentCategoryQuestions.findIndex((question) => question.id === currentQuestion.id) + 1;

  const userCategoryScores = useMemo(
    () =>
      categoryMeta.reduce(
        (scores, category) => {
          scores[category.id] = getCategoryAverage(category.id, quizAnswers);
          return scores;
        },
        {
          basics: 0,
          lifestyle: 0,
          interests: 0,
          dealbreakers: 0,
          privacy: 0
        } as MatchTarget
      ),
    [quizAnswers]
  );

  const summaryCards = useMemo(
    () =>
      categoryMeta
        .map((category) => ({
          ...category,
          score: userCategoryScores[category.id]
        }))
        .sort((a, b) => b.score - a.score),
    [userCategoryScores]
  );

  const starterMatches = useMemo(
    () =>
      fakeUsers
        .map((user) => {
          const target = matchTargets[user.id];
          const meanDifference =
            categoryMeta.reduce((sum, category) => {
              return sum + Math.abs(userCategoryScores[category.id] - target[category.id]);
            }, 0) / categoryMeta.length;

          const score = clamp(Math.round(97 - meanDifference * 18), 68, 97);

          return {
            ...user,
            score,
            alignedOn: matchReasons(userCategoryScores, target)
          };
        })
        .sort((a, b) => b.score - a.score),
    [userCategoryScores]
  );

  const clearStatus = () => {
    if (status.kind !== "idle") {
      setStatus({ kind: "idle", message: "" });
    }
  };

  const updateAccountField = <K extends keyof AccountState,>(field: K, value: AccountState[K]) => {
    setAccount((current) => ({ ...current, [field]: value }));
    clearStatus();
  };

  const useStarterAccount = (
    values: Pick<AccountState, "fullName" | "email" | "phone" | "password">
  ) => {
    setAccount((current) => ({ ...current, ...values }));
    clearStatus();
  };

  const handleAccountSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateAccount(account);

    if (validationMessage) {
      setStatus({ kind: "error", message: validationMessage });
      return;
    }

    setScreen("verify");
    setStatus({ kind: "idle", message: "" });
  };

  const handleVerifySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (account.verificationCode.trim() !== DEMO_VERIFICATION_CODE) {
      setStatus({
        kind: "error",
        message: `Enter the demo verification code ${DEMO_VERIFICATION_CODE} to continue.`
      });
      return;
    }

    setScreen("quiz");
    setStatus({ kind: "idle", message: "" });
  };

  const handleAnswer = (value: number) => {
    setQuizAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
    setStatus({ kind: "idle", message: "" });

    if (questionIndex === totalQuestions - 1) {
      setScreen("summary");
      setStatus({
        kind: "success",
        message: "All 20 questions are complete. The profile draft is ready."
      });
      return;
    }

    setQuestionIndex((index) => index + 1);
  };

  const goBackFromQuiz = () => {
    setStatus({ kind: "idle", message: "" });

    if (questionIndex === 0) {
      setScreen("verify");
      return;
    }

    setQuestionIndex((index) => index - 1);
  };

  const restartPrototype = () => {
    setScreen("account");
    setAccount(initialAccountState);
    setQuizAnswers({});
    setQuestionIndex(0);
    setStatus({ kind: "idle", message: "" });
  };

  const renderStatus = () =>
    status.message ? (
      <p className={`status-banner ${status.kind}`} role="status" aria-live="polite">
        {status.message}
      </p>
    ) : null;

  const renderTopBar = () => (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <p className="brand-title">Roommate Match</p>
          <p className="brand-subtitle">Frontend-only onboarding prototype</p>
        </div>
      </div>

      <ol className="screen-pills" aria-label="Prototype page progress">
        {screenOrder.map((item, index) => {
          const state =
            index === screenIndex ? "active" : index < screenIndex ? "done" : "upcoming";

          return (
            <li key={item} className={`screen-pill ${state}`}>
              <span>{index + 1}</span>
              <strong>{screenTitles[item]}</strong>
            </li>
          );
        })}
      </ol>
    </header>
  );

  const renderAccountScreen = () => (
    <section className="screen split-screen">
      <div className="hero-pane hero-pane-coral">
        <p className="eyebrow">Page 1 of 4</p>
        <h1>Start with sign-up, not sign-in.</h1>
        <p className="lede">
          This prototype should feel like a real onboarding flow. Account creation is the first
          page, then identity verification, then the question cards.
        </p>

        <div className="hero-grid">
          <article className="hero-card">
            <strong>Separate pages</strong>
            <p>Each major step lives on its own screen instead of one crowded form.</p>
          </article>
          <article className="hero-card">
            <strong>Fast prototype</strong>
            <p>Everything stays local, so you can test the flow without backend work.</p>
          </article>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Create account</p>
            <h2>Set up the first page</h2>
            <p>Use a starter account or type the details manually.</p>
          </div>

          <div className="starter-row">
            {starterAccounts.map((starter) => (
              <button
                key={starter.title}
                type="button"
                className="starter-card"
                onClick={() => useStarterAccount(starter.values)}
              >
                <strong>{starter.title}</strong>
                <span>{starter.description}</span>
              </button>
            ))}
          </div>

          <form className="stack-form" onSubmit={handleAccountSubmit} noValidate>
            <div className="field-grid">
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Avery Johnson"
                  value={account.fullName}
                  onChange={(event) => updateAccountField("fullName", event.target.value)}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="name@campus.edu"
                  value={account.email}
                  onChange={(event) => updateAccountField("email", event.target.value)}
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  placeholder="(555) 010-1234"
                  value={account.phone}
                  onChange={(event) => updateAccountField("phone", event.target.value)}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Use 8+ characters"
                  value={account.password}
                  onChange={(event) => updateAccountField("password", event.target.value)}
                />
              </label>
            </div>

            {renderStatus()}

            <div className="button-row">
              <p className="inline-note">No login page here. The prototype always starts at sign-up.</p>
              <button className="primary-button" type="submit">
                Continue to verification
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );

  const renderVerifyScreen = () => (
    <section className="screen split-screen">
      <div className="hero-pane hero-pane-blue">
        <p className="eyebrow">Page 2 of 4</p>
        <h1>Verification gets its own page too.</h1>
        <p className="lede">
          Keep the trust signal simple: pick email or phone, enter the demo code, then continue
          into the question flow.
        </p>

        <div className="verify-note">
          <p className="note-title">Demo code</p>
          <p>{DEMO_VERIFICATION_CODE}</p>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Verify identity</p>
            <h2>Confirm the account</h2>
            <p>Choose how the one-time code is delivered and whether the prototype includes ID check.</p>
          </div>

          <form className="stack-form" onSubmit={handleVerifySubmit} noValidate>
            <div className="choice-row">
              <button
                type="button"
                className={account.verificationMethod === "email" ? "choice-card active" : "choice-card"}
                onClick={() => updateAccountField("verificationMethod", "email")}
              >
                <strong>Email code</strong>
                <span>{account.email || "Send to email"}</span>
              </button>

              <button
                type="button"
                className={account.verificationMethod === "phone" ? "choice-card active" : "choice-card"}
                onClick={() => updateAccountField("verificationMethod", "phone")}
              >
                <strong>Phone code</strong>
                <span>{account.phone || "Send to phone"}</span>
              </button>
            </div>

            <label className="full-width">
              Verification code
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6 digits"
                value={account.verificationCode}
                onChange={(event) => updateAccountField("verificationCode", event.target.value)}
              />
            </label>

            <div className="toggle-group">
              <button
                type="button"
                className={account.idCheckChoice === "skip" ? "toggle-button active" : "toggle-button"}
                onClick={() => updateAccountField("idCheckChoice", "skip")}
              >
                Skip ID check
              </button>
              <button
                type="button"
                className={account.idCheckChoice === "include" ? "toggle-button active" : "toggle-button"}
                onClick={() => updateAccountField("idCheckChoice", "include")}
              >
                Include ID check
              </button>
            </div>

            {renderStatus()}

            <div className="button-row">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setScreen("account");
                  setStatus({ kind: "idle", message: "" });
                }}
              >
                Back
              </button>
              <button className="primary-button" type="submit">
                Start questionnaire
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );

  const renderQuizScreen = () => (
    <section className="screen quiz-screen">
      <aside className="quiz-rail">
        <p className="eyebrow">Page 3 of 4</p>
        <h1>Answer one card at a time.</h1>
        <p className="lede">
          There are 20 questions across 5 categories. Tap a level from 1 to 5 and the next card
          replaces the current one.
        </p>

        <div className="progress-card">
          <div className="progress-copy">
            <strong>{answeredCount} / 20 answered</strong>
            <span>{Math.round(quizProgress)}% complete</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${quizProgress}%` }} />
          </div>
        </div>

        <ul className="category-list">
          {categoryMeta.map((category) => {
            const categoryQuestionsAnswered = questionBank.filter(
              (question) => question.category === category.id && typeof quizAnswers[question.id] === "number"
            ).length;
            const state =
              category.id === currentQuestion.category
                ? "active"
                : categoryQuestionsAnswered === categoryQuestionCounts[category.id]
                  ? "done"
                  : "upcoming";

            return (
              <li key={category.id} className={`category-item ${state} tone-${category.accent}`}>
                <div>
                  <strong>{category.title}</strong>
                  <p>{category.summary}</p>
                </div>
                <span>
                  {categoryQuestionsAnswered}/{categoryQuestionCounts[category.id]}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="scale-note">
          <span>1 = Not me</span>
          <span>5 = Exactly me</span>
        </div>
      </aside>

      <div className="quiz-stage">
        <div className="quiz-meta">
          <div>
            <p className="panel-kicker">Question {questionIndex + 1} of {totalQuestions}</p>
            <h2>{currentCategory.title}</h2>
          </div>
          <span className={`category-badge tone-${currentCategory.accent}`}>
            {currentCategoryQuestionNumber}/{currentCategoryQuestions.length}
          </span>
        </div>

        <div className="question-stack">
          {nextQuestion ? (
            <article className="question-card question-card-ghost" aria-hidden="true">
              <p className="question-overline">Up next</p>
              <h3>{nextQuestion.prompt}</h3>
            </article>
          ) : null}

          <article key={currentQuestion.id} className={`question-card question-card-active tone-${currentCategory.accent}`}>
            <p className="question-overline">{currentCategory.summary}</p>
            <h3>{currentQuestion.prompt}</h3>
            <p className="question-hint">{currentQuestion.hint}</p>

            <div className="rating-grid" role="group" aria-label={`Choose a level for: ${currentQuestion.prompt}`}>
              {scaleChoices.map((choice) => (
                <button
                  key={choice.value}
                  type="button"
                  className={
                    quizAnswers[currentQuestion.id] === choice.value
                      ? "rating-choice selected"
                      : "rating-choice"
                  }
                  onClick={() => handleAnswer(choice.value)}
                >
                  <strong>{choice.value}</strong>
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
          </article>
        </div>

        <div className="button-row quiz-actions">
          <button type="button" className="secondary-button" onClick={goBackFromQuiz}>
            Back
          </button>
          <p className="inline-note">Tap any choice and the next question slides in.</p>
        </div>
      </div>
    </section>
  );

  const renderSummaryScreen = () => (
    <section className="screen summary-screen">
      <div className="summary-hero">
        <p className="eyebrow">Page 4 of 4</p>
        <h1>{account.fullName}'s profile draft is ready.</h1>
        <p className="lede">
          The questionnaire is complete. These scores are based on 20 answers across the 5 question
          types from the onboarding flow.
        </p>

        <div className="summary-tags">
          <span>{answeredCount} answers</span>
          <span>{account.verificationMethod} verified</span>
          <span>{account.idCheckChoice === "include" ? "ID check included" : "ID check skipped"}</span>
        </div>

        {renderStatus()}
      </div>

      <div className="summary-grid">
        <section className="summary-panel">
          <div className="panel-headline">
            <p className="panel-kicker">Category scores</p>
            <h2>Roommate profile signals</h2>
          </div>

          <div className="signal-grid">
            {summaryCards.map((category) => (
              <article key={category.id} className={`signal-card tone-${category.accent}`}>
                <div className="signal-top">
                  <strong>{category.title}</strong>
                  <span>{category.score.toFixed(1)}/5</span>
                </div>
                <p>{describeCategoryScore(category.score)}</p>
                <div className="mini-track" aria-hidden="true">
                  <span style={{ width: `${(category.score / 5) * 100}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="summary-panel">
          <div className="panel-headline">
            <p className="panel-kicker">Account snapshot</p>
            <h2>What this profile carries forward</h2>
          </div>

          <div className="detail-list">
            <article className="detail-card">
              <strong>Name</strong>
              <span>{account.fullName}</span>
            </article>
            <article className="detail-card">
              <strong>Email</strong>
              <span>{account.email}</span>
            </article>
            <article className="detail-card">
              <strong>Phone</strong>
              <span>{account.phone}</span>
            </article>
            <article className="detail-card">
              <strong>Strongest categories</strong>
              <span>{summaryCards.slice(0, 2).map((category) => category.title).join(" + ")}</span>
            </article>
          </div>
        </section>

        <section className="summary-panel match-panel">
          <div className="panel-headline">
            <p className="panel-kicker">Sample matches</p>
            <h2>Who this profile aligns with</h2>
          </div>

          <div className="match-list">
            {starterMatches.map((match) => (
              <article key={match.id} className="match-card">
                <div className="match-score">
                  <strong>{match.score}%</strong>
                  <span>{describeMatchScore(match.score)}</span>
                </div>
                <div className="match-copy">
                  <h3>{match.name}</h3>
                  <p className="match-meta">
                    {match.major} - {match.budget}
                  </p>
                  <p>{match.vibe}</p>
                  <p className="match-alignment">Closest on {match.alignedOn}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setScreen("quiz");
            setQuestionIndex(totalQuestions - 1);
            setStatus({ kind: "idle", message: "" });
          }}
        >
          Back to questions
        </button>
        <button type="button" className="primary-button" onClick={restartPrototype}>
          Start over
        </button>
      </div>
    </section>
  );

  return (
    <div className="app">
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <div className="orb orb-c" aria-hidden="true" />

      <main className="stage-shell">
        {renderTopBar()}

        {screen === "account" && renderAccountScreen()}
        {screen === "verify" && renderVerifyScreen()}
        {screen === "quiz" && renderQuizScreen()}
        {screen === "summary" && renderSummaryScreen()}
      </main>
    </div>
  );
}

export default App;
