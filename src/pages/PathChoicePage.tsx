import ScreenFlowNav from "../components/ScreenFlowNav";
import TopBackButton from "../components/TopBackButton";

type PathChoicePageProps = {
  onBack: () => void;
  onChooseNeedRoom: () => void;
  onChooseHaveRoom: () => void;
};

function PathChoicePage({ onBack, onChooseNeedRoom, onChooseHaveRoom }: PathChoicePageProps) {
  return (
    <section className="screen branch-screen branch-screen-epic">
      <TopBackButton label="Back to profile" onClick={onBack} />

      <div className="summary-hero summary-hero-epic">
        <p className="eyebrow">Page 5 of 10</p>
        <h1>Choose where the live experience branches.</h1>
        <p className="lede">
          The shared onboarding is complete. From here the prototype splits into two different
          operating modes with the same compatibility core.
        </p>

        <div className="hero-signal-row">
          <span className="signal-pill">Shared profile core</span>
          <span className="signal-pill">Live room feed</span>
          <span className="signal-pill">Owner outreach mode</span>
        </div>
      </div>

      <ScreenFlowNav
        eyebrow="Branch selection"
        title="Choose the next mode"
        description="You can return to the profile summary, or continue into either the renter or owner journey."
        showBackButton={false}
      />

      <div className="branch-grid">
        <article className="branch-card branch-card-active">
          <div className="branch-card-top">
            <p className="panel-kicker">Need a room</p>
            <span className="branch-card-index">01</span>
          </div>
          <h2>Browse homes, compare fit, and open the house chat.</h2>
          <p>
            Continue through browse listings, filters, suggested rooms, match feed, room details,
            saving, and sending an intro.
          </p>
          <ul className="branch-points">
            <li>Start wide with listings, then narrow into a ranked compatibility feed.</li>
            <li>Open detailed house pages before you save, like, or reach out.</li>
            <li>Move straight from intro to the shared house chat once contact is made.</li>
          </ul>
          <button type="button" className="primary-button" onClick={onChooseNeedRoom}>
            Start renter journey
          </button>
        </article>

        <article className="branch-card branch-card-active">
          <div className="branch-card-top">
            <p className="panel-kicker">Have a room</p>
            <span className="branch-card-index">02</span>
          </div>
          <h2>Publish a room, rank renters, and run outreach.</h2>
          <p>
            Continue through listing setup, renter suggestions, owner match feed, profile review,
            save, and intro outreach.
          </p>
          <ul className="branch-points">
            <li>Shape the room listing first so renter suggestions inherit the right constraints.</li>
            <li>Review stronger-fit candidates in a host-side feed built from the same profile data.</li>
            <li>Move into direct conversation once a renter is saved or contacted.</li>
          </ul>
          <button type="button" className="primary-button" onClick={onChooseHaveRoom}>
            Start owner journey
          </button>
        </article>
      </div>
    </section>
  );
}

export default PathChoicePage;
