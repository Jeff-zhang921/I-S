import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { ScoredOwnerCandidate } from "../../types";

type OwnerSavedListPageProps = {
  candidates: ScoredOwnerCandidate[];
  likedIds: string[];
  contactedIds: string[];
  onBack: () => void;
  onOpenCandidate: (candidateId: string) => void;
  onOpenChats: () => void;
};

function OwnerSavedListPage({
  candidates,
  likedIds,
  contactedIds,
  onBack,
  onOpenCandidate,
  onOpenChats
}: OwnerSavedListPageProps) {
  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to suggestions" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Shortlist</p>
        <h1>Shortlisted and contacted renters.</h1>
        <p className="lede">Save keeps a renter on the shortlist. Like marks stronger interest. Sending an intro opens the chat.</p>
      </div>

      <ScreenFlowNav
        eyebrow="Owner flow"
        title="Shortlist"
        description="Return to renter suggestions, reopen a shortlisted renter, or jump into active conversations."
        showBackButton={false}
        actions={[
          { label: "Open chats", onClick: onOpenChats, tone: "primary", disabled: contactedIds.length === 0 }
        ]}
      />

      {candidates.length ? (
        <div className="suggestion-stack">
          {candidates.map((candidate) => {
            const isLiked = likedIds.includes(candidate.id);
            const isContacted = contactedIds.includes(candidate.id);

            return (
              <button
                key={candidate.id}
                type="button"
                className="suggestion-card listing-card-button owner-candidate-card"
                onClick={() => onOpenCandidate(candidate.id)}
              >
                <div className="owner-candidate-top">
                  <img className="candidate-avatar" src={candidate.profilePhoto} alt={candidate.name} loading="lazy" />
                  <div className="owner-candidate-copy">
                    <div className="listing-top">
                      <div>
                        <h3>{candidate.name}</h3>
                        <p className="listing-meta">
                          {candidate.age} | {candidate.major}
                        </p>
                      </div>
                      <span className="tag-chip">{isContacted ? "Intro sent" : isLiked ? "Liked" : "Saved"}</span>
                    </div>
                    <p>{candidate.vibe}</p>
                  </div>
                </div>

                <div className="listing-facts">
                  <span>{candidate.budget}</span>
                  <span>{candidate.moveInWindow}</span>
                  <span>{candidate.score}% fit</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="empty-panel">
          <h3>No renters saved yet.</h3>
          <p>Save or like someone from the owner match feed and they will appear here.</p>
        </div>
      )}
    </section>
  );
}

export default OwnerSavedListPage;
