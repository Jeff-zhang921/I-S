import { FormEvent } from "react";
import StatusBanner from "../components/StatusBanner";
import { AccountState, StarterAccount, StatusState } from "../types";

type AccountPageProps = {
  account: AccountState;
  starters: StarterAccount[];
  status: StatusState;
  onUseStarter: (starter: StarterAccount["values"]) => void;
  onChange: <K extends keyof AccountState>(field: K, value: AccountState[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function AccountPage({ account, starters, status, onUseStarter, onChange, onSubmit }: AccountPageProps) {
  return (
    <section className="screen split-screen account-screen">
      <div className="hero-pane hero-pane-coral">
        <p className="eyebrow">Page 1 of 10</p>
        <h1>Start with sign-up, then move straight into the renter flow.</h1>
        <p className="lede">
          This prototype follows the Figma logic as a series of pages. The goal here is the full
          path for someone trying to find a room.
        </p>

        <div className="hero-grid">
          <article className="hero-card">
            <strong>Separate pages</strong>
            <p>Each major step lives in its own file and screen instead of one overloaded component.</p>
          </article>
          <article className="hero-card">
            <strong>Need a room branch</strong>
            <p>After onboarding, the app continues only through the renter side of the flow.</p>
          </article>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Create account</p>
            <h2>Set up the renter profile</h2>
            <p>Use the demo account or type details manually.</p>
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
              <p className="inline-note">The prototype always starts at sign-up because there is no backend auth.</p>
              <button className="primary-button" type="submit">
                Continue to verification
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AccountPage;
