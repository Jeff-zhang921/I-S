import { useMemo, useState, type ReactNode } from "react";
import ScreenFlowNav from "../components/ScreenFlowNav";
import TopBackButton from "../components/TopBackButton";
import { parseProfileList, describeCategoryScore } from "../lib/onboarding";
import { OwnerListingDraft, PrivacyLevelOption, ProfileNotesState } from "../types";

type SummaryCard = {
  id: string;
  title: string;
  summary: string;
  accent: string;
  score: number;
};

type OwnerProfileSectionId = "listing" | "signals" | "mustHaves" | "dealbreakers";

type OwnerProfilePageProps = {
  account: {
    fullName: string;
    email: string;
    phone: string;
  };
  listing: OwnerListingDraft;
  privacyLevelMeta: PrivacyLevelOption;
  summaryCards: SummaryCard[];
  profileNotes: ProfileNotesState;
  savedCount: number;
  contactedCount: number;
  onBack: () => void;
  onOpenChats: () => void;
  onBackToSignIn: () => void;
};

type OwnerProfilePanelProps = {
  id: OwnerProfileSectionId;
  kicker: string;
  title: string;
  summary: string;
  isOpen: boolean;
  onToggle: (id: OwnerProfileSectionId) => void;
  children: ReactNode;
};

function OwnerProfilePanel({ id, kicker, title, summary, isOpen, onToggle, children }: OwnerProfilePanelProps) {
  return (
    <section className={`summary-panel profile-panel${isOpen ? " is-open" : ""}`}>
      <div className="profile-panel-head">
        <div className="panel-headline profile-panel-heading">
          <div>
            <p className="panel-kicker">{kicker}</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="secondary-button panel-toggle" onClick={() => onToggle(id)}>
            {isOpen ? "Hide details" : "View details"}
          </button>
        </div>
        <p className="profile-panel-summary">{summary}</p>
      </div>

      {isOpen ? <div className="profile-panel-body">{children}</div> : null}
    </section>
  );
}

function OwnerProfilePage({
  account,
  listing,
  privacyLevelMeta,
  summaryCards,
  profileNotes,
  savedCount,
  contactedCount,
  onBack,
  onOpenChats,
  onBackToSignIn
}: OwnerProfilePageProps) {
  const [expandedSection, setExpandedSection] = useState<OwnerProfileSectionId | null>(null);
  const mustHaveItems = useMemo(() => parseProfileList(profileNotes.mustHaves), [profileNotes.mustHaves]);
  const dealbreakerItems = useMemo(() => parseProfileList(profileNotes.dealbreakers), [profileNotes.dealbreakers]);

  function toggleSection(id: OwnerProfileSectionId) {
    setExpandedSection((current) => (current === id ? null : id));
  }

  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to shortlist" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Owner profile</p>
        <h1>Your host profile and room listing.</h1>
        <p className="lede">Use this as the owner-side profile view from the FigJam branch.</p>

        <div className="summary-tags">
          <span>Have a room</span>
          <span>{privacyLevelMeta.summaryLabel}</span>
          <span>{savedCount} shortlisted renters</span>
          <span>{contactedCount} intros sent</span>
        </div>

        <div className="profile-action-row">
          <button type="button" className="secondary-button" onClick={onBackToSignIn}>
            Sign out
          </button>
        </div>
      </div>

      <ScreenFlowNav
        eyebrow="Owner flow"
        title="Host profile"
        description="Return to the shortlist, jump into chats, or sign out from the prototype."
        showBackButton={false}
        actions={[{ label: "Open chats", onClick: onOpenChats, tone: "primary", disabled: contactedCount === 0 }]}
      />

      <div className="profile-accordion">
        <OwnerProfilePanel
          id="listing"
          kicker="Listing"
          title={listing.title}
          summary={`${listing.neighborhood} | GBP${listing.monthlyRent}/month | ${listing.leaseLength}`}
          isOpen={expandedSection === "listing"}
          onToggle={toggleSection}
        >
          <img className="listing-image owner-listing-detail-image" src={listing.photoUrls[0]} alt={listing.title} loading="lazy" />
          <div className="detail-list">
            <article className="detail-card">
              <strong>Host</strong>
              <span>{account.fullName}</span>
            </article>
            <article className="detail-card">
              <strong>Email</strong>
              <span>{account.email}</span>
            </article>
            <article className="detail-card">
              <strong>Phone</strong>
              <span>{account.phone}</span>
            </article>
            <article className="detail-card">
              <strong>Available from</strong>
              <span>{listing.availableFrom}</span>
            </article>
          </div>
          <p>{listing.summary}</p>
          <div className="tag-preview">
            {listing.amenities.map((amenity) => (
              <span key={amenity} className="tag-chip">
                {amenity}
              </span>
            ))}
          </div>
        </OwnerProfilePanel>

        <OwnerProfilePanel
          id="signals"
          kicker="Signals"
          title="Matching preference profile"
          summary="This uses the onboarding answers from your owner profile."
          isOpen={expandedSection === "signals"}
          onToggle={toggleSection}
        >
          <div className="signal-grid">
            {summaryCards.map((category) => (
              <article key={category.id} className={`signal-card tone-${category.accent}`}>
                <div className="signal-top">
                  <strong>{category.title}</strong>
                  <span>{category.score.toFixed(1)}/5</span>
                </div>
                <p>{describeCategoryScore(category.score)}</p>
                <div className="mini-track" aria-hidden="true">
                  <span style={{ width: `${(category.score / 5) * 100}%` }} />
                </div>
              </article>
            ))}
          </div>
        </OwnerProfilePanel>

        <OwnerProfilePanel
          id="mustHaves"
          kicker="Must-haves"
          title="What you want in a flatmate"
          summary={mustHaveItems.length ? mustHaveItems.slice(0, 3).join(" | ") : "No must-haves added yet."}
          isOpen={expandedSection === "mustHaves"}
          onToggle={toggleSection}
        >
          <div className="tag-preview">
            {mustHaveItems.length ? (
              mustHaveItems.map((item) => (
                <span key={item} className="tag-chip">
                  {item}
                </span>
              ))
            ) : (
              <p className="inline-note">No must-haves added yet.</p>
            )}
          </div>
        </OwnerProfilePanel>

        <OwnerProfilePanel
          id="dealbreakers"
          kicker="Dealbreakers"
          title="What filters renters out fast"
          summary={dealbreakerItems.length ? dealbreakerItems.slice(0, 3).join(" | ") : "No dealbreakers added yet."}
          isOpen={expandedSection === "dealbreakers"}
          onToggle={toggleSection}
        >
          <div className="tag-preview">
            {dealbreakerItems.length ? (
              dealbreakerItems.map((item) => (
                <span key={item} className="tag-chip">
                  {item}
                </span>
              ))
            ) : (
              <p className="inline-note">No dealbreakers added yet.</p>
            )}
          </div>
        </OwnerProfilePanel>
      </div>
    </section>
  );
}

export default OwnerProfilePage;
