import { FormEvent } from "react";
import StatusBanner from "../components/StatusBanner";
import TopBackButton from "../components/TopBackButton";
import { AccountState, StatusState } from "../types";

const suggestedCities = ["Bristol", "London", "Manchester", "Leeds", "Birmingham", "Liverpool"];

type CitySelectionPageProps = {
  account: AccountState;
  status: StatusState;
  onChange: <K extends keyof AccountState>(field: K, value: AccountState[K]) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function CitySelectionPage({ account, status, onChange, onBack, onSubmit }: CitySelectionPageProps) {
  return (
    <section className="screen split-screen verify-screen city-selection-screen">
      <div className="hero-pane hero-pane-blue scene-pane">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="hero-pane-copy">
          <p className="eyebrow">Page 2 of 12</p>
          <h1>Set the target city for this search or listing flow.</h1>
          <p className="lede">
            Capture the city before verification and profile setup so later renter and owner journeys know where this
            account intends to operate.
          </p>
        </div>

        <div className="hero-signal-row">
          <span className="signal-pill">Search targeting</span>
          <span className="signal-pill">Listing city</span>
          <span className="signal-pill">Journey context</span>
        </div>

        <div className="hero-grid hero-grid-epic hero-grid-verify">
          <article className="hero-card">
            <strong>Shared city state</strong>
            <p>The same target city is carried into both the renter and owner journeys after onboarding.</p>
          </article>
          <article className="hero-card">
            <strong>Boilerplate step</strong>
            <p>This page is intentionally lightweight so the city input can evolve into search routing later.</p>
          </article>
        </div>

        <div className="verify-note">
          <p className="note-title">Current city</p>
          <p>{account.targetCity.trim() || "No city selected yet"}</p>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell verify-panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Target city</p>
            <h2>Choose where this account is active</h2>
            <p className="verify-support-copy">
              Enter the city where you want to find flatmates or publish listings. The prototype stores this now even
              though the demo inventory is still seeded with Bristol data.
            </p>
          </div>

          <form className="stack-form verify-form" onSubmit={onSubmit} noValidate>
            <div className="verify-fields">
              <label className="full-width">
                Target city
                <input
                  type="text"
                  placeholder="Bristol"
                  value={account.targetCity}
                  onChange={(event) => onChange("targetCity", event.target.value)}
                />
              </label>

              <div className="panel-head compact-head">
                <p className="panel-kicker">Quick picks</p>
                <p className="verify-support-copy">Use a starter city, or type your own.</p>
              </div>

              <div className="tag-preview city-suggestion-row">
                {suggestedCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={account.targetCity === city ? "tag-chip active-chip" : "tag-chip"}
                    onClick={() => onChange("targetCity", city)}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <div className="summary-panel city-preview-panel">
                <p className="panel-kicker">What this step feeds</p>
                <p className="inline-note">
                  Target city is currently saved into onboarding state and profile payload so later routing can use it.
                </p>
              </div>
            </div>

            <div className="verify-footer">
              <StatusBanner status={status} />

              <div className="button-row verify-actions">
                <button className="primary-button" type="submit">
                  Continue to verification
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CitySelectionPage;
