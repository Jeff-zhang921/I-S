import { FormEvent } from "react";
import OnboardingLayout from "../components/OnboardingLayout";
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
    <OnboardingLayout sectionClassName="account-screen" shellClassName="account-panel-shell">
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
                  Your onboarding progress was saved locally, including privacy choices and lifestyle survey answers.
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
    </OnboardingLayout>
  );
}

export default AccountPage;
