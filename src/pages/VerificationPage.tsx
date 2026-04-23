import { FormEvent } from "react";
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
    <section className="screen split-screen verify-screen verification-screen">
      <div className="hero-pane hero-pane-blue scene-pane">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="hero-pane-copy">
          <p className="eyebrow">Page 3 of 12</p>
          <h1>Confirm the contact method before profile setup continues.</h1>
          <p className="lede">
            Verification now focuses only on phone or email confirmation before the profile settings continue.
          </p>
        </div>

        <div className="hero-signal-row">
          <span className="signal-pill">Phone or email code</span>
          <span className="signal-pill">Contact confirmation</span>
          <span className="signal-pill">Trust before profile settings</span>
        </div>

        <div className="hero-grid hero-grid-epic hero-grid-verify">
          <article className="hero-card">
            <strong>Delivery method</strong>
            <p>Send the prototype verification code to the channel the user expects to use for trust checks.</p>
          </article>
          <article className="hero-card">
            <strong>Next step</strong>
            <p>Once the contact code is confirmed, the flow moves into profile visibility and commitment settings.</p>
          </article>
        </div>

        <div className="verify-note">
          <p className="note-title">Demo code</p>
          <p>{demoCode}</p>
        </div>

        <div className="trust-orbit" aria-hidden="true">
          <div className="trust-orbit-ring" />
          <div className="trust-node trust-node-primary">Code</div>
          <div className="trust-node trust-node-right">Signal</div>
          <div className="trust-node trust-node-bottom">Next</div>
        </div>
      </div>

      <div className="panel-pane">
        <div className="panel-shell verify-panel-shell">
          <div className="panel-head">
            <p className="panel-kicker">Verification</p>
            <h2>Confirm the account signal</h2>
            <p className="verify-support-copy">
              Choose the delivery method and enter the demo code to confirm the account contact signal.
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
        </div>
      </div>
    </section>
  );
}

export default VerificationPage;
