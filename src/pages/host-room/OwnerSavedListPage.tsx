import { ScoredOwnerCandidate } from "../../types";

type OwnerSavedListPageProps = {
  candidates: ScoredOwnerCandidate[];
  likedIds: string[];
  contactedIds: string[];
  onOpenCandidate: (candidateId: string) => void;
};

function OwnerSavedListPage({
  candidates,
  likedIds,
  contactedIds,
  onOpenCandidate
}: OwnerSavedListPageProps) {
  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Shortlist</p>
        <h1>Saved and liked renters.</h1>
        <p className="lede">This mirrors the FigJam save path for listing owners who want to shortlist before reaching out.</p>
      </div>

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
                          {candidate.age} • {candidate.major}
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
