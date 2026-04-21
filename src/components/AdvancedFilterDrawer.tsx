import {
  amenityOptions,
  commitmentLevelFilterOptions,
  houseTypeOptions,
  lifestyleFilterOptions,
  moveInTimingOptions,
  petPolicyOptions,
  radiusOptions
} from "../data/findRoom";
import { formatPerPersonMonthly } from "../lib/findRoom";
import { CommitmentLevel, FiltersState, HouseType } from "../types";

type AdvancedFilterDrawerProps = {
  filters: FiltersState;
  resultCount: number;
  onChange: <K extends keyof FiltersState>(field: K, value: FiltersState[K]) => void;
  onToggleAmenity: (amenity: string) => void;
  onToggleCommitmentLevel: (commitmentLevel: CommitmentLevel) => void;
  onToggleHouseType: (houseType: HouseType) => void;
  onApply: () => void;
};

function AdvancedFilterDrawer({
  filters,
  resultCount,
  onChange,
  onToggleAmenity,
  onToggleCommitmentLevel,
  onToggleHouseType,
  onApply
}: AdvancedFilterDrawerProps) {
  return (
    <section className="advanced-filter-drawer">
      <header className="advanced-filter-header">
        <div>
          <p className="panel-kicker">Advanced filters</p>
          <h2>Fine-tune the shortlist</h2>
          <p className="inline-note">
            Budget stays at the top, with location, logistics, and lifestyle grouped underneath.
          </p>
        </div>
        <button type="button" className="primary-button" onClick={onApply}>
          Show {resultCount} matches
        </button>
      </header>

      <section className="advanced-filter-section budget-section">
        <div className="panel-headline">
          <div>
            <p className="panel-kicker">Primary filter</p>
            <h3>Budget</h3>
          </div>
          <span className="tag-chip">{formatPerPersonMonthly(filters.maxRent)}</span>
        </div>

        <div className="budget-range-grid">
          <label className="slider-label">
            Min rent
            <input
              type="number"
              min="500"
              max={filters.maxRent}
              step="25"
              value={filters.minRent}
              onChange={(event) => onChange("minRent", Number(event.target.value) || 0)}
            />
          </label>
          <label className="slider-label">
            Max rent
            <input
              type="number"
              min={filters.minRent}
              max="2000"
              step="25"
              value={filters.maxRent}
              onChange={(event) => onChange("maxRent", Number(event.target.value) || filters.maxRent)}
            />
          </label>
        </div>

        <label className="slider-label">
          Max budget slider
          <input
            type="range"
            min="700"
            max="1600"
            step="20"
            value={filters.maxRent}
            onChange={(event) => onChange("maxRent", Number(event.target.value))}
          />
        </label>
      </section>

      <div className="advanced-filter-grid">
        <section className="advanced-filter-section">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Location</p>
              <h3>Area and radius</h3>
            </div>
          </div>

          <div className="advanced-filter-field-grid">
            <label className="slider-label">
              Location search
              <input
                type="search"
                placeholder="Try Clifton, Temple Meads, Southville..."
                value={filters.locationQuery}
                onChange={(event) => onChange("locationQuery", event.target.value)}
              />
            </label>

            <label className="slider-label">
              Radius
              <select
                className="filter-select"
                value={String(filters.radiusMiles)}
                onChange={(event) => onChange("radiusMiles", Number(event.target.value))}
              >
                {radiusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="advanced-filter-section">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Logistics</p>
              <h3>Move-in and house setup</h3>
            </div>
          </div>

          <div className="filter-chip-section">
            <div className="filter-chip-copy">
              <p className="panel-kicker">Move-in timing</p>
              <p className="inline-note">Choose the timeframe you want to prioritize first.</p>
            </div>

            <div className="amenity-grid">
              {moveInTimingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={filters.moveInTiming === option.value ? "tag-chip active-chip" : "tag-chip"}
                  onClick={() => onChange("moveInTiming", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-chip-section">
            <div className="filter-chip-copy">
              <p className="panel-kicker">House type</p>
              <p className="inline-note">Pick one or more house formats.</p>
            </div>

            <div className="amenity-grid">
              {houseTypeOptions.map((houseType) => (
                <button
                  key={houseType}
                  type="button"
                  className={filters.houseTypes.includes(houseType) ? "tag-chip active-chip" : "tag-chip"}
                  onClick={() => onToggleHouseType(houseType)}
                >
                  {houseType}
                </button>
              ))}
            </div>
          </div>

          <div className="advanced-filter-field-grid">
            <label className="slider-label">
              Min current occupants
              <input
                type="number"
                min="0"
                max={filters.occupantCountMax}
                value={filters.occupantCountMin}
                onChange={(event) => onChange("occupantCountMin", Number(event.target.value) || 0)}
              />
            </label>
            <label className="slider-label">
              Max current occupants
              <input
                type="number"
                min={filters.occupantCountMin}
                max="6"
                value={filters.occupantCountMax}
                onChange={(event) => onChange("occupantCountMax", Number(event.target.value) || filters.occupantCountMax)}
              />
            </label>
          </div>

          <label className="slider-label">
            Max commute
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={filters.maxCommute}
              onChange={(event) => onChange("maxCommute", Number(event.target.value))}
            />
            <span className="inline-note">Currently under {filters.maxCommute} minutes.</span>
          </label>
        </section>

        <section className="advanced-filter-section">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Lifestyle</p>
              <h3>Shared-living filters</h3>
            </div>
          </div>

          <div className="filter-chip-section">
            <div className="filter-chip-copy">
              <p className="panel-kicker">Commitment level</p>
              <p className="inline-note">Filter out people who are only browsing if you need faster-moving options.</p>
            </div>

            <div className="commitment-filter-grid">
              {commitmentLevelFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={filters.commitmentLevels.includes(option.value) ? "commitment-filter-card active" : "commitment-filter-card"}
                  onClick={() => onToggleCommitmentLevel(option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-chip-section">
            <div className="filter-chip-copy">
              <p className="panel-kicker">Quick toggles</p>
              <p className="inline-note">Use these to narrow by house energy and resident type.</p>
            </div>

            <div className="amenity-grid">
              {lifestyleFilterOptions.map((option) => (
                <button
                  key={option.field}
                  type="button"
                  className={filters[option.field] ? "tag-chip active-chip" : "tag-chip"}
                  onClick={() => onChange(option.field, !filters[option.field])}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-chip-section">
            <div className="filter-chip-copy">
              <p className="panel-kicker">Pet policy</p>
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
        </section>

        <section className="advanced-filter-section">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Features</p>
              <h3>Amenities</h3>
            </div>
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
        </section>
      </div>
    </section>
  );
}

export default AdvancedFilterDrawer;
