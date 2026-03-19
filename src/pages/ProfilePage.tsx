import { describeCategoryScore, parseProfileList } from "../lib/onboarding";
import { CategoryMeta, PrivacyLevelOption, ProfileNotesState } from "../types";

type SummaryCard = CategoryMeta & {
  score: number;
};

type ProfilePageProps = {
  account: {
    fullName: string;
    email: string;
    phone: string;
    verificationMethod: string;
    idCheckChoice: string;
  };
  privacyLevelMeta: PrivacyLevelOption;
  answeredCount: number;
  summaryCards: SummaryCard[];
  profileNotes: ProfileNotesState;
  savedCount: number;
  contactedCount: number;
};

function ProfilePage({
  account,
  privacyLevelMeta,
  answeredCount,
  summaryCards,
  profileNotes,
  savedCount,
  contactedCount
}: ProfilePageProps) {
  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Profile</p>
        <h1>Your renter profile.</h1>
        <p className="lede">
          This follows the `view profile` step in the FigJam flow and keeps the matching signals visible
          after onboarding.
        </p>

        <div className="summary-tags">
          <span>Need a room</span>
          <span>{answeredCount} answers</span>
          <span>{privacyLevelMeta.title} privacy</span>
          <span>{savedCount} interested houses</span>
          <span>{contactedCount} intros sent</span>
        </div>
      </div>

      <div className="summary-grid">
        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Account</p>
              <h2>{account.fullName}</h2>
            </div>
          </div>

          <div className="detail-list">
            <article className="detail-card">
              <strong>Email</strong>
              <span>{account.email}</span>
            </article>
            <article className="detail-card">
              <strong>Phone</strong>
              <span>{account.phone}</span>
            </article>
            <article className="detail-card">
              <strong>Verification</strong>
              <span>{account.verificationMethod} verified</span>
            </article>
            <article className="detail-card">
              <strong>ID check</strong>
              <span>{account.idCheckChoice === "include" ? "Included" : "Skipped"}</span>
            </article>
            <article className="detail-card detail-card-wide">
              <strong>Privacy setup</strong>
              <span>{privacyLevelMeta.title} with {privacyLevelMeta.questionCount} privacy questions</span>
            </article>
          </div>
        </section>

        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Signals</p>
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
              <p className="panel-kicker">Must-haves</p>
              <h2>What this renter is looking for</h2>
            </div>
          </div>

          <div className="tag-preview">
            {parseProfileList(profileNotes.mustHaves).map((item) => (
              <span key={item} className="tag-chip">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Dealbreakers</p>
              <h2>What should filter out fast</h2>
            </div>
          </div>

          <div className="tag-preview">
            {parseProfileList(profileNotes.dealbreakers).map((item) => (
              <span key={item} className="tag-chip">
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default ProfilePage;
