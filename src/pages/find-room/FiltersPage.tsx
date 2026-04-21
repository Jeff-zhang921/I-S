import AdvancedFilterDrawer from "../../components/AdvancedFilterDrawer";
import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { FiltersState, HouseType } from "../../types";

type FiltersPageProps = {
  filters: FiltersState;
  resultCount: number;
  onChange: <K extends keyof FiltersState>(field: K, value: FiltersState[K]) => void;
  onToggleAmenity: (amenity: string) => void;
  onToggleHouseType: (houseType: HouseType) => void;
  onBack: () => void;
  onApply: () => void;
};

function FiltersPage({
  filters,
  resultCount,
  onChange,
  onToggleAmenity,
  onToggleHouseType,
  onBack,
  onApply
}: FiltersPageProps) {
  return (
    <section className="screen branch-screen filter-drawer-screen">
      <TopBackButton label="Back to browse" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Page 7 of 10</p>
        <h1>Set filters before matching.</h1>
        <p className="lede">
          Use the richer drawer-style controls to filter by price, location, move-in timing, household setup, and living style.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Filters"
        description="Return to browse or apply the current setup to open the ranked match suggestions."
        showBackButton={false}
        actions={[{ label: "Apply filters", onClick: onApply, tone: "primary" }]}
      />

      <AdvancedFilterDrawer
        filters={filters}
        resultCount={resultCount}
        onChange={onChange}
        onToggleAmenity={onToggleAmenity}
        onToggleHouseType={onToggleHouseType}
        onApply={onApply}
      />
    </section>
  );
}

export default FiltersPage;
