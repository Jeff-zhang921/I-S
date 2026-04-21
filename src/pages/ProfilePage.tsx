import { useMemo, useState, type ReactNode } from "react";
import CommitmentBadge from "../components/CommitmentBadge";
import ScreenFlowNav from "../components/ScreenFlowNav";
import TopBackButton from "../components/TopBackButton";
import { describeCommitmentLevel } from "../lib/findRoom";
import { describeCategoryScore, parseProfileList } from "../lib/onboarding";
import { CategoryMeta, PrivacyLevelOption, ProfileNotesState } from "../types";

type SummaryCard = CategoryMeta & {
  score: number;
};

type ProfileSectionId = "account" | "signals" | "mustHaves" | "dealbreakers";

type ProfilePageProps = {
  account: {
    fullName: string;
    email: string;
    phone: string;
    commitmentLevel: "casual" | "active" | "ready";
    verificationMethod: string;
    idCheckChoice: string;
  };
  privacyLevelMeta: PrivacyLevelOption;
  answeredCount: number;
  summaryCards: SummaryCard[];
  profileNotes: ProfileNotesState;
  savedCount: number;
  contactedCount: number;
  onBack: () => void;
  onOpenChats: () => void;
  onBackToSignIn: () => void;
};

type ProfilePanelProps = {
  id: ProfileSectionId;
  kicker: string;
  title: string;
  summary: string;
  isOpen: boolean;
  onToggle: (id: ProfileSectionId) => void;
  children: ReactNode;
};

function ProfilePanel({ id, kicker, title, summary, isOpen, onToggle, children }: ProfilePanelProps) {
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

function ProfilePage({
  account,
  privacyLevelMeta,
  answeredCount,
  summaryCards,
  profileNotes,
  savedCount,
  contactedCount,
  onBack,
  onOpenChats,
  onBackToSignIn
}: ProfilePageProps) {
  const [expandedSection, setExpandedSection] = useState<ProfileSectionId | null>(null);

  const mustHaveItems = useMemo(() => parseProfileList(profileNotes.mustHaves), [profileNotes.mustHaves]);
  const dealbreakerItems = useMemo(
    () => parseProfileList(profileNotes.dealbreakers),
    [profileNotes.dealbreakers]
  );
  const topSignals = useMemo(
    () =>
      [...summaryCards]
        .sort((left, right) => right.score - left.score)
        .slice(0, 2)
        .map((category) => category.title),
    [summaryCards]
  );

  function toggleSection(id: ProfileSectionId) {
    setExpandedSection((current) => (current === id ? null : id));
  }

  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to interested houses" onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Profile</p>
        <h1>Your renter profile.</h1>
        <p className="lede">
          Keep the overview short on mobile, then open details only when needed.
        </p>

        <div className="summary-tags">
          <span>Need a room</span>
          <span>{answeredCount} answers</span>
          <span>{privacyLevelMeta.summaryLabel}</span>
          <span>{describeCommitmentLevel(account.commitmentLevel)}</span>
          <span>{savedCount} interested houses</span>
          <span>{contactedCount} intros sent</span>
        </div>

        <div className="profile-action-row">
          <button type="button" className="secondary-button" onClick={onBackToSignIn}>
            Sign out
          </button>
        </div>
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Profile overview"
        description="Go back to your interested houses, jump into chats, or sign out from the prototype."
        showBackButton={false}
        actions={[{ label: "Open chats", onClick: onOpenChats, tone: "primary", disabled: contactedCount === 0 }]}
      />

      <div className="profile-accordion">
        <ProfilePanel
          id="account"
          kicker="Account"
          title={account.fullName}
          summary={`${account.email} | ${privacyLevelMeta.summaryLabel} | ${savedCount} saved houses`}
          isOpen={expandedSection === "account"}
          onToggle={toggleSection}
        >
          <div className="detail-list">
            <article className="detail-card">
              <strong>Email</strong>
              <span>{account.email}</span>
            </article>
            <article className="detail-card">
              <strong>Phone</strong>
              <span>{account.phone}</span>
            </article>
            <article className="detail-card">
              <strong>Verification</strong>
              <span>{account.verificationMethod} verified</span>
            </article>
            <article className="detail-card">
              <strong>ID check</strong>
              <span>{account.idCheckChoice === "include" ? "Included" : "Skipped"}</span>
            </article>
            <article className="detail-card detail-card-wide">
              <strong>Profile visibility</strong>
              <span>{privacyLevelMeta.title} with {privacyLevelMeta.questionCount} privacy questions</span>
            </article>
            <article className="detail-card detail-card-wide">
              <strong>Commitment level</strong>
              <CommitmentBadge level={account.commitmentLevel} showDetail />
            </article>
          </div>
        </ProfilePanel>

        <ProfilePanel
          id="signals"
          kicker="Signals"
          title="Compatibility profile"
          summary={`Strongest on ${topSignals.join(" and ").toLowerCase() || "matching signals"}.`}
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
        </ProfilePanel>

        <ProfilePanel
          id="mustHaves"
          kicker="Must-haves"
          title="What this renter is looking for"
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
        </ProfilePanel>

        <ProfilePanel
          id="dealbreakers"
          kicker="Dealbreakers"
          title="What should filter out fast"
          summary={
            dealbreakerItems.length ? dealbreakerItems.slice(0, 3).join(" | ") : "No dealbreakers added yet."
          }
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
        </ProfilePanel>
      </div>
    </section>
  );
}

export default ProfilePage;
