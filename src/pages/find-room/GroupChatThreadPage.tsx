import StatusBanner from "../../components/StatusBanner";
import { GroupChatThread, ScoredRoomMatch, StatusState } from "../../types";

type GroupChatThreadPageProps = {
  activeMatch: ScoredRoomMatch | null;
  activeThread: GroupChatThread | null;
  draft: string;
  status: StatusState;
  onBack: () => void;
  onOpenMatch: () => void;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
};

function GroupChatThreadPage({
  activeMatch,
  activeThread,
  draft,
  status,
  onBack,
  onOpenMatch,
  onChangeDraft,
  onSend
}: GroupChatThreadPageProps) {
  if (!activeMatch || !activeThread) {
    return (
      <section className="screen branch-screen">
        <div className="empty-panel">
          <h3>No chat selected.</h3>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back to chats
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Chat thread</p>
        <h1>{activeThread.title}</h1>
        <p className="lede">
          Contact the house owner and current tenant in one thread for {activeMatch.roomTitle}.
        </p>
      </div>

      <section className="summary-panel chat-panel">
        <div className="panel-headline">
          <div>
            <p className="panel-kicker">Participants</p>
            <h2>{activeMatch.roomTitle}</h2>
          </div>
          <div className="button-row compact-actions">

            <button type="button" className="secondary-button" onClick={onOpenMatch}>
              View room
            </button>
          </div>
        </div>

        <div className="tag-preview">
          {activeThread.participants.map((participant) => (
            <span key={participant.id} className="tag-chip">
              {participant.name} - {participant.label}
            </span>
          ))}
        </div>

        <div className="chat-messages">
          {activeThread.messages.map((message) => {
            const sender = activeThread.participants.find((participant) => participant.id === message.senderId);
            const isMine = sender?.role === "me";

            return (
              <article key={message.id} className={isMine ? "chat-bubble chat-bubble-me" : "chat-bubble"}>
                <div className="chat-meta">
                  <strong>{sender?.name ?? "Unknown"}</strong>
                  <span>{message.sentAt}</span>
                </div>
                <p>{message.body}</p>
              </article>
            );
          })}
        </div>

        <div className="chat-composer">
          <textarea
            className="question-textarea chat-textarea"
            rows={4}
            value={draft}
            onChange={(event) => onChangeDraft(event.target.value)}
            placeholder="Type a message to the house owner and current tenant..."
          />
          <StatusBanner status={status} />
          <div className="button-row">
            <p className="inline-note">Messages are fake prototype data and stay only in frontend state.</p>
            <button type="button" className="primary-button" onClick={onSend}>
              Send message
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default GroupChatThreadPage;
