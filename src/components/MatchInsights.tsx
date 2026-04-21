import { buildMatchInsights } from "../lib/findRoom";
import { FiltersState, MatchTarget, ProfileNotesState, ScoredRoomMatch } from "../types";

type MatchInsightsProps = {
  match: ScoredRoomMatch;
  filters: FiltersState;
  userScores: MatchTarget;
  profileNotes: ProfileNotesState;
  variant?: "full" | "compact";
};

function MatchInsights({
  match,
  filters,
  userScores,
  profileNotes,
  variant = "full"
}: MatchInsightsProps) {
  const { badge, lines } = buildMatchInsights(match, filters, userScores, profileNotes);
  const visibleLines = variant === "compact" ? lines.slice(0, 2) : lines;

  return (
    <section className={variant === "compact" ? "match-insights-card compact" : "match-insights-card"}>
      <div className="match-insights-head">
        <div>
          <p className="panel-kicker">Match insights</p>
          <h3>{match.score}% fit</h3>
        </div>
        <span className={`match-insight-badge ${badge.toLowerCase().replace(/\s+/g, "-")}`}>{badge}</span>
      </div>

      <div className="match-insight-track" aria-hidden="true">
        <span style={{ width: `${match.score}%` }} />
      </div>

      <ul className="match-insight-list">
        {visibleLines.map((line) => (
          <li key={line.label} className={`match-insight-item ${line.status}`}>
            <span className="match-insight-icon" aria-hidden="true">
              {line.status === "positive" ? "+" : "-"}
            </span>
            <span>{line.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MatchInsights;
