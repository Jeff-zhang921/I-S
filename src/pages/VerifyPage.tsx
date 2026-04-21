import { FormEvent } from "react";
import TopBackButton from "../components/TopBackButton";
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
      <div className="hero-pane hero-pane-blue scene-pane">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="hero-pane-copy">
          <p className="eyebrow">Page 2 of 10</p>
          <h1>Set trust and visibility before matching goes live.</h1>
          <p className="lede">
            This step explains how visible the profile will be before the questionnaire starts. Code delivery,
            visibility, and ID checks combine into one clear trust setup.
          </p>
        </div>

        <div className="hero-signal-row">
          <span className="signal-pill">Code verification</span>
          <span className="signal-pill">Privacy tuning</span>
          <span className="signal-pill">Optional ID proof</span>
        </div>

        <div className="hero-grid hero-grid-epic hero-grid-verify">
          <article className="hero-card">
            <strong>Trust controls</strong>
            <p>Pick how the renter proves they are real before the questionnaire shapes the profile.</p>
          </article>
          <article className="hero-card">
            <strong>Visibility impact</strong>
            <p>Each visibility option tells the user who can see the profile and how much screening happens first.</p>
          </article>
        </div>

        <div className="verify-note">
          <p className="note-title">Demo code</p>
          <p>{demoCode}</p>
        </div>

        <div className="trust-orbit" aria-hidden="true">
          <div className="trust-orbit-ring" />
          <div className="trust-node trust-node-primary">Code</div>
          <div className="trust-node trust-node-right">Privacy</div>
          <div className="trust-node trust-node-bottom">ID</div>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell verify-panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Verify identity</p>
            <h2>Confirm the account signal</h2>
            <p className="verify-support-copy">Choose the code delivery method, the profile visibility setting, and the optional ID check before the survey starts.</p>
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
                <p className="panel-kicker">Profile visibility</p>
                <p className="verify-support-copy">Pick the option that best matches how early you want your profile details to appear.</p>
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
                    <small>{option.questionCount} screening questions in onboarding</small>
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
