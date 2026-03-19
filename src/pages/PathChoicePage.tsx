type PathChoicePageProps = {
  onChooseNeedRoom: () => void;
};

function PathChoicePage({ onChooseNeedRoom }: PathChoicePageProps) {
  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Page 5 of 10</p>
        <h1>Choose the branch from the core flow.</h1>
        <p className="lede">
          This implementation only completes the renter path. The listing-owner path stays visible as a placeholder.
        </p>
      </div>

      <div className="branch-grid">
        <article className="branch-card branch-card-active">
          <p className="panel-kicker">Need a room</p>
          <h2>Browse listings and roommate matches</h2>
          <p>
            Continue through browse listings, filters, suggested rooms, match feed, room details,
            saving, and sending an intro.
          </p>
          <button type="button" className="primary-button" onClick={onChooseNeedRoom}>
            Start renter journey
          </button>
        </article>

        <article className="branch-card branch-card-muted">
          <p className="panel-kicker">Have a room</p>
          <h2>Create a listing</h2>
          <p>This branch is intentionally not implemented in this pass.</p>
          <button type="button" className="secondary-button" disabled>
            Coming later
          </button>
        </article>
      </div>
    </section>
  );
}

export default PathChoicePage;
