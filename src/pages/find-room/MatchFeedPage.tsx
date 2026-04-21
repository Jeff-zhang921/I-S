import MatchInsights from "../../components/MatchInsights";
import TopBackButton from "../../components/TopBackButton";
import { roomDetailById } from "../../data/roomDetails";
import {
  formatMoveIn,
  formatPerPersonMonthly,
  getFlatmateProfile,
  getLifeStageFieldLabel,
  getOccupantCount
} from "../../lib/findRoom";
import { FiltersState, MatchTarget, ProfileNotesState, ScoredRoomMatch } from "../../types";

type MatchFeedPageProps = {
  currentMatch: ScoredRoomMatch | null;
  filters: FiltersState;
  userScores: MatchTarget;
  profileNotes: ProfileNotesState;
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
  filters,
  userScores,
  profileNotes,
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
      <section className="screen branch-screen feed-screen">
        <TopBackButton label="Back to suggestions" onClick={onBack} />

        <div className="empty-panel">
          <h3>No results in the feed.</h3>
          <p>Go back to filters and broaden the search.</p>
        </div>
      </section>
    );
  }

  const detail = roomDetailById[currentMatch.id];
  const flatmateProfile = getFlatmateProfile(currentMatch.id);
  const occupantCount = getOccupantCount(detail.currentOccupants);

  return (
    <section className="screen branch-screen feed-screen">
      <TopBackButton label="Back to suggestions" onClick={onBack} />

      <div className="summary-hero feed-hero">
        <p className="eyebrow">Page 9 of 10</p>
        <h1>Match feed for the renter journey.</h1>
        <p className="lede">
          Pass, save, or like the current room + roommate pair. Open details when you want to tell the tenants you are interested.
        </p>
      </div>

      <div className="feed-shell">
        <aside className="feed-sidebar summary-panel">
          <h2>{currentIndex + 1}/{total}</h2>
          <div className="button-column">
            <button type="button" className="secondary-button" onClick={onOpenSaved}>
              Open saved list
            </button>
          </div>
        </aside>

        <article className="feed-card feed-card-docked">
          <div className="feed-card-scroll">
            <div className="listing-top">
              <div>
                <h2>{currentMatch.roomTitle}</h2>
                <p className="listing-meta">{currentMatch.neighborhood} | {formatPerPersonMonthly(currentMatch.monthlyRent)}</p>
              </div>
              <div className="match-score-pill">{currentMatch.score}% fit</div>
            </div>

            <div className="listing-preview-meta">
              <div className="occupancy-row">
                <div className="occupancy-icons" aria-hidden="true">
                  {Array.from({ length: Math.min(Math.max(occupantCount, 1), 3) }).map((_, index) => (
                    <span key={`${currentMatch.id}-feed-occupant-${index}`} />
                  ))}
                </div>
                <span>{detail.currentOccupants}</span>
              </div>
              <span className="listing-subcopy">{detail.roomSize} | {detail.bathrooms} bathrooms</span>
            </div>

            <p>
              {currentMatch.roommate.name}, {currentMatch.roommate.age} | {getLifeStageFieldLabel(flatmateProfile.lifeStage)}: {flatmateProfile.courseOrJob}
            </p>
            <p className="flatmate-summary">Flatmate vibe: {currentMatch.roommate.vibe}</p>

            <MatchInsights
              match={currentMatch}
              filters={filters}
              userScores={userScores}
              profileNotes={profileNotes}
              variant="compact"
            />

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

export default MatchFeedPage;
