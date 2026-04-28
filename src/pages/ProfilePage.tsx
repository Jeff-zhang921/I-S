import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import CommitmentBadge from "../components/CommitmentBadge";
import ScreenFlowNav from "../components/ScreenFlowNav";
import StatusBanner from "../components/StatusBanner";
import TopBackButton from "../components/TopBackButton";
import { describeCommitmentLevel } from "../lib/findRoom";
import { describeCategoryScore, parseProfileList } from "../lib/onboarding";
import {
  AccountState,
  CategoryMeta,
  EditableProfileState,
  PrivacyLevelOption,
  ProfileNotesState,
  StatusState
} from "../types";

type SummaryCard = CategoryMeta & {
  score: number;
};

type ProfileSectionId = "account" | "lifestyleSurvey" | "mustHaves" | "dealbreakers";

type ProfilePageProps = {
  account: Pick<
    AccountState,
    "fullName" | "email" | "phone" | "targetCity" | "commitmentLevel" | "verificationMethod"
  >;
  privacyLevelMeta: PrivacyLevelOption;
  answeredCount: number;
  summaryCards: SummaryCard[];
  profileNotes: ProfileNotesState;
  status: StatusState;
  savedCount: number;
  contactedCount: number;
  onBack: () => void;
  onOpenChats: () => void;
  onClearStatus: () => void;
  onSaveProfile: (profile: EditableProfileState) => Promise<boolean>;
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
  status,
  savedCount,
  contactedCount,
  onBack,
  onOpenChats,
  onClearStatus,
  onSaveProfile,
  onBackToSignIn
}: ProfilePageProps) {
  const [expandedSection, setExpandedSection] = useState<ProfileSectionId | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftAccount, setDraftAccount] = useState<EditableProfileState>({
    fullName: account.fullName,
    email: account.email,
    phone: account.phone,
    targetCity: account.targetCity
  });

  const mustHaveItems = useMemo(() => parseProfileList(profileNotes.mustHaves), [profileNotes.mustHaves]);
  const dealbreakerItems = useMemo(
    () => parseProfileList(profileNotes.dealbreakers),
    [profileNotes.dealbreakers]
  );
  const topLifestyleThemes = useMemo(
    () =>
      [...summaryCards]
        .sort((left, right) => right.score - left.score)
        .slice(0, 2)
        .map((category) => category.title),
    [summaryCards]
  );
  const profileMeta = [
    account.targetCity || "City not set",
    `${account.verificationMethod} verified`,
    privacyLevelMeta.summaryLabel,
    describeCommitmentLevel(account.commitmentLevel),
    `${savedCount} saved`,
    `${contactedCount} chats`
  ].join(" • ");

  useEffect(() => {
    if (!isEditing) {
      setDraftAccount({
        fullName: account.fullName,
        email: account.email,
        phone: account.phone,
        targetCity: account.targetCity
      });
    }
  }, [account, isEditing]);

  function toggleSection(id: ProfileSectionId) {
    setExpandedSection((current) => (current === id ? null : id));
  }

  function handleStartEdit() {
    setDraftAccount({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      targetCity: account.targetCity
    });
    setExpandedSection("account");
    setIsEditing(true);
    onClearStatus();
  }

  function handleCancelEdit() {
    setDraftAccount({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      targetCity: account.targetCity
    });
    setIsEditing(false);
    onClearStatus();
  }

  async function handleSaveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const didSave = await onSaveProfile(draftAccount);
    setIsSaving(false);

    if (didSave) {
      setIsEditing(false);
    }
  }

  return (
    <section className="screen branch-screen">
      <TopBackButton label="Back to interested houses" onClick={onBack} />

      <div className="minimal-summary-block profile-summary-minimal">
        <p className="eyebrow">Profile</p>
        <h1 className="minimal-summary-title">Your renter profile.</h1>
        <p className="summary-meta-line">{profileMeta}</p>

        <div className="profile-action-row">
          <button type="button" className="primary-button" onClick={handleStartEdit} disabled={isEditing}>
            Edit Profile
          </button>
          <button type="button" className="secondary-button" onClick={onBackToSignIn}>
            Sign out
          </button>
        </div>

        <StatusBanner status={status} />
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="Profile overview"
        description="Go back to your interested houses, jump into chats, edit your details, or sign out from the prototype."
        showBackButton={false}
        actions={[{ label: "Open chats", onClick: onOpenChats, tone: "primary", disabled: contactedCount === 0 }]}
      />

      {isEditing ? (
        <section className="summary-panel profile-edit-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Edit profile</p>
              <h2>Update renter details</h2>
            </div>
          </div>

          <form className="stack-form" onSubmit={handleSaveChanges} noValidate>
            <div className="field-grid profile-edit-field-grid">
              <label>
                Full name
                <input
                  type="text"
                  value={draftAccount.fullName}
                  onChange={(event) => setDraftAccount((current) => ({ ...current, fullName: event.target.value }))}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={draftAccount.email}
                  onChange={(event) => setDraftAccount((current) => ({ ...current, email: event.target.value }))}
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  value={draftAccount.phone}
                  onChange={(event) => setDraftAccount((current) => ({ ...current, phone: event.target.value }))}
                />
              </label>

              <label>
                Target city
                <input
                  type="text"
                  value={draftAccount.targetCity}
                  onChange={(event) => setDraftAccount((current) => ({ ...current, targetCity: event.target.value }))}
                />
              </label>
            </div>

            <p className="inline-note">
              Save Changes uses a placeholder submit handler in this prototype and updates the shared profile state locally.
            </p>

            <div className="button-row profile-edit-actions">
              <button type="submit" className="primary-button" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="secondary-button" onClick={handleCancelEdit} disabled={isSaving}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="profile-accordion">
        <ProfilePanel
          id="account"
          kicker="Account"
          title={account.fullName}
          summary={`${account.email} | ${account.targetCity || "No city"} | ${savedCount} saved houses`}
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
              <strong>Target city</strong>
              <span>{account.targetCity || "Not set"}</span>
            </article>
            <article className="detail-card">
              <strong>Verification</strong>
              <span>{account.verificationMethod} verified</span>
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
          id="lifestyleSurvey"
          kicker="Lifestyle Survey"
          title="Lifestyle survey results"
          summary={`Strongest on ${topLifestyleThemes.join(" and ").toLowerCase() || "your survey themes"}.`}
          isOpen={expandedSection === "lifestyleSurvey"}
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
