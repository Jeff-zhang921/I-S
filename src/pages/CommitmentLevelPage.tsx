import { FormEvent } from "react";
import CommitmentSelector from "../components/CommitmentSelector";
import StatusBanner from "../components/StatusBanner";
import TopBackButton from "../components/TopBackButton";
import { describeCommitmentLevel } from "../lib/findRoom";
import { AccountState, StatusState } from "../types";

type CommitmentLevelPageProps = {
  account: AccountState;
  status: StatusState;
  onChange: <K extends keyof AccountState>(field: K, value: AccountState[K]) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function CommitmentLevelPage({
  account,
  status,
  onChange,
  onBack,
  onSubmit
}: CommitmentLevelPageProps) {
  return (
    <section className="screen split-screen verify-screen commitment-level-screen">
      <div className="hero-pane hero-pane-blue scene-pane">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="hero-pane-copy">
          <p className="eyebrow">Page 5 of 12</p>
          <h1>Set how ready this account is to move.</h1>
          <p className="lede">
            Keep commitment separate from visibility so the intent signal is clearer before the questionnaire begins.
          </p>
        </div>

        <div className="hero-signal-row">
          <span className="signal-pill">Move urgency</span>
          <span className="signal-pill">Owner context</span>
          <span className="signal-pill">Renter context</span>
        </div>

        <div className="hero-grid hero-grid-epic hero-grid-verify">
          <article className="hero-card">
            <strong>Expectation setting</strong>
            <p>Later listing and match screens use this signal to show whether the account is browsing or ready to act.</p>
          </article>
          <article className="hero-card">
            <strong>Separate from privacy</strong>
            <p>Visibility controls who can see the profile. Commitment level shows how soon this account wants to move.</p>
          </article>
        </div>

        <div className="verify-note">
          <p className="note-title">Current level</p>
          <p>{describeCommitmentLevel(account.commitmentLevel)}</p>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell verify-panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Commitment level</p>
            <h2>Choose the move timeline signal</h2>
            <p className="verify-support-copy">
              This is the final account setup step before the questionnaire opens.
            </p>
          </div>

          <form className="stack-form verify-form" onSubmit={onSubmit} noValidate>
            <div className="verify-fields">
              <CommitmentSelector
                value={account.commitmentLevel}
                onChange={(value) => onChange("commitmentLevel", value)}
              />
            </div>

            <div className="verify-footer">
              <StatusBanner status={status} />

              <div className="button-row verify-actions">
                <button className="primary-button" type="submit">
                  Start questionnaire
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CommitmentLevelPage;
