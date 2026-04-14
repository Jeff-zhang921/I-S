import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { formatOwnerRent } from "../../lib/ownerRoom";
import { OwnerListingDraft, RoomAmenity } from "../../types";

type CreateListingPageProps = {
  listing: OwnerListingDraft;
  candidateCount: number;
  onChange: <K extends keyof OwnerListingDraft>(field: K, value: OwnerListingDraft[K]) => void;
  onToggleAmenity: (amenity: RoomAmenity) => void;
  onBack: () => void;
  onContinue: () => void;
};

function CreateListingPage({
  listing,
  candidateCount,
  onChange,
  onToggleAmenity,
  onBack,
  onContinue
}: CreateListingPageProps) {
  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to branch" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Have a room</p>
        <h1>Create your listing and shortlist housemates.</h1>
        <p className="lede">
          This follows the FigJam owner branch: create a listing, attach room details, then review suggested renters.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Owner flow"
        title="Listing setup"
        description="Go back to branch selection, or keep moving into the renter suggestions once the room is ready."
        showBackButton={false}
        actions={[{ label: "Continue to renter matches", onClick: onContinue, tone: "primary" }]}
      />

      <div className="owner-listing-layout">
        <section className="summary-panel owner-form-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Listing basics</p>
              <h2>{listing.title}</h2>
            </div>
          </div>

          <div className="field-grid owner-field-grid">
            <label>
              Room title
              <input value={listing.title} onChange={(event) => onChange("title", event.target.value)} />
            </label>
            <label>
              Neighborhood
              <input value={listing.neighborhood} onChange={(event) => onChange("neighborhood", event.target.value)} />
            </label>
            <label>
              Monthly rent
              <input
                type="number"
                inputMode="numeric"
                value={listing.monthlyRent}
                onChange={(event) => onChange("monthlyRent", Number(event.target.value) || 0)}
              />
            </label>
            <label>
              Available from
              <input
                type="date"
                value={listing.availableFrom}
                onChange={(event) => onChange("availableFrom", event.target.value)}
              />
            </label>
            <label>
              Lease length
              <input value={listing.leaseLength} onChange={(event) => onChange("leaseLength", event.target.value)} />
            </label>
            <label>
              Room size
              <input value={listing.roomSize} onChange={(event) => onChange("roomSize", event.target.value)} />
            </label>
            <label>
              Bathrooms
              <input value={listing.bathrooms} onChange={(event) => onChange("bathrooms", event.target.value)} />
            </label>
            <label>
              Household size
              <input value={listing.householdSize} onChange={(event) => onChange("householdSize", event.target.value)} />
            </label>
          </div>

          <label className="full-width">
            Bills
            <input value={listing.bills} onChange={(event) => onChange("bills", event.target.value)} />
          </label>

          <label className="full-width">
            Listing summary
            <textarea
              className="question-textarea"
              rows={4}
              value={listing.summary}
              onChange={(event) => onChange("summary", event.target.value)}
            />
          </label>

          <label className="full-width">
            House rules
            <textarea
              className="question-textarea"
              rows={4}
              value={listing.houseRules}
              onChange={(event) => onChange("houseRules", event.target.value)}
            />
          </label>

          <div className="panel-head compact-head">
            <p className="panel-kicker">Amenities</p>
            <p className="inline-note">Frontend-only listing setup. Tap to add or remove features.</p>
          </div>

          <div className="tag-preview">
            {(["Laundry", "Dishwasher", "Gym", "Roof deck", "Near transit", "Parking", "Furnished"] as RoomAmenity[]).map(
              (amenity) => (
                <button
                  key={amenity}
                  type="button"
                  className={listing.amenities.includes(amenity) ? "tag-chip active-chip" : "tag-chip"}
                  onClick={() => onToggleAmenity(amenity)}
                >
                  {amenity}
                </button>
              )
            )}
          </div>

          <div className="toggle-group">
            <button
              type="button"
              className={listing.petFriendly ? "toggle-button active" : "toggle-button"}
              onClick={() => onChange("petFriendly", true)}
            >
              Pet-friendly
            </button>
            <button
              type="button"
              className={!listing.petFriendly ? "toggle-button active" : "toggle-button"}
              onClick={() => onChange("petFriendly", false)}
            >
              No pets
            </button>
          </div>
        </section>

        <section className="summary-panel owner-preview-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Preview</p>
              <h2>{formatOwnerRent(listing.monthlyRent)} / month</h2>
            </div>
            <span className="tag-chip">{candidateCount} renter matches loaded</span>
          </div>

          <div className="owner-photo-grid">
            {listing.photoUrls.map((photoUrl, index) => (
              <img
                key={photoUrl}
                className={index === 0 ? "owner-preview-image owner-preview-image-large" : "owner-preview-image"}
                src={photoUrl}
                alt={`${listing.title} preview ${index + 1}`}
                loading="lazy"
              />
            ))}
          </div>

          <p>{listing.summary}</p>
          <div className="listing-facts">
            <span>{listing.neighborhood}</span>
            <span>{listing.availableFrom}</span>
            <span>{listing.leaseLength}</span>
            <span>{listing.roomSize}</span>
            <span>{listing.bathrooms}</span>
            <span>{listing.householdSize}</span>
          </div>

          <div className="tag-preview">
            {listing.amenities.map((amenity) => (
              <span key={amenity} className="tag-chip">
                {amenity}
              </span>
            ))}
          </div>

          <p className="listing-subcopy">{listing.houseRules}</p>

          <button type="button" className="primary-button" onClick={onContinue}>
            Continue to renter matches
          </button>
        </section>
      </div>
    </section>
  );
}

export default CreateListingPage;
