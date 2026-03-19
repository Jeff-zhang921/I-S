import { formatOwnerRent } from "../../lib/ownerRoom";
import { OwnerListingDraft, ScoredOwnerCandidate } from "../../types";

type OwnerCandidateDetailPageProps = {
  listing: OwnerListingDraft;
  candidate: ScoredOwnerCandidate | null;
  onBack: () => void;
  onSave: () => void;
  onLike: () => void;
  onOpenIntro: () => void;
};

function OwnerCandidateDetailPage({
  listing,
  candidate,
  onBack,
  onSave,
  onLike,
  onOpenIntro
}: OwnerCandidateDetailPageProps) {
  if (!candidate) {
    return (
      <section className="screen branch-screen">
        <div className="empty-panel">
          <h3>No renter selected.</h3>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">View profile</p>
        <h1>{candidate.name}</h1>
        <p className="lede">Profile detail for the owner branch, with fit reasons tied directly back to your room listing.</p>
      </div>

      <div className="summary-grid">
        <section className="summary-panel">
          <div className="owner-candidate-top owner-candidate-top-detail">
            <img className="candidate-avatar candidate-avatar-xl" src={candidate.profilePhoto} alt={candidate.name} loading="lazy" />
            <div className="owner-candidate-copy">
              <div className="panel-headline inline-headline">
                <div>
                  <p className="panel-kicker">Candidate profile</p>
                  <h2>{candidate.name}</h2>
                </div>
                <span className="match-score-pill">{candidate.score}% fit</span>
              </div>
              <p>{candidate.bio}</p>
            </div>
          </div>

          <div className="detail-list">
            <article className="detail-card">
              <strong>Budget</strong>
              <span>{candidate.budget}</span>
            </article>
            <article className="detail-card">
              <strong>Move-in</strong>
              <span>{candidate.moveInWindow}</span>
            </article>
            <article className="detail-card">
              <strong>Lease</strong>
              <span>{candidate.leasePreference}</span>
            </article>
            <article className="detail-card">
              <strong>Course / work</strong>
              <span>{candidate.major}</span>
            </article>
          </div>

          <div>
            <p className="panel-kicker">Why this match</p>
            <ul className="bullet-list">
              {candidate.whyMatch.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Your room</p>
              <h2>{listing.title}</h2>
            </div>
          </div>

          <img className="listing-image owner-listing-detail-image" src={listing.photoUrls[0]} alt={listing.title} loading="lazy" />
          <p>{listing.summary}</p>

          <div className="listing-facts">
            <span>{listing.neighborhood}</span>
            <span>{formatOwnerRent(listing.monthlyRent)}</span>
            <span>{listing.availableFrom}</span>
            <span>{listing.leaseLength}</span>
            <span>{listing.roomSize}</span>
          </div>

          <div className="tag-preview">
            {listing.amenities.map((amenity) => (
              <span key={amenity} className="tag-chip">
                {amenity}
              </span>
            ))}
          </div>

          <div>
            <p className="panel-kicker">Quick questions to ask</p>
            <div className="tag-preview">
              {candidate.quickQuestions.map((question) => (
                <span key={question} className="tag-chip">
                  {question}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="button-row detail-action-footer">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
        <div className="button-row compact-actions detail-action-group">
          <button type="button" className="secondary-button" onClick={onSave}>
            Save
          </button>
          <button type="button" className="secondary-button" onClick={onLike}>
            Like
          </button>
          <button type="button" className="primary-button" onClick={onOpenIntro}>
            Send intro
          </button>
        </div>
      </div>
    </section>
  );
}

export default OwnerCandidateDetailPage;
