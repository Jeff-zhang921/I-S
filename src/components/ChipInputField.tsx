type ChipInputFieldProps = {
  label: string;
  placeholder: string;
  helperText?: string;
  items: string[];
  draftValue: string;
  suggestions?: string[];
  onDraftChange: (value: string) => void;
  onAddItem: (value: string) => void;
  onRemoveItem: (item: string) => void;
};

function ChipInputField({
  label,
  placeholder,
  helperText,
  items,
  draftValue,
  suggestions = [],
  onDraftChange,
  onAddItem,
  onRemoveItem
}: ChipInputFieldProps) {
  const uniqueSuggestions = suggestions.filter(
    (suggestion) => !items.some((item) => item.toLowerCase() === suggestion.toLowerCase())
  );

  function handleAdd() {
    onAddItem(draftValue);
  }

  return (
    <div className="chip-input-field">
      <label className="text-card-label">
        {label}
        <div className="chip-input-shell">
          <div className="tag-preview chip-input-preview">
            {items.length ? (
              items.map((item) => (
                <span key={item} className="tag-chip tag-chip-removable">
                  {item}
                  <button
                    type="button"
                    className="tag-chip-remove"
                    onClick={() => onRemoveItem(item)}
                    aria-label={`Remove ${item}`}
                  >
                    x
                  </button>
                </span>
              ))
            ) : (
              <p className="inline-note">No items added yet.</p>
            )}
          </div>

          <div className="chip-input-row">
            <input
              type="text"
              className="chip-input"
              value={draftValue}
              onChange={(event) => onDraftChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  handleAdd();
                }
              }}
              placeholder={placeholder}
              aria-label={label}
            />
            <button type="button" className="secondary-button chip-input-button" onClick={handleAdd}>
              Add item
            </button>
          </div>
        </div>
      </label>

      {helperText ? <p className="inline-note chip-input-helper">{helperText}</p> : null}

      {uniqueSuggestions.length ? (
        <div className="chip-suggestions">
          <p className="chip-suggestions-label">Suggestions</p>
          <div className="tag-preview">
            {uniqueSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="tag-chip question-chip"
                onClick={() => onAddItem(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ChipInputField;
