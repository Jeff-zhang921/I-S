import { commitmentLevelOptions } from "../data/onboarding";
import { CommitmentLevel } from "../types";

type CommitmentSelectorProps = {
  value: CommitmentLevel;
  onChange: (value: CommitmentLevel) => void;
};

function CommitmentSelector({ value, onChange }: CommitmentSelectorProps) {
  return (
    <div className="commitment-selector" role="radiogroup" aria-label="Commitment level">
      {commitmentLevelOptions.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={isActive ? "commitment-card active" : "commitment-card"}
            onClick={() => onChange(option.value)}
          >
            <div className="commitment-card-head">
              <strong>{option.title}</strong>
              <span className={`commitment-card-pill commitment-${option.value}`}>{option.shortLabel}</span>
            </div>
            <p>{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}

export default CommitmentSelector;
