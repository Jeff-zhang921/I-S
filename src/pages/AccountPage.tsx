import { FormEvent } from "react";
import StatusBanner from "../components/StatusBanner";
import { AccountState, StarterAccount, StatusState } from "../types";

type AccountPageProps = {
  account: AccountState;
  starters: StarterAccount[];
  status: StatusState;
  hasSavedDraft: boolean;
  onUseStarter: (starter: StarterAccount["values"]) => void;
  onResumeSavedDraft: () => void;
  onChange: <K extends keyof AccountState>(field: K, value: AccountState[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function AccountPage({
  account,
  starters,
  status,
  hasSavedDraft,
  onUseStarter,
  onResumeSavedDraft,
  onChange,
  onSubmit
}: AccountPageProps) {
  return (
    <section className="screen split-screen account-screen">
      <div className="hero-pane hero-pane-coral scene-pane">
        <div className="hero-pane-copy">
          <p className="eyebrow">Page 1 of 12</p>
          <h1>Map your living vibe before the room search begins.</h1>
          <p className="lede">
            The first eight pages now act like a guided signal map: build identity, trust, privacy,
            and roommate rhythm before the live matching journey opens.
          </p>
        </div>

        <div className="hero-signal-row">
          <span className="signal-pill">Mobile-first PWA</span>
          <span className="signal-pill">Bristol demo data</span>
          <span className="signal-pill">Renter and host flows</span>
        </div>

        <div className="hero-grid hero-grid-epic">
          <article className="hero-card">
            <strong>Signal-first onboarding</strong>
            <p>Each step adds enough context that later match cards feel intentional instead of random.</p>
          </article>
          <article className="hero-card">
            <strong>Journey-ready profile</strong>
            <p>The same profile payload can now hand off into either the renter or owner journey.</p>
          </article>
        </div>

        <div className="hero-route-map" aria-hidden="true">
          <div className="hero-route-panel">
            <span>Match confidence</span>
            <strong>82%</strong>
            <small>Profile clarity compounds as the onboarding stack fills in.</small>
          </div>
          <div className="hero-route-rail">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Create account</p>
            <h2>Launch the profile</h2>
            <p>Use a demo renter or enter details manually to start the compatibility journey.</p>
          </div>

          <div className="starter-row account-starter-row">
            {starters.map((starter) => (
              <button
                key={starter.title}
                type="button"
                className="starter-card"
                onClick={() => onUseStarter(starter.values)}
              >
                <strong>{starter.title}</strong>
                <span>{starter.description}</span>
              </button>
            ))}
          </div>

          {hasSavedDraft ? (
            <section className="summary-panel draft-resume-panel">
              <div>
                <p className="panel-kicker">Saved onboarding draft</p>
                <h3>Pick up where you left off</h3>
                <p className="inline-note">
                  Your onboarding progress was saved locally, including privacy choices and questionnaire answers.
                </p>
              </div>
              <button type="button" className="secondary-button" onClick={onResumeSavedDraft}>
                Resume draft
              </button>
            </section>
          ) : null}

          <form className="stack-form account-form" onSubmit={onSubmit} noValidate>
            <div className="field-grid account-field-grid">
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Avery Johnson"
                  value={account.fullName}
                  onChange={(event) => onChange("fullName", event.target.value)}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="name@bristol.ac.uk"
                  value={account.email}
                  onChange={(event) => onChange("email", event.target.value)}
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  placeholder="(555) 010-1234"
                  value={account.phone}
                  onChange={(event) => onChange("phone", event.target.value)}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Use 8+ characters"
                  value={account.password}
                  onChange={(event) => onChange("password", event.target.value)}
                />
              </label>
            </div>

            <StatusBanner status={status} />

            <div className="button-row account-actions">
              <p className="inline-note">There is no backend auth in this prototype, so every session starts from profile setup.</p>
              <button className="primary-button" type="submit">
                Continue to target city
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AccountPage;
