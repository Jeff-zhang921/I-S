import { roomDetailById } from "../../data/roomDetails";
import { formatMoveIn, formatPrice } from "../../lib/findRoom";
import { ScoredRoomMatch } from "../../types";
import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";

type BrowseListingsPageProps = {
  matches: ScoredRoomMatch[];
  onBackToBranch: () => void;
  onOpenFilters: () => void;
  onOpenSuggestions: () => void;
  onOpenMatch: (matchId: string) => void;
};

function BrowseListingsPage({
  matches,
  onBackToBranch,
  onOpenFilters,
  onOpenSuggestions,
  onOpenMatch
}: BrowseListingsPageProps) {
  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to branch" onClick={onBackToBranch} />

      <div className="summary-hero">
        <p className="eyebrow">Browse</p>
        <h1>Browse available rooms in Bristol.</h1>
        <p className="lede">
          Tap any house card to open the full detail page with pictures, house rules, and fake listing data.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Browse listings"
        description="Go back to the branch selection, adjust filters, or move into the ranked match list."
        showBackButton={false}
        actions={[
          { label: "Adjust filters", onClick: onOpenFilters },
          { label: "Continue to suggestions", onClick: onOpenSuggestions, tone: "primary" }
        ]}
      />

      <p className="inline-note screen-flow-note">{matches.length} room options are loaded for this prototype.</p>

      <div className="listing-grid">
        {matches.map((match) => {
          const detail = roomDetailById[match.id];
          const coverPhoto = detail.photos[0];

          return (
            <button key={match.id} type="button" className="listing-card listing-card-button" onClick={() => onOpenMatch(match.id)}>
              <img className="listing-image" src={coverPhoto.src} alt={coverPhoto.alt} loading="lazy" />

              <div className="listing-top">
                <div>
                  <h3>{match.roomTitle}</h3>
                  <p className="listing-meta">{match.neighborhood} • {formatPrice(match.monthlyRent)} / month</p>
                </div>
                <span className="tag-chip">{match.score}% fit</span>
              </div>

              <p>{detail.summary}</p>
              <p className="listing-subcopy">{match.roommate.vibe}</p>

              <div className="listing-facts">
                <span>Move-in {formatMoveIn(match.moveIn)}</span>
                <span>{match.leaseLength}</span>
                <span>{match.commuteMinutes} min commute</span>
                <span>{detail.bedrooms} bed / {detail.bathrooms} bath</span>
              </div>

              <div className="tag-preview">
                {match.amenities.slice(0, 4).map((amenity) => (
                  <span key={amenity} className="tag-chip">
                    {amenity}
                  </span>
                ))}
              </div>

              <span className="card-link-note">Tap to open house details</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default BrowseListingsPage;
