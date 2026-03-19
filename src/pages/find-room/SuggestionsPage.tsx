import { roomDetailById } from "../../data/roomDetails";
import { formatMoveIn, formatPrice } from "../../lib/findRoom";
import { ScoredRoomMatch } from "../../types";

type SuggestionsPageProps = {
  matches: ScoredRoomMatch[];
  onBack: () => void;
  onOpenFeed: () => void;
  onInspect: (matchId: string) => void;
};

function SuggestionsPage({ matches, onBack, onOpenFeed, onInspect }: SuggestionsPageProps) {
  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Suggestions</p>
        <h1>Suggested rooms and roommates.</h1>
        <p className="lede">
          Each card now opens straight into the listing detail page with pictures and fuller house information.
        </p>
      </div>

      {matches.length ? (
        <div className="suggestion-stack">
          {matches.map((match) => {
            const detail = roomDetailById[match.id];
            const coverPhoto = detail.photos[0];

            return (
              <button key={match.id} type="button" className="suggestion-card listing-card-button" onClick={() => onInspect(match.id)}>
                <img className="listing-image" src={coverPhoto.src} alt={coverPhoto.alt} />

                <div className="listing-top">
                  <div>
                    <h3>{match.roomTitle}</h3>
                    <p className="listing-meta">{match.neighborhood} • {formatPrice(match.monthlyRent)} / month</p>
                  </div>
                  <div className="match-score-pill">{match.score}% fit</div>
                </div>

                <p>{detail.summary}</p>

                <div className="suggestion-grid">
                  <div>
                    <p className="panel-kicker">Roommate</p>
                    <h4>{match.roommate.name}</h4>
                    <p>{match.roommate.bio}</p>
                  </div>
                  <div>
                    <p className="panel-kicker">Why this match</p>
                    <ul className="bullet-list">
                      {match.whyMatch.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="listing-facts">
                  <span>Move-in {formatMoveIn(match.moveIn)}</span>
                  <span>{match.leaseLength}</span>
                  <span>{match.commuteMinutes} min commute</span>
                  <span>{detail.roomSize}</span>
                </div>

                <div className="button-row">
                  <div className="tag-preview">
                    {match.amenities.slice(0, 4).map((amenity) => (
                      <span key={amenity} className="tag-chip">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <span className="card-link-note">Open details</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="empty-panel">
          <h3>No suggestions fit the current filters.</h3>
          <p>Relax the rent, commute, or amenity requirements and try again.</p>
        </div>
      )}

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back to filters
        </button>
        <button type="button" className="primary-button" onClick={onOpenFeed} disabled={!matches.length}>
          Open match feed
        </button>
      </div>
    </section>
  );
}

export default SuggestionsPage;
