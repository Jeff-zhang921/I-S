import { GroupChatThread, ScoredOwnerCandidate } from "../../types";

type OwnerGroupChatPageProps = {
  threadCandidates: ScoredOwnerCandidate[];
  activeCandidateId: string | null;
  getThread: (candidateId: string) => GroupChatThread | null;
  onOpenThread: (candidateId: string) => void;
};

function OwnerGroupChatPage({ threadCandidates, activeCandidateId, getThread, onOpenThread }: OwnerGroupChatPageProps) {
  if (!threadCandidates.length) {
    return (
      <section className="screen chat-screen">
        <div className="chat-shell chat-empty-shell">
          <p className="eyebrow">Chats</p>
          <h1>No renter chats yet.</h1>
          <p className="chat-subtitle">Send an intro first. Once a renter is contacted, the owner-side chat thread will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="screen chat-screen">
      <div className="chat-shell chat-list-shell">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Chats</p>
            <h1>Renter conversations</h1>
            <p className="chat-subtitle">Open any contacted renter to continue the conversation.</p>
          </div>

          <div className="chat-list-meta">
            <strong>{threadCandidates.length}</strong>
            <span>threads</span>
          </div>
        </header>

        <div className="chat-thread-list chat-thread-list-scroll">
          {threadCandidates.map((candidate) => {
            const thread = getThread(candidate.id);
            const lastMessage = thread?.messages[thread.messages.length - 1];

            return (
              <button
                key={candidate.id}
                type="button"
                className={candidate.id === activeCandidateId ? "chat-thread-item active" : "chat-thread-item"}
                onClick={() => onOpenThread(candidate.id)}
              >
                <div className="chat-thread-top">
                  <strong>{candidate.name}</strong>
                  <span>{candidate.score}% fit</span>
                </div>
                <p className="chat-thread-preview">{lastMessage?.body ?? "No messages yet."}</p>
                <div className="chat-thread-meta">
                  <span>
                    {candidate.major} | {candidate.moveInWindow}
                  </span>
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

export default OwnerGroupChatPage;
