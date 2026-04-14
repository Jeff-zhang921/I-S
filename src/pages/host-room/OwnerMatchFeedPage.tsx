import { formatOwnerRent } from "../../lib/ownerRoom";
import { OwnerListingDraft, ScoredOwnerCandidate } from "../../types";
import TopBackButton from "../../components/TopBackButton";

type OwnerMatchFeedPageProps = {
  listing: OwnerListingDraft;
  currentCandidate: ScoredOwnerCandidate | null;
  currentIndex: number;
  total: number;
  onBack: () => void;
  onInspect: () => void;
  onOpenSaved: () => void;
  onPass: () => void;
  onSave: () => void;
  onLike: () => void;
};

function OwnerMatchFeedPage({
  listing,
  currentCandidate,
  currentIndex,
  total,
  onBack,
  onInspect,
  onOpenSaved,
  onPass,
  onSave,
  onLike
}: OwnerMatchFeedPageProps) {
  if (!currentCandidate) {
    return (
      <section className="screen branch-screen feed-screen">
        <TopBackButton label="Back to suggestions" onClick={onBack} />

        <div className="empty-panel">
          <h3>No more renter matches in this feed.</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen feed-screen">
      <TopBackButton label="Back to suggestions" onClick={onBack} />

      <div className="summary-hero feed-hero">
        <p className="eyebrow">Owner feed</p>
        <h1>Review renter compatibility one profile at a time.</h1>
        <p className="lede">Pass, save, or like each renter here. Open the detail screen when you want to send an intro.</p>
      </div>

      <div className="feed-shell">
        <aside className="feed-sidebar summary-panel">
          <h2>
            {currentIndex + 1}/{total}
          </h2>
          <div className="button-column">
            <button type="button" className="secondary-button" onClick={onOpenSaved}>
              Open shortlist
            </button>
          </div>
        </aside>

        <article className="feed-card feed-card-docked">
          <div className="feed-card-scroll">
            <div className="owner-candidate-top">
              <img
                className="candidate-avatar candidate-avatar-large"
                src={currentCandidate.profilePhoto}
                alt={currentCandidate.name}
                loading="lazy"
              />
              <div className="owner-candidate-copy">
                <div className="listing-top">
                  <div>
                    <h2>{currentCandidate.name}</h2>
                    <p className="listing-meta">
                      {currentCandidate.age} | {currentCandidate.major}
                    </p>
                  </div>
                  <div className="match-score-pill">{currentCandidate.score}% fit</div>
                </div>
                <p>{currentCandidate.vibe}</p>
                <p className="listing-subcopy">{currentCandidate.bio}</p>
              </div>
            </div>

            <div className="listing-facts">
              <span>{currentCandidate.budget}</span>
              <span>{currentCandidate.moveInWindow}</span>
              <span>{currentCandidate.leasePreference}</span>
            </div>

            <div className="tag-preview">
              {currentCandidate.highlights.map((highlight) => (
                <span key={highlight} className="tag-chip">
                  {highlight}
                </span>
              ))}
            </div>

            <section className="owner-inline-panel">
              <p className="panel-kicker">Fit to your room</p>
              <h3>{listing.title}</h3>
              <p className="listing-meta">
                {listing.neighborhood} | {formatOwnerRent(listing.monthlyRent)} / month
              </p>
              <ul className="bullet-list">
                {currentCandidate.whyMatch.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>

            <div className="button-row compact-actions">
              <button type="button" className="secondary-button" onClick={onInspect}>
                Why this match?
              </button>
            </div>
          </div>

          <div className="feed-actions feed-actions-docked">
            <button type="button" className="feed-action pass-action" onClick={onPass}>
              Pass
            </button>
            <button type="button" className="feed-action save-action" onClick={onSave}>
              Save
            </button>
            <button type="button" className="feed-action like-action" onClick={onLike}>
              Like
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default OwnerMatchFeedPage;
