import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { ScoredOwnerCandidate } from "../../types";

type OwnerSuggestionsPageProps = {
  candidates: ScoredOwnerCandidate[];
  onBack: () => void;
  onOpenFeed: () => void;
  onInspect: (candidateId: string) => void;
};

function OwnerSuggestionsPage({ candidates, onBack, onOpenFeed, onInspect }: OwnerSuggestionsPageProps) {
  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to listing" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Suggested renters</p>
        <h1>Suggested renters for your listing.</h1>
        <p className="lede">
          This is the owner-side recommendation step from the FigJam flow after creating a room listing.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Owner flow"
        title="Renter suggestions"
        description="Return to the listing, inspect any renter in detail, or move into the one-card-at-a-time owner feed."
        showBackButton={false}
        actions={[{ label: "Open owner match feed", onClick: onOpenFeed, tone: "primary", disabled: !candidates.length }]}
      />

      {candidates.length ? (
        <div className="owner-candidate-grid">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              className="suggestion-card listing-card-button owner-candidate-card"
              onClick={() => onInspect(candidate.id)}
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
                    <div className="match-score-pill">{candidate.score}% fit</div>
                  </div>
                  <p>{candidate.vibe}</p>
                </div>
              </div>

              <div className="listing-facts">
                <span>{candidate.budget}</span>
                <span>{candidate.moveInWindow}</span>
                <span>{candidate.leasePreference}</span>
              </div>

              <div>
                <p className="panel-kicker">Why this match</p>
                <ul className="bullet-list">
                  {candidate.whyMatch.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <h3>No renter suggestions available.</h3>
          <p>Adjust the listing details and try again.</p>
        </div>
      )}

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onOpenFeed} disabled={!candidates.length}>
          Open owner match feed
        </button>
      </div>
    </section>
  );
}

export default OwnerSuggestionsPage;
