import CommitmentBadge from "../components/CommitmentBadge";
import TopBackButton from "../components/TopBackButton";
import StatusBanner from "../components/StatusBanner";
import { describeCommitmentLevel } from "../lib/findRoom";
import { describeCategoryScore } from "../lib/onboarding";
import { AccountState, CategoryMeta, PrivacyLevelOption, ProfileNotesState, StatusState } from "../types";

type SummaryCard = CategoryMeta & {
  score: number;
};

type SummaryPageProps = {
  account: Pick<
    AccountState,
    "fullName" | "email" | "phone" | "targetCity" | "commitmentLevel" | "verificationMethod"
  >;
  privacyLevelMeta: PrivacyLevelOption;
  answeredCount: number;
  summaryCards: SummaryCard[];
  profileNotes: ProfileNotesState;
  status: StatusState;
  onBack: () => void;
  onContinue: () => void;
};

function SummaryPage({
  account,
  privacyLevelMeta,
  answeredCount,
  summaryCards,
  profileNotes,
  status,
  onBack,
  onContinue
}: SummaryPageProps) {
  return (
    <section className="screen summary-screen">
      <div className="summary-hero">
        <TopBackButton label="Back to questions" onClick={onBack} />

        <p className="eyebrow">Page 7 of 12</p>
        <h1>{account.fullName}'s renter profile is ready.</h1>
        <p className="lede">
          The onboarding is complete. Next, choose whether you want to look for a room or publish a listing.
        </p>

        <div className="summary-tags">
          <span>{answeredCount} answers</span>
          <span>{account.verificationMethod} verified</span>
          <span>{account.targetCity || "City not set"}</span>
          <span>{privacyLevelMeta.summaryLabel}</span>
          <span>{describeCommitmentLevel(account.commitmentLevel)}</span>
        </div>

        <StatusBanner status={status} />
      </div>

      <div className="summary-grid">
        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Profile signals</p>
              <h2>Compatibility profile</h2>
            </div>
          </div>

          <div className="signal-grid">
            {summaryCards.map((category) => (
              <article key={category.id} className={`signal-card tone-${category.accent}`}>
                <div className="signal-top">
                  <strong>{category.title}</strong>
                  <span>{category.score.toFixed(1)}/5</span>
                </div>
                <p>{describeCategoryScore(category.score)}</p>
                <div className="mini-track" aria-hidden="true">
                  <span style={{ width: `${(category.score / 5) * 100}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Profile payload</p>
              <h2>What gets carried into matching</h2>
            </div>
          </div>

          <div className="detail-list">
            <article className="detail-card">
              <strong>Name</strong>
              <span>{account.fullName}</span>
            </article>
            <article className="detail-card">
              <strong>Email</strong>
              <span>{account.email}</span>
            </article>
            <article className="detail-card">
              <strong>Phone</strong>
              <span>{account.phone}</span>
            </article>
            <article className="detail-card">
              <strong>Target city</strong>
              <span>{account.targetCity || "Not set"}</span>
            </article>
            <article className="detail-card">
              <strong>Profile visibility</strong>
              <span>{privacyLevelMeta.title} with {privacyLevelMeta.questionCount} privacy questions</span>
            </article>
            <article className="detail-card">
              <strong>Commitment level</strong>
              <CommitmentBadge level={account.commitmentLevel} showDetail />
            </article>
            <article className="detail-card detail-card-wide">
              <strong>Must-haves</strong>
              <div className="tag-preview">
                {profileNotes.mustHaves
                  .split(/[\n,]+/)
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item) => (
                    <span key={item} className="tag-chip">
                      {item}
                    </span>
                  ))}
              </div>
            </article>
            <article className="detail-card detail-card-wide">
              <strong>Dealbreakers</strong>
              <div className="tag-preview">
                {profileNotes.dealbreakers
                  .split(/[\n,]+/)
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item) => (
                    <span key={item} className="tag-chip">
                      {item}
                    </span>
                  ))}
              </div>
            </article>
          </div>
        </section>
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onContinue}>
         proceed
        </button>
      </div>
    </section>
  );
}

export default SummaryPage;
