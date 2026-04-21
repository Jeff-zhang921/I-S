import { getCommitmentBadgeDetail, getCommitmentBadgeLabel } from "../lib/findRoom";
import { CommitmentLevel } from "../types";

type CommitmentBadgeProps = {
  level: CommitmentLevel;
  showDetail?: boolean;
};

function CommitmentBadge({ level, showDetail = false }: CommitmentBadgeProps) {
  const detail = getCommitmentBadgeDetail(level);

  return (
    <span
      className={`commitment-badge commitment-${level}${showDetail ? " commitment-badge-detailed" : ""}`}
      aria-label={`Commitment level: ${getCommitmentBadgeLabel(level)}. ${detail}.`}
    >
      <span className="commitment-badge-dot" aria-hidden="true" />
      <span className="commitment-badge-copy">
        <strong>{getCommitmentBadgeLabel(level)}</strong>
        <span>{detail}</span>
      </span>
    </span>
  );
}

export default CommitmentBadge;
