import CommitmentBadge from "../../components/CommitmentBadge";
import MatchInsights from "../../components/MatchInsights";
import PhotoCarousel from "../../components/PhotoCarousel";
import RichFlatmateProfile from "../../components/RichFlatmateProfile";
import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { roomDetailById } from "../../data/roomDetails";
import {
  describeHouseEnergy,
  describeResidentMix,
  formatMoveIn,
  formatPerPersonMonthly,
  formatPrice,
  getFlatmateProfile,
  getListingMeta,
  getOccupantCount
} from "../../lib/findRoom";
import { FiltersState, MatchTarget, ProfileNotesState, ScoredRoomMatch } from "../../types";

type MatchDetailPageProps = {
  match: ScoredRoomMatch | null;
  filters: FiltersState;
  userScores: MatchTarget;
  profileNotes: ProfileNotesState;
  backLabel: string;
  onBack: () => void;
  onSave: () => void;
  onLike: () => void;
  canOpenChat: boolean;
  onOpenIntro: () => void;
  onOpenChat: () => void;
  onOpenSaved: () => void;
};

function MatchDetailPage({
  match,
  filters,
  userScores,
  profileNotes,
  backLabel,
  onBack,
  onSave,
  onLike,
  canOpenChat,
  onOpenIntro,
  onOpenChat,
  onOpenSaved
}: MatchDetailPageProps) {
  if (!match) {
    return (
      <section className="screen branch-screen">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="empty-panel">
          <h3>No match selected.</h3>
        </div>
      </section>
    );
  }

  const detail = roomDetailById[match.id];
  const flatmateProfile = getFlatmateProfile(match.id);
  const listingMeta = getListingMeta(match.id);
  const occupantCount = getOccupantCount(detail.currentOccupants);
  const contactLabel = canOpenChat ? "Message tenants" : "I'm interested";
  const handleContactAction = canOpenChat ? onOpenChat : onOpenIntro;

  return (
    <section className="screen branch-screen">
      <TopBackButton label={backLabel} onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">House details</p>
        <h1>{match.roomTitle}</h1>
        <p className="lede">Review the house, the current tenants, and the pricing breakdown before you decide whether to reach out.</p>
        <div className="summary-tags">
          <span>{formatPerPersonMonthly(match.monthlyRent)}</span>
          <span>{detail.currentOccupants}</span>
          <span>{listingMeta.houseType}</span>
          <CommitmentBadge level={flatmateProfile.commitmentLevel} showDetail />
        </div>
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Room detail"
        description="Review the listing, then either shortlist it, mark stronger interest, or message the tenants directly."
        showBackButton={false}
        actions={[
          { label: "Interested houses", onClick: onOpenSaved },
          { label: contactLabel, onClick: handleContactAction, tone: "primary" }
        ]}
      />

      <PhotoCarousel photos={detail.photos} title={match.roomTitle} />

      <section className="summary-panel">
        <div className="panel-headline">
          <div>
            <p className="panel-kicker">Current tenants</p>
            <h2>{detail.currentOccupants}</h2>
          </div>
          <span className="match-score-pill">{match.score}% fit</span>
        </div>

        <div className="detail-tenant-layout">
          <RichFlatmateProfile match={match} />

          <div className="detail-inline-stack">
            <div className="occupancy-row">
              <div className="occupancy-icons" aria-hidden="true">
                {Array.from({ length: Math.min(Math.max(occupantCount, 1), 3) }).map((_, index) => (
                  <span key={`${match.id}-detail-occupant-${index}`} />
                ))}
              </div>
              <span>{detail.currentOccupants} already living here</span>
            </div>

            <div className="detail-text-block">
              <p className="panel-kicker">Why this match</p>
              <ul className="bullet-list">
                {match.whyMatch.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>

            <div className="detail-text-block">
              <p className="panel-kicker">House vibe</p>
              <ul className="bullet-list">
                <li>{describeHouseEnergy(listingMeta.houseEnergy)}</li>
                <li>{describeResidentMix(listingMeta.residentMix)}</li>
                <li>{listingMeta.houseType}</li>
                <li>{detail.houseHighlights[0]}</li>
              </ul>
            </div>

            <MatchInsights match={match} filters={filters} userScores={userScores} profileNotes={profileNotes} />
          </div>
        </div>
      </section>

      <section className="summary-panel">
        <div className="panel-headline">
          <div>
            <p className="panel-kicker">Bills & pricing</p>
            <h2>{formatPerPersonMonthly(match.monthlyRent)}</h2>
          </div>
        </div>

        <div className="detail-stats-grid">
          <article className="detail-card"><strong>Neighborhood</strong><span>{match.neighborhood}</span></article>
          <article className="detail-card"><strong>Move-in</strong><span>{formatMoveIn(match.moveIn)}</span></article>
          <article className="detail-card"><strong>Lease</strong><span>{match.leaseLength}</span></article>
          <article className="detail-card"><strong>Commute</strong><span>{match.commuteMinutes} minutes</span></article>
          <article className="detail-card"><strong>Deposit</strong><span>{formatPrice(detail.deposit)}</span></article>
          <article className="detail-card"><strong>Bills</strong><span>{detail.bills}</span></article>
          <article className="detail-card"><strong>Room size</strong><span>{detail.roomSize}</span></article>
          <article className="detail-card"><strong>House type</strong><span>{listingMeta.houseType}</span></article>
          <article className="detail-card"><strong>Availability</strong><span>{detail.availableFromNote}</span></article>
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
            <p className="panel-kicker">House rules</p>
            <h2>Expectations before move-in</h2>
          </div>
        </div>

        <ul className="bullet-list single-column-list">
          {detail.houseRules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="summary-panel">
        <div className="panel-headline">
          <div>
            <p className="panel-kicker">Extended details</p>
            <h2>Everything else worth knowing</h2>
          </div>
        </div>

        <div className="detail-section-grid">
          <div className="detail-text-block">
            <p className="panel-kicker">Room description</p>
            <p>{detail.roomDescription}</p>
          </div>

          <div className="detail-text-block">
            <p className="panel-kicker">Neighborhood notes</p>
            <ul className="bullet-list">
              {detail.neighborhoodNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-text-block">
            <p className="panel-kicker">Ideal for</p>
            <div className="tag-preview">
              {detail.idealFor.map((item) => (
                <span key={item} className="tag-chip">{item}</span>
              ))}
            </div>
          </div>

          <div className="detail-note-panel">
            <p className="panel-kicker">Owner note</p>
            <p>{detail.ownerNote}</p>
          </div>
        </div>
      </section>

      <div className="button-row detail-action-footer">
        <div className="button-row compact-actions detail-action-group">
          <button type="button" className="secondary-button" onClick={onSave}>Save</button>
          <button type="button" className="secondary-button" onClick={onLike}>Like</button>
          <button type="button" className="primary-button" onClick={handleContactAction}>{contactLabel}</button>
        </div>
      </div>
    </section>
  );
}

export default MatchDetailPage;
