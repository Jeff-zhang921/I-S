import ScreenFlowNav from "../../components/ScreenFlowNav";
import StatusBanner from "../../components/StatusBanner";
import TopBackButton from "../../components/TopBackButton";
import { ScoredRoomMatch, StatusState } from "../../types";

type SendIntroPageProps = {
  match: ScoredRoomMatch | null;
  draft: string;
  status: StatusState;
  backLabel: string;
  onChangeDraft: (value: string) => void;
  onAppendQuestion: (question: string) => void;
  onBack: () => void;
  onOpenMatch: () => void;
  onSend: () => void;
};

function SendIntroPage({
  match,
  draft,
  status,
  backLabel,
  onChangeDraft,
  onAppendQuestion,
  onBack,
  onOpenMatch,
  onSend
}: SendIntroPageProps) {
  if (!match) {
    return (
      <section className="screen branch-screen">
        <TopBackButton label="Back" onClick={onBack} />

        <div className="empty-panel">
          <h3>No match selected.</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen send-intro-screen">
      <TopBackButton label={backLabel} onClick={onBack} />

      <div className="summary-hero">
        <p className="eyebrow">Page 12 of 12</p>
        <h1>Tell the tenants you are interested.</h1>
        <p className="lede">
          This is the contact step. Send the first message to {match.roommate.name} about {match.roomTitle} to open the house chat.
        </p>
      </div>

      <ScreenFlowNav
        eyebrow="Renter flow"
        title="First message"
        description="Return to the previous stage or reopen the room detail before you message the current tenants."
        showBackButton={false}
        actions={[
          { label: "Room detail", onClick: onOpenMatch },
          { label: "Message tenants", onClick: onSend, tone: "primary" }
        ]}
      />

      <div className="summary-grid">
        <section className="summary-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">First message</p>
              <h2>Compose outreach</h2>
            </div>
          </div>

          <textarea
            className="question-textarea intro-textarea"
            rows={8}
            value={draft}
            onChange={(event) => onChangeDraft(event.target.value)}
            placeholder="Hi, I am interested in the room and think we could be a good fit..."
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
            {match.quickQuestions.map((question) => (
              <button key={question} type="button" className="tag-chip question-chip" onClick={() => onAppendQuestion(question)}>
                {question}
              </button>
            ))}
          </div>

          <p className="inline-note">
            This is frontend-only, so sending marks the match as contacted and opens the fake house group chat.
          </p>
        </section>
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onSend}>
          Message tenants
        </button>
      </div>
    </section>
  );
}

export default SendIntroPage;
