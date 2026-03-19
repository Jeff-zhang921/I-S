import StatusBanner from "../../components/StatusBanner";
import { ScoredRoomMatch, StatusState } from "../../types";

type SendIntroPageProps = {
  match: ScoredRoomMatch | null;
  draft: string;
  status: StatusState;
  onChangeDraft: (value: string) => void;
  onAppendQuestion: (question: string) => void;
  onBack: () => void;
  onSend: () => void;
};

function SendIntroPage({
  match,
  draft,
  status,
  onChangeDraft,
  onAppendQuestion,
  onBack,
  onSend
}: SendIntroPageProps) {
  if (!match) {
    return (
      <section className="screen branch-screen">
        <div className="empty-panel">
          <h3>No match selected.</h3>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Page 10 of 10</p>
        <h1>Send intro or quick questions.</h1>
        <p className="lede">
          This is the like outcome from the renter flow. Send an intro to {match.roommate.name} about {match.roomTitle}.
        </p>
      </div>

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
            The intro is frontend-only, so sending marks the match as contacted and opens the fake house group chat.
          </p>
        </section>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
        <button type="button" className="primary-button" onClick={onSend}>
          Send intro
        </button>
      </div>
    </section>
  );
}

export default SendIntroPage;
