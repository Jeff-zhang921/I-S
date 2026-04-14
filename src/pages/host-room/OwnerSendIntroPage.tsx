import ScreenFlowNav from "../../components/ScreenFlowNav";
import StatusBanner from "../../components/StatusBanner";
import TopBackButton from "../../components/TopBackButton";
import { OwnerListingDraft, ScoredOwnerCandidate, StatusState } from "../../types";

type OwnerSendIntroPageProps = {
  listing: OwnerListingDraft;
  candidate: ScoredOwnerCandidate | null;
  draft: string;
  status: StatusState;
  backLabel: string;
  onChangeDraft: (value: string) => void;
  onAppendQuestion: (question: string) => void;
  onBack: () => void;
  onOpenCandidate: () => void;
  onSend: () => void;
};

function OwnerSendIntroPage({
  listing,
  candidate,
  draft,
  status,
  backLabel,
  onChangeDraft,
  onAppendQuestion,
  onBack,
  onOpenCandidate,
  onSend
}: OwnerSendIntroPageProps) {
  if (!candidate) {
    return (
      <section className="screen branch-screen">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="empty-panel">
          <h3>No renter selected.</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen send-intro-screen">
      <TopBackButton label={backLabel} onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Contact step</p>
        <h1>Send intro or quick questions.</h1>
        <p className="lede">
          Reach out to {candidate.name} about your room in {listing.neighborhood}. Sending this opens the renter chat thread.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Owner flow"
        title="Intro outreach"
        description="Go back to the renter profile or send the first outreach message from here."
        showBackButton={false}
        actions={[
          { label: "Renter profile", onClick: onOpenCandidate },
          { label: "Send intro", onClick: onSend, tone: "primary" }
        ]}
      />

      <div className="summary-grid">
        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Intro message</p>
              <h2>Compose outreach</h2>
            </div>
          </div>

          <textarea
            className="question-textarea intro-textarea"
            rows={8}
            value={draft}
            onChange={(event) => onChangeDraft(event.target.value)}
          />

          <StatusBanner status={status} />
        </section>

        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Quick questions</p>
              <h2>Tap to add</h2>
            </div>
          </div>

          <div className="tag-preview">
            {candidate.quickQuestions.map((question) => (
              <button key={question} type="button" className="tag-chip question-chip" onClick={() => onAppendQuestion(question)}>
                {question}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onSend}>
          Send intro
        </button>
      </div>
    </section>
  );
}

export default OwnerSendIntroPage;
