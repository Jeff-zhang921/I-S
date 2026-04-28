import { FormEvent } from "react";
import OnboardingLayout from "../components/OnboardingLayout";
import StatusBanner from "../components/StatusBanner";
import TopBackButton from "../components/TopBackButton";
import { AccountState, StatusState } from "../types";

type VerificationPageProps = {
  account: AccountState;
  demoCode: string;
  status: StatusState;
  onChange: <K extends keyof AccountState>(field: K, value: AccountState[K]) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function VerificationPage({
  account,
  demoCode,
  status,
  onChange,
  onBack,
  onSubmit
}: VerificationPageProps) {
  return (
    <OnboardingLayout sectionClassName="verify-screen verification-screen" shellClassName="verify-panel-shell">
        <TopBackButton label="Back" onClick={onBack} />
          <div className="panel-head">
            <p className="panel-kicker">Verification</p>
            <h2>Confirm the account signal</h2>
            <p className="verify-support-copy">
              Choose the delivery method and enter the demo code <strong>{demoCode}</strong> to confirm the account
              contact signal.
            </p>
          </div>

          <form className="stack-form verify-form" onSubmit={onSubmit} noValidate>
            <div className="verify-fields">
              <div className="choice-row verify-choice-row">
                <button
                  type="button"
                  className={account.verificationMethod === "email" ? "choice-card active" : "choice-card"}
                  onClick={() => onChange("verificationMethod", "email")}
                >
                  <strong>Email code</strong>
                  <span>{account.email || "Send to email"}</span>
                </button>

                <button
                  type="button"
                  className={account.verificationMethod === "phone" ? "choice-card active" : "choice-card"}
                  onClick={() => onChange("verificationMethod", "phone")}
                >
                  <strong>Phone code</strong>
                  <span>{account.phone || "Send to phone"}</span>
                </button>
              </div>

              <label className="full-width">
                Verification code
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6 digits"
                  value={account.verificationCode}
                  onChange={(event) => onChange("verificationCode", event.target.value)}
                />
              </label>
            </div>

            <div className="verify-footer">
              <StatusBanner status={status} />

              <div className="button-row verify-actions">
                <button className="primary-button" type="submit">
                  Continue to profile visibility
                </button>
              </div>
            </div>
          </form>
    </OnboardingLayout>
  );
}

export default VerificationPage;
