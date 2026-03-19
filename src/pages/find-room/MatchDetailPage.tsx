import { roomDetailById } from "../../data/roomDetails";
import { formatMoveIn, formatPrice } from "../../lib/findRoom";
import { ScoredRoomMatch } from "../../types";

type MatchDetailPageProps = {
  match: ScoredRoomMatch | null;
  onBack: () => void;
  onSave: () => void;
  onLike: () => void;
  canOpenChat: boolean;
  onOpenIntro: () => void;
  onOpenChat: () => void;
};

function MatchDetailPage({ match, onBack, onSave, onLike, canOpenChat, onOpenIntro, onOpenChat }: MatchDetailPageProps) {
  if (!match) {
    return (
      <section className="screen branch-screen">
        <div className="empty-panel">
          <h3>No match selected.</h3>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
        </div>
      </section>
    );
  }

  const detail = roomDetailById[match.id];
  const [heroPhoto, ...galleryPhotos] = detail.photos;

  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">House details</p>
        <h1>{match.roomTitle}</h1>
        <p className="lede">Full fake listing detail with pictures, house information, roommate context, and owner notes.</p>
      </div>

      <section className="summary-panel detail-hero-panel">
        <img className="detail-hero-image" src={heroPhoto.src} alt={heroPhoto.alt} loading="lazy" />
        <div className="detail-gallery">
          {galleryPhotos.map((photo) => (
            <img key={photo.alt} className="detail-gallery-image" src={photo.src} alt={photo.alt} loading="lazy" />
          ))}
        </div>
      </section>

      <div className="summary-grid">
        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Listing overview</p>
              <h2>{formatPrice(match.monthlyRent)} / month</h2>
            </div>
            <span className="match-score-pill">{match.score}% fit</span>
          </div>

          <p>{detail.summary}</p>
          <p className="listing-subcopy">{detail.roomDescription}</p>

          <div className="detail-stats-grid">
            <article className="detail-card"><strong>Neighborhood</strong><span>{match.neighborhood}</span></article>
            <article className="detail-card"><strong>Move-in</strong><span>{formatMoveIn(match.moveIn)}</span></article>
            <article className="detail-card"><strong>Lease</strong><span>{match.leaseLength}</span></article>
            <article className="detail-card"><strong>Commute</strong><span>{match.commuteMinutes} minutes</span></article>
            <article className="detail-card"><strong>Bedrooms</strong><span>{detail.bedrooms}</span></article>
            <article className="detail-card"><strong>Bathrooms</strong><span>{detail.bathrooms}</span></article>
            <article className="detail-card"><strong>Deposit</strong><span>{formatPrice(detail.deposit)}</span></article>
            <article className="detail-card"><strong>Room size</strong><span>{detail.roomSize}</span></article>
            <article className="detail-card detail-card-wide"><strong>Bills</strong><span>{detail.bills}</span></article>
            <article className="detail-card detail-card-wide"><strong>Availability</strong><span>{detail.availableFromNote}</span></article>
          </div>

          <div className="panel-headline inline-headline">
            <div>
              <p className="panel-kicker">Amenities</p>
            </div>
          </div>
          <div className="tag-preview">
            {match.amenities.map((amenity) => (
              <span key={amenity} className="tag-chip">{amenity}</span>
            ))}
          </div>
        </section>

        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">House fit</p>
              <h2>{match.roommate.name}</h2>
            </div>
          </div>

          <p>{match.roommate.bio}</p>
          <p className="listing-meta">{match.roommate.age} years old • {match.roommate.major}</p>
          <p className="listing-subcopy">{detail.currentOccupants}</p>

          <div className="detail-section-grid">
            <div className="detail-text-block">
              <p className="panel-kicker">Why this match</p>
              <ul className="bullet-list">
                {match.whyMatch.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>

            <div className="detail-text-block">
              <p className="panel-kicker">House highlights</p>
              <ul className="bullet-list">
                {detail.houseHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-text-block">
              <p className="panel-kicker">House rules</p>
              <ul className="bullet-list">
                {detail.houseRules.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-text-block">
              <p className="panel-kicker">Neighborhood notes</p>
              <ul className="bullet-list">
                {detail.neighborhoodNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="detail-note-panel">
            <p className="panel-kicker">Owner note</p>
            <p>{detail.ownerNote}</p>
          </div>

          <div className="tag-preview">
            {detail.idealFor.map((item) => (
              <span key={item} className="tag-chip">{item}</span>
            ))}
          </div>
        </section>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>Back</button>
        <div className="button-row compact-actions">
          <button type="button" className="secondary-button" onClick={onSave}>Save</button>
          <button type="button" className="secondary-button" disabled={!canOpenChat} onClick={onOpenChat}>
            {canOpenChat ? "Open group chat" : "Like to unlock chat"}
          </button>
          <button type="button" className="secondary-button" onClick={onLike}>Like</button>
          <button type="button" className="primary-button" onClick={onOpenIntro}>Send intro</button>
        </div>
      </div>
    </section>
  );
}

export default MatchDetailPage;
