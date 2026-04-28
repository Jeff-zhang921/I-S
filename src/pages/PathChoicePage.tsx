import ScreenFlowNav from "../components/ScreenFlowNav";
import TopBackButton from "../components/TopBackButton";

type PathChoicePageProps = {
  targetCity: string;
  onBack: () => void;
  onChooseNeedRoom: () => void;
  onChooseHaveRoom: () => void;
};

function PathChoicePage({ targetCity, onBack, onChooseNeedRoom, onChooseHaveRoom }: PathChoicePageProps) {
  const summaryMeta = [targetCity || "City not set", "Verified", "Lifestyle survey complete"].join(" • ");

  return (
    <section className="screen branch-screen branch-screen-epic branch-screen-compact">
      <TopBackButton label="Back to profile" onClick={onBack} />

      <div className="minimal-summary-block">
        <h1 className="minimal-summary-title">Choose to proceed.</h1>
        <p className="summary-meta-line">{summaryMeta}</p>
      </div>

      <ScreenFlowNav
        eyebrow="Next step"
        title="Choose your journey"
        description="Pick renter mode or owner mode."
        showBackButton={false}
      />

      <div className="branch-grid">
        <article className="branch-card branch-card-active">
          <div className="branch-card-top">
            <p className="panel-kicker">Need a room</p>
            <span className="branch-card-index">01</span>
          </div>
          <h2>Find a room</h2>
          <p className="branch-body-copy">Browse listings, compare fit, and message tenants when ready.</p>
          <button type="button" className="primary-button branch-primary-cta" onClick={onChooseNeedRoom}>
            Start renter journey
          </button>
        </article>

        <article className="branch-card branch-card-active">
          <div className="branch-card-top">
            <p className="panel-kicker">Have a room</p>
            <span className="branch-card-index">02</span>
          </div>
          <h2>List your room</h2>
          <p className="branch-body-copy">Publish a listing, shortlist renters, and send intros quickly.</p>
          <button type="button" className="primary-button branch-primary-cta" onClick={onChooseHaveRoom}>
            Start owner journey
          </button>
        </article>
      </div>
    </section>
  );
}

export default PathChoicePage;
