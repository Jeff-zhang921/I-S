import { FormEvent } from "react";
import StatusBanner from "../components/StatusBanner";
import { AccountState, PrivacyLevelOption, StatusState } from "../types";

type VerifyPageProps = {
  account: AccountState;
  demoCode: string;
  privacyLevelOptions: PrivacyLevelOption[];
  status: StatusState;
  onChange: <K extends keyof AccountState>(field: K, value: AccountState[K]) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function VerifyPage({
  account,
  demoCode,
  privacyLevelOptions,
  status,
  onChange,
  onBack,
  onSubmit
}: VerifyPageProps) {
  return (
    <section className="screen split-screen verify-screen">
      <div className="hero-pane hero-pane-blue">
        <p className="eyebrow">Page 2 of 10</p>
        <h1>Verify the profile before matching starts.</h1>
        <p className="lede">
          This page sets the trust level and the privacy depth before the onboarding questions begin.
        </p>

        <div className="verify-note">
          <p className="note-title">Demo code</p>
          <p>{demoCode}</p>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell verify-panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Verify identity</p>
            <h2>Confirm the renter account</h2>
            <p className="verify-support-copy">Choose the code delivery method, privacy level, and optional ID check.</p>
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

              <div className="panel-head compact-head">
                <p className="panel-kicker">Privacy level</p>
                <p className="verify-support-copy">This controls how many privacy questions appear later in onboarding.</p>
              </div>

              <div className="privacy-level-row verify-privacy-row">
                {privacyLevelOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={account.privacyLevel === option.value ? "choice-card active" : "choice-card"}
                    onClick={() => onChange("privacyLevel", option.value)}
                  >
                    <strong>{option.title}</strong>
                    <span>{option.description}</span>
                    <small>{option.questionCount} privacy questions</small>
                  </button>
                ))}
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

              <div className="toggle-group">
                <button
                  type="button"
                  className={account.idCheckChoice === "skip" ? "toggle-button active" : "toggle-button"}
                  onClick={() => onChange("idCheckChoice", "skip")}
                >
                  Skip ID check
                </button>
                <button
                  type="button"
                  className={account.idCheckChoice === "include" ? "toggle-button active" : "toggle-button"}
                  onClick={() => onChange("idCheckChoice", "include")}
                >
                  Include ID check
                </button>
              </div>
            </div>

            <div className="verify-footer">
              <StatusBanner status={status} />

              <div className="button-row verify-actions">
                <button type="button" className="secondary-button" onClick={onBack}>
                  Back
                </button>
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

export default VerifyPage;
