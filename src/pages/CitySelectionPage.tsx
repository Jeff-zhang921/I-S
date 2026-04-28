import { FormEvent } from "react";
import OnboardingLayout from "../components/OnboardingLayout";
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
    <OnboardingLayout sectionClassName="verify-screen city-selection-screen" shellClassName="verify-panel-shell">
        <TopBackButton label="Back" onClick={onBack} />
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
    </OnboardingLayout>
  );
}

export default CitySelectionPage;
