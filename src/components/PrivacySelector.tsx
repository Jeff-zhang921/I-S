import { PrivacyLevel, PrivacyLevelOption } from "../types";

type PrivacySelectorProps = {
  options: PrivacyLevelOption[];
  value: PrivacyLevel;
  onChange: (value: PrivacyLevel) => void;
};

function PrivacySelector({ options, value, onChange }: PrivacySelectorProps) {
  return (
    <div className="privacy-selector privacy-level-row verify-privacy-row" role="radiogroup" aria-label="Profile visibility">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={isActive ? "choice-card privacy-choice-card active" : "choice-card privacy-choice-card"}
            onClick={() => onChange(option.value)}
          >
            <div className="privacy-choice-head">
              <strong>{option.title}</strong>
              <span className="privacy-choice-pill">{option.impactLabel}</span>
            </div>

            <p className="privacy-choice-body">{option.description}</p>

            <div className="privacy-choice-meta">
              <span>{option.questionCount} privacy questions</span>
              <span>{isActive ? "Selected" : "Tap to choose"}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default PrivacySelector;
