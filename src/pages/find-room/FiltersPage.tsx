import { amenityOptions } from "../../data/findRoom";
import { FiltersState } from "../../types";

type FiltersPageProps = {
  filters: FiltersState;
  resultCount: number;
  onChange: <K extends keyof FiltersState>(field: K, value: FiltersState[K]) => void;
  onToggleAmenity: (amenity: string) => void;
  onBack: () => void;
  onApply: () => void;
};

function FiltersPage({ filters, resultCount, onChange, onToggleAmenity, onBack, onApply }: FiltersPageProps) {
  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Page 7 of 10</p>
        <h1>Set filters before matching.</h1>
        <p className="lede">
          These are the practical controls from the renter branch: price, commute, pet-friendly, and amenities.
        </p>
      </div>

      <div className="filter-shell">
        <article className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Price</p>
              <h2>Budget and commute</h2>
            </div>
          </div>

          <div className="slider-group">
            <label className="slider-label">
              Max rent: <strong>£{filters.maxRent}</strong>
              <input
                type="range"
                min="700"
                max="1600"
                step="20"
                value={filters.maxRent}
                onChange={(event) => onChange("maxRent", Number(event.target.value))}
              />
            </label>

            <label className="slider-label">
              Max commute: <strong>{filters.maxCommute} mins</strong>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={filters.maxCommute}
                onChange={(event) => onChange("maxCommute", Number(event.target.value))}
              />
            </label>
          </div>
        </article>

        <article className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Preferences</p>
              <h2>Property filters</h2>
            </div>
          </div>

          <div className="choice-row">
            <button
              type="button"
              className={filters.petFriendly === "any" ? "choice-card active" : "choice-card"}
              onClick={() => onChange("petFriendly", "any")}
            >
              <strong>Any pet setup</strong>
              <span>Show all room options regardless of pet policy.</span>
            </button>
            <button
              type="button"
              className={filters.petFriendly === "yes" ? "choice-card active" : "choice-card"}
              onClick={() => onChange("petFriendly", "yes")}
            >
              <strong>Pet-friendly only</strong>
              <span>Only keep rooms where pets are welcome.</span>
            </button>
          </div>

          <div className="amenity-grid">
            {amenityOptions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                className={filters.amenities.includes(amenity) ? "tag-chip active-chip" : "tag-chip"}
                onClick={() => onToggleAmenity(amenity)}
              >
                {amenity}
              </button>
            ))}
          </div>
        </article>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back to browse
        </button>
        <div className="button-row compact-actions">
          <p className="inline-note">{resultCount} listings currently match these filters.</p>
          <button type="button" className="primary-button" onClick={onApply}>
            Apply filters
          </button>
        </div>
      </div>
    </section>
  );
}

export default FiltersPage;
