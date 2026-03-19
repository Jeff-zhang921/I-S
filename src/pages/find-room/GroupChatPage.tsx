import StatusBanner from "../../components/StatusBanner";
import { GroupChatThread, ScoredRoomMatch, StatusState } from "../../types";

type GroupChatPageProps = {
  threadMatches: ScoredRoomMatch[];
  activeMatch: ScoredRoomMatch | null;
  activeThread: GroupChatThread | null;
  draft: string;
  status: StatusState;
  onSelectThread: (matchId: string) => void;
  onOpenMatch: () => void;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
};

function GroupChatPage({
  threadMatches,
  activeMatch,
  activeThread,
  draft,
  status,
  onSelectThread,
  onOpenMatch,
  onChangeDraft,
  onSend
}: GroupChatPageProps) {
  if (!threadMatches.length) {
    return (
      <section className="screen branch-screen">
        <div className="summary-hero">
          <p className="eyebrow">Group chat</p>
          <h1>No active house chats yet.</h1>
          <p className="lede">
            Save a house or send an intro first. Then the owner and current tenant group chat will appear here.
          </p>
        </div>
      </section>
    );
  }

  if (!activeMatch || !activeThread) {
    return (
      <section className="screen branch-screen">
        <div className="empty-panel">
          <h3>No chat selected.</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Group chat</p>
        <h1>{activeThread.title}</h1>
        <p className="lede">
          Contact the house owner and current tenant in one thread for {activeMatch.roomTitle}.
        </p>
      </div>

      <div className="chat-layout">
        <aside className="summary-panel chat-sidebar">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Chats</p>
              <h2>{threadMatches.length} active</h2>
            </div>
          </div>

          <div className="chat-thread-list">
            {threadMatches.map((match) => (
              <button
                key={match.id}
                type="button"
                className={match.id === activeMatch.id ? "chat-thread-item active" : "chat-thread-item"}
                onClick={() => onSelectThread(match.id)}
              >
                <strong>{match.roomTitle}</strong>
                <span>{match.neighborhood} • {match.roommate.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="summary-panel chat-panel">
          <div className="panel-headline">
            <div>
              <p className="panel-kicker">Participants</p>
              <h2>{activeMatch.roomTitle}</h2>
            </div>
            <button type="button" className="secondary-button" onClick={onOpenMatch}>
              View room
            </button>
          </div>

          <div className="tag-preview">
            {activeThread.participants.map((participant) => (
              <span key={participant.id} className="tag-chip">
                {participant.name} • {participant.label}
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
      </div>
    </section>
  );
}

export default GroupChatPage;
