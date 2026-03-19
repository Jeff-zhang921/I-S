import { GroupChatThread, ScoredRoomMatch } from "../../types";

type GroupChatPageProps = {
  threadMatches: ScoredRoomMatch[];
  activeMatchId: string | null;
  getThread: (matchId: string) => GroupChatThread | null;
  onOpenThread: (matchId: string) => void;
};

function GroupChatPage({ threadMatches, activeMatchId, getThread, onOpenThread }: GroupChatPageProps) {
  if (!threadMatches.length) {
    return (
      <section className="screen branch-screen">
        <div className="summary-hero">
          <p className="eyebrow">Chats</p>
          <h1>No active house chats yet.</h1>
          <p className="lede">
            Like a house or send an intro first. Then the owner and current tenant group chat will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="screen branch-screen">
      <div className="summary-hero">
        <p className="eyebrow">Chats</p>
        <h1>House group chats.</h1>
        <p className="lede">
          This page is a list of your active house conversations. Tap any chat to open the full thread.
        </p>
      </div>

      <section className="summary-panel chat-list-shell">
        <div className="panel-headline">
          <div>
            <p className="panel-kicker">Active chats</p>
            <h2>{threadMatches.length} threads</h2>
          </div>
        </div>

        <div className="chat-thread-list">
          {threadMatches.map((match) => {
            const thread = getThread(match.id);
            const lastMessage = thread?.messages[thread.messages.length - 1];

            return (
              <button
                key={match.id}
                type="button"
                className={match.id === activeMatchId ? "chat-thread-item active" : "chat-thread-item"}
                onClick={() => onOpenThread(match.id)}
              >
                <div className="chat-thread-top">
                  <strong>{match.roomTitle}</strong>
                  <span>{match.neighborhood}</span>
                </div>
                <p className="chat-thread-preview">{lastMessage?.body ?? "No messages yet."}</p>
                <div className="chat-thread-meta">
                  <span>{match.roommate.name} + owner</span>
                  <span>{lastMessage?.sentAt ?? "Now"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default GroupChatPage;
