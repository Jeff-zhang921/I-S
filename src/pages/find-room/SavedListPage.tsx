import { roomDetailById } from "../../data/roomDetails";
import { formatMoveIn, formatPrice } from "../../lib/findRoom";
import { ScoredRoomMatch } from "../../types";
import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";

type SavedListPageProps = {
  savedMatches: ScoredRoomMatch[];
  likedIds: string[];
  contactedIds: string[];
  onBack: () => void;
  onOpenMatch: (matchId: string) => void;
  onOpenChat: (matchId: string) => void;
  onOpenChatsHome: () => void;
};

function SavedListPage({
  savedMatches,
  likedIds,
  contactedIds,
  onBack,
  onOpenMatch,
  onOpenChat,
  onOpenChatsHome
}: SavedListPageProps) {
  const contactedCount = contactedIds.length;

  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to suggestions" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Interested houses</p>
        <h1>Saved, liked, and contacted houses.</h1>
        <p className="lede">
          Save keeps a house here. Like marks stronger interest. Sending an intro unlocks the house group chat.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Interested houses"
        description="Go back to matching, reopen a saved room, or jump into the chats that already have an intro."
        showBackButton={false}
        actions={[
          { label: "Open chats", onClick: onOpenChatsHome, tone: "primary", disabled: contactedCount === 0 }
        ]}
      />

      {savedMatches.length ? (
        <div className="listing-grid">
          {savedMatches.map((match) => {
            const detail = roomDetailById[match.id];
            const coverPhoto = detail.photos[0];
            const isLiked = likedIds.includes(match.id);
            const isContacted = contactedIds.includes(match.id);

            return (
              <article
                key={match.id}
                className="listing-card listing-card-interactive"
                onClick={() => onOpenMatch(match.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenMatch(match.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <img className="listing-image" src={coverPhoto.src} alt={coverPhoto.alt} loading="lazy" />

                <div className="listing-top">
                  <div>
                    <h3>{match.roomTitle}</h3>
                    <p className="listing-meta">{match.neighborhood} • {formatPrice(match.monthlyRent)} / month</p>
                  </div>
                  <span className="tag-chip">{isContacted ? "Intro sent" : isLiked ? "Liked" : "Saved"}</span>
                </div>

                <p>{detail.summary}</p>
                <p className="listing-subcopy">{match.roommate.name} • {match.roommate.vibe}</p>

                <div className="listing-facts">
                  <span>Move-in {formatMoveIn(match.moveIn)}</span>
                  <span>{match.leaseLength}</span>
                  <span>{match.score}% fit</span>
                  <span>{detail.currentOccupants}</span>
                </div>

                <div className="button-row compact-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenMatch(match.id);
                    }}
                  >
                    Open details
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={!isContacted}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenChat(match.id);
                    }}
                  >
                    {isContacted ? "Group chat" : "Send intro to unlock chat"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-panel">
          <h3>No interested houses yet.</h3>
          <p>Save a room from the feed and it will appear here.</p>
        </div>
      )}
    </section>
  );
}

export default SavedListPage;
