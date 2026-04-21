import { formatPerPersonMonthly } from "../../lib/findRoom";
import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { amenityOptions, petPolicyOptions } from "../../data/findRoom";
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
      <TopBackButton label="Back to browse" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Page 7 of 10</p>
        <h1>Set filters before matching.</h1>
        <p className="lede">
          Budget stays at the top because it is the strongest early decision. Adjust commute, pet setup, and features underneath it.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Filters"
        description="Return to browse or apply the current setup to open the ranked match suggestions."
        showBackButton={false}
        actions={[{ label: "Apply filters", onClick: onApply, tone: "primary" }]}
      />

      <div className="filter-shell">
        <article className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Budget</p>
              <h2>Budget and commute</h2>
            </div>
          </div>

          <div className="slider-group">
            <label className="slider-label">
              Max budget: <strong>{formatPerPersonMonthly(filters.maxRent)}</strong>
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

          <div className="filter-stack">
            <div className="filter-chip-section">
              <div className="filter-chip-copy">
                <p className="panel-kicker">Pet policy</p>
                <p className="inline-note">Compact options instead of a full-width pet card.</p>
              </div>

              <div className="amenity-grid">
                {petPolicyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={filters.petFriendly === option.value ? "tag-chip active-chip" : "tag-chip"}
                    onClick={() => onChange("petFriendly", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-chip-section">
              <div className="filter-chip-copy">
                <p className="panel-kicker">Features</p>
                <p className="inline-note">Tap as many property features as you want.</p>
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
            </div>
          </div>
        </article>
      </div>

      <div className="button-row">
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
