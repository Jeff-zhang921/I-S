import { FormEvent } from "react";
import OnboardingLayout from "../components/OnboardingLayout";
import PrivacySelector from "../components/PrivacySelector";
import StatusBanner from "../components/StatusBanner";
import TopBackButton from "../components/TopBackButton";
import { AccountState, PrivacyLevelOption, StatusState } from "../types";

type ProfileVisibilityPageProps = {
  account: AccountState;
  privacyLevelOptions: PrivacyLevelOption[];
  status: StatusState;
  onChange: <K extends keyof AccountState>(field: K, value: AccountState[K]) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ProfileVisibilityPage({
  account,
  privacyLevelOptions,
  status,
  onChange,
  onBack,
  onSubmit
}: ProfileVisibilityPageProps) {
  const currentVisibilityLabel =
    privacyLevelOptions.find((option) => option.value === account.privacyLevel)?.summaryLabel ?? "Visibility not set";

  return (
    <OnboardingLayout sectionClassName="verify-screen profile-visibility-screen" shellClassName="verify-panel-shell">
        <TopBackButton label="Back" onClick={onBack} />
          <div className="panel-head">
            <p className="panel-kicker">Profile visibility</p>
            <h2>Set when the profile becomes visible</h2>
            <p className="verify-support-copy">
              Current setting: <strong>{currentVisibilityLabel}</strong>. Keep this step focused on visibility only.
              Commitment level now lives on its own page right after this.
            </p>
          </div>

          <form className="stack-form verify-form" onSubmit={onSubmit} noValidate>
            <div className="verify-fields">
              <PrivacySelector
                options={privacyLevelOptions}
                value={account.privacyLevel}
                onChange={(value) => onChange("privacyLevel", value)}
              />
            </div>

            <div className="verify-footer">
              <StatusBanner status={status} />

              <div className="button-row verify-actions">
                <button className="primary-button" type="submit">
                  Continue to commitment level
                </button>
              </div>
            </div>
          </form>
    </OnboardingLayout>
  );
}

export default ProfileVisibilityPage;
