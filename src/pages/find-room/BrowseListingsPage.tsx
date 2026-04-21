import CommitmentBadge from "../../components/CommitmentBadge";
import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { petPolicyOptions } from "../../data/findRoom";
import { roomDetailById } from "../../data/roomDetails";
import {
  describeCommitmentLevel,
  describeHouseEnergy,
  describeResidentMix,
  formatMoveIn,
  formatPerPersonMonthly,
  getFlatmateProfile,
  getListingMeta,
  getOccupantCount
} from "../../lib/findRoom";
import { FiltersState, ScoredRoomMatch } from "../../types";

type BrowseListingsPageProps = {
  matches: ScoredRoomMatch[];
  filters: FiltersState;
  onBackToBranch: () => void;
  onChangeBudget: (value: number) => void;
  onChangeCommute: (value: number) => void;
  onChangePetFriendly: (value: FiltersState["petFriendly"]) => void;
  onOpenFilters: () => void;
  onOpenSuggestions: () => void;
  onOpenMatch: (matchId: string) => void;
};

function formatRoomBasics(roomSize: string, bathrooms: number) {
  return `${roomSize} | ${bathrooms} ${bathrooms === 1 ? "bathroom" : "bathrooms"}`;
}

function BrowseListingsPage({
  matches,
  filters,
  onBackToBranch,
  onChangeBudget,
  onChangeCommute,
  onChangePetFriendly,
  onOpenFilters,
  onOpenSuggestions,
  onOpenMatch
}: BrowseListingsPageProps) {
  const quickCommuteOptions = [20, 30, 45];
  const commitmentSummary = filters.commitmentLevels.length
    ? `Commitment: ${describeCommitmentLevel(filters.commitmentLevels[0])}${filters.commitmentLevels.length > 1 ? ` +${filters.commitmentLevels.length - 1} more` : ""}`
    : "";
  const activeFilterSummary = [
    filters.locationQuery ? `Area: ${filters.locationQuery}` : "",
    filters.houseTypes[0] ? `House type: ${filters.houseTypes[0]}` : "",
    filters.quietHouse ? "Quiet house" : "",
    filters.socialHouse ? "Social house" : "",
    filters.professionalsOnly ? "Professionals only" : "",
    commitmentSummary
  ].filter(Boolean);

  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to branch" onClick={onBackToBranch} />

      <div className="summary-hero">
        <p className="eyebrow">Browse</p>
        <h1>Browse available rooms in Bristol.</h1>
        <p className="lede">
          Scan the richer preview cards, keep the most important filters visible, and open any house for the full breakdown.
        </p>
      </div>

      <section className="summary-panel listing-filter-banner">
        <div className="listing-filter-header">
          <div>
            <p className="panel-kicker">Visible filters</p>
            <h2>Start with budget</h2>
            <p className="inline-note">
              Budget stays visible in the main listings flow, with commute and pet setup kept one tap away.
            </p>
          </div>
          <button type="button" className="secondary-button" onClick={onOpenFilters}>
            Open all filters
          </button>
        </div>

        <div className="listing-filter-grid">
          <label className="budget-spotlight">
            <span className="panel-kicker">Budget</span>
            <strong>{formatPerPersonMonthly(filters.maxRent)}</strong>
            <input
              type="range"
              min="700"
              max="1600"
              step="20"
              value={filters.maxRent}
              onChange={(event) => onChangeBudget(Number(event.target.value))}
            />
          </label>

          <div className="quick-filter-stack">
            <div className="filter-chip-section">
              <div className="filter-chip-copy">
                <p className="panel-kicker">Commute</p>
                <p className="inline-note">Keep the common travel limits visible.</p>
              </div>

              <div className="amenity-grid">
                {quickCommuteOptions.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    className={filters.maxCommute === minutes ? "tag-chip active-chip" : "tag-chip"}
                    onClick={() => onChangeCommute(minutes)}
                  >
                    Under {minutes} mins
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-chip-section">
              <div className="filter-chip-copy">
                <p className="panel-kicker">Pets</p>
                <p className="inline-note">Choose the house setup you want to see first.</p>
              </div>

              <div className="amenity-grid">
                {petPolicyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={filters.petFriendly === option.value ? "tag-chip active-chip" : "tag-chip"}
                    onClick={() => onChangePetFriendly(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {activeFilterSummary.length ? (
          <div className="tag-preview">
            {activeFilterSummary.map((item) => (
              <span key={item} className="tag-chip">
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Browse listings"
        description="Go back to the branch selection, adjust filters, or move into the ranked match list after scanning the richer preview cards."
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
          const listingMeta = getListingMeta(match.id);
          const flatmateProfile = getFlatmateProfile(match.id);
          const coverPhoto = detail.photos[0];
          const occupantCount = getOccupantCount(detail.currentOccupants);

          return (
            <button key={match.id} type="button" className="listing-card listing-card-button" onClick={() => onOpenMatch(match.id)}>
              <img className="listing-image" src={coverPhoto.src} alt={coverPhoto.alt} loading="lazy" />

              <div className="listing-top">
                <div>
                  <h3>{match.roomTitle}</h3>
                  <p className="listing-meta">{match.neighborhood} | {formatPerPersonMonthly(match.monthlyRent)}</p>
                </div>
                <div className="detail-badge-stack">
                  <CommitmentBadge level={flatmateProfile.commitmentLevel} />
                  <span className="tag-chip">{match.score}% fit</span>
                </div>
              </div>

              <p>{detail.summary}</p>

              <div className="listing-preview-meta">
                <div className="occupancy-row">
                  <div className="occupancy-icons" aria-hidden="true">
                    {Array.from({ length: Math.min(Math.max(occupantCount, 1), 3) }).map((_, index) => (
                      <span key={`${match.id}-occupant-${index}`} />
                    ))}
                  </div>
                  <span>{detail.currentOccupants}</span>
                </div>
                <span className="listing-subcopy">{formatRoomBasics(detail.roomSize, detail.bathrooms)}</span>
              </div>

              <p className="flatmate-summary">
                Flatmate vibe: {match.roommate.name} leads a {match.roommate.vibe.toLowerCase()} setup.
              </p>

              <div className="listing-facts">
                <span>Move-in {formatMoveIn(match.moveIn)}</span>
                <span>{match.leaseLength}</span>
                <span>{match.commuteMinutes} min commute</span>
                <span>{listingMeta.houseType}</span>
              </div>

              <div className="tag-preview">
                <span className="tag-chip">{describeHouseEnergy(listingMeta.houseEnergy)}</span>
                <span className="tag-chip">{describeResidentMix(listingMeta.residentMix)}</span>
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
