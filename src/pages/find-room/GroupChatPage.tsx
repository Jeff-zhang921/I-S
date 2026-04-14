import ScreenFlowNav from "../../components/ScreenFlowNav";
import TopBackButton from "../../components/TopBackButton";
import { GroupChatThread, ScoredRoomMatch } from "../../types";

type GroupChatPageProps = {
  threadMatches: ScoredRoomMatch[];
  activeMatchId: string | null;
  getThread: (matchId: string) => GroupChatThread | null;
  onOpenThread: (matchId: string) => void;
  onBack: () => void;
  onOpenSaved: () => void;
};

function GroupChatPage({
  threadMatches,
  activeMatchId,
  getThread,
  onOpenThread,
  onBack,
  onOpenSaved
}: GroupChatPageProps) {
  if (!threadMatches.length) {
    return (
      <section className="screen chat-screen">
        <div className="chat-shell chat-empty-shell">
          <TopBackButton label="Back to interested houses" onClick={onBack} />

          <p className="eyebrow">Chats</p>
          <h1>No active house chats yet.</h1>
          <p className="chat-subtitle">
            Send an intro first. Then the owner and current tenant group chat will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="screen chat-screen">
      <div className="chat-shell chat-list-shell">
        <TopBackButton label="Back to interested houses" onClick={onBack} />

        <header className="chat-header">
          <div>
            <p className="eyebrow">Chats</p>
            <h1>House group chats</h1>
            <p className="chat-subtitle">Tap any thread to open the full conversation.</p>
          </div>

          <div className="chat-list-meta">
            <strong>{threadMatches.length}</strong>
            <span>threads</span>
          </div>
        </header>

        <ScreenFlowNav
          eyebrow="Renter flow"
          title="House chats"
          description="Return to your saved houses or open any contacted house thread from here."
          showBackButton={false}
          actions={[{ label: "Interested houses", onClick: onOpenSaved }]}
        />

        <div className="chat-thread-list chat-thread-list-scroll">
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
      </div>
    </section>
  );
}

export default GroupChatPage;
