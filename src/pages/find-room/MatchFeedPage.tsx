import { formatMoveIn, formatPrice } from "../../lib/findRoom";
import { ScoredRoomMatch } from "../../types";

type MatchFeedPageProps = {
  currentMatch: ScoredRoomMatch | null;
  currentIndex: number;
  total: number;
  onBack: () => void;
  onInspect: () => void;
  onOpenSaved: () => void;
  onPass: () => void;
  onSave: () => void;
  onLike: () => void;
};

function MatchFeedPage({
  currentMatch,
  currentIndex,
  total,
  onBack,
  onInspect,
  onOpenSaved,
  onPass,
  onSave,
  onLike
}: MatchFeedPageProps) {
  if (!currentMatch) {
    return (
      <section className="screen branch-screen">
        <div className="empty-panel">
          <h3>No results in the feed.</h3>
          <p>Go back to filters and broaden the search.</p>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back to suggestions
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Page 9 of 10</p>
        <h1>Match feed for the renter journey.</h1>
        <p className="lede">
          This is the action step from the FigJam flow. Pass, save, or like the current room + roommate pair.
        </p>
      </div>

      <div className="feed-shell">
        <aside className="feed-sidebar summary-panel">
          <h2>{currentIndex + 1}/{total}</h2>
          <div className="button-column">
            <button type="button" className="secondary-button" onClick={onOpenSaved}>
              Open saved list
            </button>
            <button type="button" className="secondary-button" onClick={onBack}>
              Back to suggestions
            </button>
          </div>
        </aside>

        <article className="feed-card">
          <div className="listing-top">
            <div>
              <h2>{currentMatch.roomTitle}</h2>
              <p className="listing-meta">{currentMatch.neighborhood} • {formatPrice(currentMatch.monthlyRent)} / month</p>
            </div>
            <div className="match-score-pill">{currentMatch.score}% fit</div>
          </div>

          <p>{currentMatch.roommate.name}, {currentMatch.roommate.age} • {currentMatch.roommate.major}</p>
          <p>{currentMatch.roommate.vibe}</p>

          <div className="listing-facts">
            <span>Move-in {formatMoveIn(currentMatch.moveIn)}</span>
            <span>{currentMatch.leaseLength}</span>
            <span>{currentMatch.commuteMinutes} min commute</span>
            <span>{currentMatch.petFriendly ? "Pet-friendly" : "No pets"}</span>
          </div>

          <div className="tag-preview">
            {currentMatch.amenities.map((amenity) => (
              <span key={amenity} className="tag-chip">{amenity}</span>
            ))}
          </div>

          <div className="button-row compact-actions">
            <button type="button" className="secondary-button" onClick={onInspect}>
              Why this match?
            </button>
          </div>

          <div className="feed-actions">
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

export default MatchFeedPage;
