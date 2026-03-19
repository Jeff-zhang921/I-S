import { FormEvent, useMemo, useState } from "react";
import { FakeUser, fakeUsers } from "./data/fakeUsers";
import "./styles.css";

type StatusState =
  | { kind: "idle"; message: string }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

type StepId =
  | "account"
  | "verify"
  | "basics"
  | "lifestyle"
  | "interests"
  | "dealbreakers"
  | "privacy"
  | "profile";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  verificationMethod: "email" | "phone";
  verificationCode: string;
  optionalIdCheck: boolean;
  location: string;
  budget: string;
  moveInDate: string;
  leaseLength: string;
  sleepSchedule: string;
  cleanliness: string;
  guests: string;
  pets: string;
  smoking: string;
  hobbies: string;
  music: string;
  sports: string;
  gaming: string;
  cooking: string;
  socialLevel: string;
  mustHaves: string;
  dealbreakers: string;
  whoCanMessage: string;
  profileVisibility: string;
  shareProfile: string;
  safetyReady: boolean;
};

type StepMeta = {
  id: StepId;
  kicker: string;
  title: string;
  description: string;
};

const DEMO_VERIFICATION_CODE = "246810";

const steps: StepMeta[] = [
  {
    id: "account",
    kicker: "Step 1",
    title: "Create account",
    description: "Prototype mode starts every session with sign-up because there is no backend auth yet."
  },
  {
    id: "verify",
    kicker: "Step 2",
    title: "Verify identity",
    description: "Collect a demo email or phone confirmation and offer the optional ID check from the flow."
  },
  {
    id: "basics",
    kicker: "Step 3",
    title: "Onboarding quiz: basics",
    description: "Capture the practical constraints that shape roommate and room recommendations."
  },
  {
    id: "lifestyle",
    kicker: "Step 4",
    title: "Onboarding quiz: lifestyle",
    description: "Record daily habits so compatibility can reflect how people actually live."
  },
  {
    id: "interests",
    kicker: "Step 5",
    title: "Onboarding quiz: interests",
    description: "Gather personality and social preferences instead of only logistics."
  },
  {
    id: "dealbreakers",
    kicker: "Step 6",
    title: "Dealbreakers + must-haves",
    description: "Make the non-negotiables explicit before people start matching."
  },
  {
    id: "privacy",
    kicker: "Step 7",
    title: "Privacy & safety",
    description: "Define how visible the profile is and who can contact the user."
  },
  {
    id: "profile",
    kicker: "Step 8",
    title: "Create profile",
    description: "Package the sign-up and quiz answers into the profile this prototype can use next."
  }
];

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  verificationMethod: "email",
  verificationCode: "",
  optionalIdCheck: false,
  location: "",
  budget: "",
  moveInDate: "",
  leaseLength: "",
  sleepSchedule: "",
  cleanliness: "",
  guests: "",
  pets: "",
  smoking: "",
  hobbies: "",
  music: "",
  sports: "",
  gaming: "",
  cooking: "",
  socialLevel: "",
  mustHaves: "",
  dealbreakers: "",
  whoCanMessage: "",
  profileVisibility: "",
  shareProfile: "",
  safetyReady: false
};

const sampleDrafts: Array<{ title: string; description: string; values: Partial<FormState> }> = [
  {
    title: "Quiet planner",
    description: "Early move-in, tidy apartment, low-drama shared routine.",
    values: {
      fullName: "Maya Patel",
      email: "maya@campus.edu",
      phone: "555-010-1101",
      password: "demo1234",
      location: "Boston, MA",
      budget: "$900-$1,100",
      moveInDate: "2026-08-15",
      leaseLength: "12 months",
      sleepSchedule: "Early riser",
      cleanliness: "Very tidy",
      guests: "Occasionally",
      pets: "No pets",
      smoking: "No",
      hobbies: "reading, pilates, weekend cafe hopping",
      music: "Lo-fi and acoustic",
      sports: "Casual",
      gaming: "Rarely",
      cooking: "Meal prep every week",
      socialLevel: "Balanced",
      mustHaves: "Quiet after 10pm, shared cleaning plan, natural light",
      dealbreakers: "Indoor smoking, unpaid bills, frequent overnight guests",
      whoCanMessage: "Matches only",
      profileVisibility: "Visible in my city",
      shareProfile: "After mutual interest",
      safetyReady: true
    }
  },
  {
    title: "Social host",
    description: "More outgoing, flexible routine, wants a lively but respectful space.",
    values: {
      fullName: "Ethan Kim",
      email: "ethan@campus.edu",
      phone: "555-010-4477",
      password: "roommate!",
      location: "Brooklyn, NY",
      budget: "$800-$1,000",
      moveInDate: "2026-09-01",
      leaseLength: "9 months",
      sleepSchedule: "Flexible",
      cleanliness: "Moderately tidy",
      guests: "Weekly",
      pets: "Pet friendly",
      smoking: "Outside only",
      hobbies: "pickup basketball, gym, cooking nights",
      music: "Hip-hop and house",
      sports: "Very active",
      gaming: "Some weekends",
      cooking: "Likes shared dinners",
      socialLevel: "Social",
      mustHaves: "Good kitchen, short commute, respectful communication",
      dealbreakers: "Passive-aggressive conflict, hidden fees, no guest boundaries",
      whoCanMessage: "Verified users",
      profileVisibility: "Visible in nearby neighborhoods",
      shareProfile: "Right away",
      safetyReady: true
    }
  }
];

const buttonLabels: Record<StepId, string> = {
  account: "Continue to verification",
  verify: "Continue to basics",
  basics: "Continue to lifestyle",
  lifestyle: "Continue to interests",
  interests: "Continue to dealbreakers",
  dealbreakers: "Continue to safety",
  privacy: "Review profile",
  profile: "Create prototype profile"
};

function validateStep(stepId: StepId, form: FormState) {
  switch (stepId) {
    case "account":
      if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
        return "Complete name, email, phone, and password before continuing.";
      }
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        return "Use a valid email address for the prototype sign-up.";
      }
      if (form.password.trim().length < 8) {
        return "Use at least 8 characters for the prototype password.";
      }
      if (form.phone.replace(/\D/g, "").length < 10) {
        return "Enter a phone number with at least 10 digits.";
      }
      return "";
    case "verify":
      if (form.verificationCode.trim() !== DEMO_VERIFICATION_CODE) {
        return `Enter the demo verification code ${DEMO_VERIFICATION_CODE} to continue.`;
      }
      return "";
    case "basics":
      if (!form.location || !form.budget || !form.moveInDate || !form.leaseLength) {
        return "Finish the basics section before moving on.";
      }
      return "";
    case "lifestyle":
      if (!form.sleepSchedule || !form.cleanliness || !form.guests || !form.pets || !form.smoking) {
        return "Answer each lifestyle question so the prototype has usable compatibility data.";
      }
      return "";
    case "interests":
      if (
        !form.hobbies.trim() ||
        !form.music ||
        !form.sports ||
        !form.gaming ||
        !form.cooking ||
        !form.socialLevel
      ) {
        return "Finish the interests section before moving on.";
      }
      return "";
    case "dealbreakers":
      if (!form.mustHaves.trim() || !form.dealbreakers.trim()) {
        return "Add at least one must-have and one dealbreaker.";
      }
      return "";
    case "privacy":
      if (!form.whoCanMessage || !form.profileVisibility || !form.shareProfile || !form.safetyReady) {
        return "Confirm the privacy settings and acknowledge the safety tools.";
      }
      return "";
    case "profile":
      return "";
    default:
      return "";
  }
}

function calculateMatchScore(user: FakeUser, form: FormState) {
  let score = 72;

  if (form.budget && user.budget === form.budget) {
    score += 10;
  }

  if (/early riser/i.test(user.vibe) && form.sleepSchedule === "Early riser") {
    score += 8;
  }

  if (/night owl/i.test(user.vibe) && form.sleepSchedule === "Night owl") {
    score += 8;
  }

  if (/tidy|organized/i.test(user.vibe) && form.cleanliness === "Very tidy") {
    score += 6;
  }

  if (/social|cooking/i.test(user.vibe) && (form.socialLevel === "Social" || form.socialLevel === "Balanced")) {
    score += 6;
  }

  return Math.min(score, 97);
}

function App() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [status, setStatus] = useState<StatusState>({ kind: "idle", message: "" });
  const [profileCreated, setProfileCreated] = useState(false);

  const currentStep = steps[currentStepIndex];
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  const summarySections = useMemo(
    () => [
      {
        title: "Account",
        items: [form.fullName, form.email, form.phone]
      },
      {
        title: "Basics",
        items: [form.location, form.budget, form.moveInDate, form.leaseLength]
      },
      {
        title: "Lifestyle",
        items: [form.sleepSchedule, form.cleanliness, form.guests, form.pets, form.smoking]
      },
      {
        title: "Interests",
        items: [form.hobbies, form.music, form.sports, form.gaming, form.cooking, form.socialLevel]
      },
      {
        title: "Safety",
        items: [form.mustHaves, form.dealbreakers, form.whoCanMessage, form.profileVisibility, form.shareProfile]
      }
    ],
    [form]
  );

  const starterMatches = useMemo(
    () =>
      fakeUsers
        .map((user) => ({
          ...user,
          score: calculateMatchScore(user, form)
        }))
        .sort((a, b) => b.score - a.score),
    [form]
  );

  const updateField = <K extends keyof FormState,>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));

    if (status.kind !== "idle") {
      setStatus({ kind: "idle", message: "" });
    }

    if (profileCreated) {
      setProfileCreated(false);
    }
  };

  const useSampleDraft = (draft: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...draft }));
    setStatus({ kind: "idle", message: "" });
    setProfileCreated(false);
  };

  const goBack = () => {
    setStatus({ kind: "idle", message: "" });
    setProfileCreated(false);
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateStep(currentStep.id, form);

    if (validationMessage) {
      setStatus({ kind: "error", message: validationMessage });
      setProfileCreated(false);
      return;
    }

    if (currentStep.id === "profile") {
      setProfileCreated(true);
      setStatus({
        kind: "success",
        message: "Profile created locally. The next prototype steps can now use this data for matching, chat, and scheduling."
      });
      return;
    }

    setStatus({ kind: "idle", message: "" });
    setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  const renderStepFields = () => {
    switch (currentStep.id) {
      case "account":
        return (
          <>
            <div className="callout">
              <p className="callout-title">Prototype note</p>
              <p>
                Everyone starts with sign-up here. There is no real authentication service behind
                this UI yet, so the first screen should behave like account creation.
              </p>
            </div>

            <div className="sample-row">
              {sampleDrafts.map((draft) => (
                <button
                  key={draft.title}
                  type="button"
                  className="sample-card"
                  onClick={() => useSampleDraft(draft.values)}
                >
                  <strong>{draft.title}</strong>
                  <span>{draft.description}</span>
                </button>
              ))}
            </div>

            <div className="input-grid">
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Avery Johnson"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="name@campus.edu"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  placeholder="(555) 010-1234"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Use 8+ characters"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                />
              </label>
            </div>
          </>
        );

      case "verify":
        return (
          <>
            <div className="verification-banner">
              <div>
                <p className="callout-title">Demo verification code</p>
                <p>Use <strong>{DEMO_VERIFICATION_CODE}</strong> to simulate the OTP check.</p>
              </div>
              <span className="badge">Frontend only</span>
            </div>

            <div className="choice-grid">
              <button
                type="button"
                className={form.verificationMethod === "email" ? "choice-card active" : "choice-card"}
                onClick={() => updateField("verificationMethod", "email")}
              >
                <strong>Email verification</strong>
                <span>Send the code to {form.email || "your inbox"}.</span>
              </button>

              <button
                type="button"
                className={form.verificationMethod === "phone" ? "choice-card active" : "choice-card"}
                onClick={() => updateField("verificationMethod", "phone")}
              >
                <strong>Phone verification</strong>
                <span>Send the code to {form.phone || "your phone"}.</span>
              </button>
            </div>

            <div className="input-grid">
              <label>
                Verification code
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6 digits"
                  value={form.verificationCode}
                  onChange={(event) => updateField("verificationCode", event.target.value)}
                />
              </label>
            </div>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={form.optionalIdCheck}
                onChange={(event) => updateField("optionalIdCheck", event.target.checked)}
              />
              <span>
                Include the optional ID check in the prototype
                <small>Useful for the trust and safety path, but not required to continue.</small>
              </span>
            </label>
          </>
        );

      case "basics":
        return (
          <div className="input-grid">
            <label>
              Preferred location
              <input
                type="text"
                placeholder="Boston, MA"
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
              />
            </label>

            <label>
              Budget range
              <select value={form.budget} onChange={(event) => updateField("budget", event.target.value)}>
                <option value="">Select budget</option>
                <option value="$800-$1,000">$800-$1,000</option>
                <option value="$900-$1,100">$900-$1,100</option>
                <option value="$1,000-$1,250">$1,000-$1,250</option>
                <option value="$1,250-$1,500">$1,250-$1,500</option>
              </select>
            </label>

            <label>
              Move-in date
              <input
                type="date"
                value={form.moveInDate}
                onChange={(event) => updateField("moveInDate", event.target.value)}
              />
            </label>

            <label>
              Lease length
              <select
                value={form.leaseLength}
                onChange={(event) => updateField("leaseLength", event.target.value)}
              >
                <option value="">Select lease</option>
                <option value="6 months">6 months</option>
                <option value="9 months">9 months</option>
                <option value="12 months">12 months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </label>
          </div>
        );

      case "lifestyle":
        return (
          <div className="input-grid">
            <label>
              Sleep schedule
              <select
                value={form.sleepSchedule}
                onChange={(event) => updateField("sleepSchedule", event.target.value)}
              >
                <option value="">Select sleep schedule</option>
                <option value="Early riser">Early riser</option>
                <option value="Night owl">Night owl</option>
                <option value="Flexible">Flexible</option>
              </select>
            </label>

            <label>
              Cleanliness
              <select
                value={form.cleanliness}
                onChange={(event) => updateField("cleanliness", event.target.value)}
              >
                <option value="">Select cleanliness</option>
                <option value="Very tidy">Very tidy</option>
                <option value="Moderately tidy">Moderately tidy</option>
                <option value="Relaxed">Relaxed</option>
              </select>
            </label>

            <label>
              Guests
              <select value={form.guests} onChange={(event) => updateField("guests", event.target.value)}>
                <option value="">Select guest preference</option>
                <option value="Rarely">Rarely</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Weekly">Weekly</option>
              </select>
            </label>

            <label>
              Pets
              <select value={form.pets} onChange={(event) => updateField("pets", event.target.value)}>
                <option value="">Select pet preference</option>
                <option value="No pets">No pets</option>
                <option value="Pet friendly">Pet friendly</option>
                <option value="Have a pet already">Have a pet already</option>
              </select>
            </label>

            <label>
              Smoking
              <select value={form.smoking} onChange={(event) => updateField("smoking", event.target.value)}>
                <option value="">Select smoking preference</option>
                <option value="No">No</option>
                <option value="Outside only">Outside only</option>
                <option value="Okay with it">Okay with it</option>
              </select>
            </label>
          </div>
        );

      case "interests":
        return (
          <div className="input-grid">
            <label className="wide-field">
              Hobbies
              <input
                type="text"
                placeholder="gaming, climbing, cooking, movie nights"
                value={form.hobbies}
                onChange={(event) => updateField("hobbies", event.target.value)}
              />
            </label>

            <label>
              Music
              <input
                type="text"
                placeholder="Lo-fi, pop, indie"
                value={form.music}
                onChange={(event) => updateField("music", event.target.value)}
              />
            </label>

            <label>
              Sports
              <input
                type="text"
                placeholder="Casual, active, none"
                value={form.sports}
                onChange={(event) => updateField("sports", event.target.value)}
              />
            </label>

            <label>
              Gaming
              <input
                type="text"
                placeholder="PC co-op, console, rarely"
                value={form.gaming}
                onChange={(event) => updateField("gaming", event.target.value)}
              />
            </label>

            <label>
              Cooking
              <input
                type="text"
                placeholder="Meal prep, shared dinners, takeout"
                value={form.cooking}
                onChange={(event) => updateField("cooking", event.target.value)}
              />
            </label>

            <label>
              Social level
              <select
                value={form.socialLevel}
                onChange={(event) => updateField("socialLevel", event.target.value)}
              >
                <option value="">Select social level</option>
                <option value="Quiet">Quiet</option>
                <option value="Balanced">Balanced</option>
                <option value="Social">Social</option>
              </select>
            </label>
          </div>
        );

      case "dealbreakers":
        return (
          <div className="input-grid">
            <label className="wide-field">
              Must-haves
              <textarea
                rows={4}
                placeholder="Budget cap, commute range, chores plan, pet policy"
                value={form.mustHaves}
                onChange={(event) => updateField("mustHaves", event.target.value)}
              />
            </label>

            <label className="wide-field">
              Dealbreakers
              <textarea
                rows={4}
                placeholder="Smoking, late rent, loud weeknights, surprise guests"
                value={form.dealbreakers}
                onChange={(event) => updateField("dealbreakers", event.target.value)}
              />
            </label>
          </div>
        );

      case "privacy":
        return (
          <>
            <div className="input-grid">
              <label>
                Who can message you
                <select
                  value={form.whoCanMessage}
                  onChange={(event) => updateField("whoCanMessage", event.target.value)}
                >
                  <option value="">Select audience</option>
                  <option value="Matches only">Matches only</option>
                  <option value="Verified users">Verified users</option>
                  <option value="Anyone in range">Anyone in range</option>
                </select>
              </label>

              <label>
                Profile visibility
                <select
                  value={form.profileVisibility}
                  onChange={(event) => updateField("profileVisibility", event.target.value)}
                >
                  <option value="">Select visibility</option>
                  <option value="Visible in my city">Visible in my city</option>
                  <option value="Visible in nearby neighborhoods">
                    Visible in nearby neighborhoods
                  </option>
                  <option value="Visible only to suggested matches">
                    Visible only to suggested matches
                  </option>
                </select>
              </label>

              <label className="wide-field">
                When to share your full profile
                <select
                  value={form.shareProfile}
                  onChange={(event) => updateField("shareProfile", event.target.value)}
                >
                  <option value="">Select sharing timing</option>
                  <option value="Right away">Right away</option>
                  <option value="After mutual interest">After mutual interest</option>
                  <option value="After chat starts">After chat starts</option>
                </select>
              </label>
            </div>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={form.safetyReady}
                onChange={(event) => updateField("safetyReady", event.target.checked)}
              />
              <span>
                I understand the profile should include block/report controls later in the flow
                <small>This mirrors the privacy and safety node from the FigJam board.</small>
              </span>
            </label>
          </>
        );

      case "profile":
        return (
          <>
            <div className="summary-grid">
              {summarySections.map((section) => (
                <article key={section.title} className="summary-card">
                  <h3>{section.title}</h3>
                  <ul>
                    {section.items
                      .filter((item) => item)
                      .map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                  </ul>
                </article>
              ))}
            </div>

            <section className="matches-panel" aria-label="Prototype starter matches">
              <div className="panel-head">
                <div>
                  <p className="callout-title">Next screen preview</p>
                  <h3>Suggested roommates unlocked by this profile</h3>
                </div>
                <span className="badge">Sample data</span>
              </div>

              <div className="match-grid">
                {starterMatches.map((match) => (
                  <article key={match.id} className="match-card">
                    <div className="match-score">{match.score}% fit</div>
                    <h4>{match.name}</h4>
                    <p className="match-meta">
                      {match.major} - {match.budget}
                    </p>
                    <p>{match.vibe}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="shape shape-a" aria-hidden="true" />
      <div className="shape shape-b" aria-hidden="true" />

      <main className="wizard-shell">
        <section className="brand-panel">
          <p className="eyebrow">Roommate Match Prototype</p>
          <h1>Account creation now leads directly into verification and onboarding.</h1>
          <p className="subtitle">
            The frontend should follow the core user flow from the board, not pretend sign-in works
            before there is a real backend.
          </p>

          <div className="progress-panel">
            <div className="panel-head">
              <div>
                <p className="callout-title">Current progress</p>
                <h2>{currentStep.title}</h2>
              </div>
              <span className="badge">{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <ol className="step-list">
            {steps.map((step, index) => {
              const state =
                index === currentStepIndex ? "active" : index < currentStepIndex ? "done" : "upcoming";

              return (
                <li key={step.id} className={`step-item ${state}`}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="form-panel">
          <header className="form-head">
            <p className="eyebrow">{currentStep.kicker}</p>
            <h2>{currentStep.title}</h2>
            <p>{currentStep.description}</p>
          </header>

          <form className="wizard-form" onSubmit={handleSubmit} noValidate>
            {renderStepFields()}

            {status.message ? (
              <p className={`message ${status.kind}`} role="status" aria-live="polite">
                {status.message}
              </p>
            ) : null}

            {profileCreated ? (
              <section className="session-card" aria-label="Profile created status">
                <h3>Prototype profile ready</h3>
                <p>{form.fullName} can now continue into browsing, suggested matches, and chat.</p>
                <p>
                  Verification method: {form.verificationMethod}{" "}
                  {form.optionalIdCheck ? "with optional ID check enabled" : "without ID check"}
                </p>
              </section>
            ) : null}

            <div className="action-row">
              <button
                type="button"
                className="secondary-button"
                onClick={goBack}
                disabled={currentStepIndex === 0}
              >
                Back
              </button>

              <button className="primary-button" type="submit">
                {buttonLabels[currentStep.id]}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
