import { FormEvent } from "react";
import CommitmentSelector from "../components/CommitmentSelector";
import OnboardingLayout from "../components/OnboardingLayout";
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
    <OnboardingLayout sectionClassName="verify-screen commitment-level-screen" shellClassName="verify-panel-shell">
        <TopBackButton label="Back" onClick={onBack} />
          <div className="panel-head">
            <p className="panel-kicker">Commitment level</p>
            <h2>Choose the move timeline signal</h2>
            <p className="verify-support-copy">
              Current level: <strong>{describeCommitmentLevel(account.commitmentLevel)}</strong>. This is the final
              account setup step before the lifestyle survey opens.
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
                  Start lifestyle survey
                </button>
              </div>
            </div>
          </form>
    </OnboardingLayout>
  );
}

export default CommitmentLevelPage;
