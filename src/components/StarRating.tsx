type StarRatingProps = {
  rating: number;
  label: string;
  reviewCount?: number;
  caption?: string;
  size?: "sm" | "md";
  editable?: boolean;
  onChange?: (value: number) => void;
};

function clampRating(value: number) {
  return Math.max(0, Math.min(5, value));
}

function StarRating({
  rating,
  label,
  reviewCount,
  caption,
  size = "md",
  editable = false,
  onChange
}: StarRatingProps) {
  const normalizedRating = clampRating(rating);
  const selectedRating = Math.round(normalizedRating);
  const percentFilled = `${(normalizedRating / 5) * 100}%`;
  const reviewLabel =
    typeof reviewCount === "number" ? `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}` : null;

  return (
    <div className={["star-rating", `star-rating-${size}`, editable ? "star-rating-editable" : ""].filter(Boolean).join(" ")}>
      {editable ? (
        <div className="star-rating-buttons" role="group" aria-label={label}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={value <= selectedRating ? "star-rating-button is-active" : "star-rating-button"}
              aria-label={`${label}: ${value} ${value === 1 ? "star" : "stars"}`}
              aria-pressed={value === selectedRating}
              onClick={() => onChange?.(value)}
            >
              <span aria-hidden="true">★</span>
            </button>
          ))}
        </div>
      ) : (
        <div
          className="star-rating-display"
          role="img"
          aria-label={`${label}: ${normalizedRating.toFixed(1)} out of 5${reviewLabel ? ` from ${reviewLabel}` : ""}`}
        >
          <span className="star-rating-glyphs" aria-hidden="true">
            <span className="star-rating-track">★★★★★</span>
            <span className="star-rating-fill" style={{ width: percentFilled }}>
              ★★★★★
            </span>
          </span>
        </div>
      )}

      <div className="star-rating-copy">
        <strong>{normalizedRating.toFixed(1)}</strong>
        {reviewLabel ? <span>{reviewLabel}</span> : null}
        {caption ? <span className="star-rating-caption">{caption}</span> : null}
      </div>
    </div>
  );
}

export default StarRating;
