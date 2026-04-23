import { FormEvent } from "react";
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
    <section className="screen split-screen verify-screen profile-visibility-screen">
      <div className="hero-pane hero-pane-blue scene-pane">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="hero-pane-copy">
          <p className="eyebrow">Page 4 of 12</p>
          <h1>Choose who can see this profile before matching starts.</h1>
          <p className="lede">
            Verification is complete. Now set the visibility rules for the profile before choosing how serious this move
            is.
          </p>
        </div>

        <div className="hero-signal-row">
          <span className="signal-pill">Profile visibility</span>
          <span className="signal-pill">Discovery controls</span>
          <span className="signal-pill">Privacy questions</span>
        </div>

        <div className="hero-grid hero-grid-epic hero-grid-verify">
          <article className="hero-card">
            <strong>Match reach</strong>
            <p>Choose whether the profile is broadly discoverable or only revealed after stronger intent is shown.</p>
          </article>
          <article className="hero-card">
            <strong>Question logic</strong>
            <p>The privacy setting determines how many safety and visibility questions appear in the questionnaire.</p>
          </article>
        </div>

        <div className="verify-note">
          <p className="note-title">Current setting</p>
          <p>{currentVisibilityLabel}</p>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell verify-panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Profile visibility</p>
            <h2>Set when the profile becomes visible</h2>
            <p className="verify-support-copy">
              Keep this step focused on visibility only. Commitment level now lives on its own page right after this.
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
        </div>
      </div>
    </section>
  );
}

export default ProfileVisibilityPage;
