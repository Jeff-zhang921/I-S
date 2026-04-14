import { useEffect, useRef } from "react";
import StatusBanner from "../../components/StatusBanner";
import TopBackButton from "../../components/TopBackButton";
import { GroupChatThread, OwnerListingDraft, ScoredOwnerCandidate, StatusState } from "../../types";

type OwnerChatThreadPageProps = {
  listing: OwnerListingDraft;
  candidate: ScoredOwnerCandidate | null;
  activeThread: GroupChatThread | null;
  draft: string;
  status: StatusState;
  onBack: () => void;
  onOpenCandidate: () => void;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
};

function OwnerChatThreadPage({
  listing,
  candidate,
  activeThread,
  draft,
  status,
  onBack,
  onOpenCandidate,
  onChangeDraft,
  onSend
}: OwnerChatThreadPageProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeThread) {
      return;
    }

    const scrollToLatest = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    };

    const frameId = window.requestAnimationFrame(scrollToLatest);
    return () => window.cancelAnimationFrame(frameId);
  }, [activeThread?.matchId, activeThread?.messages.length]);

  if (!candidate || !activeThread) {
    return (
      <section className="screen chat-screen">
        <div className="chat-shell chat-empty-shell">
          <TopBackButton label="Back to chats" onClick={onBack} />

          <h3>No chat selected.</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="screen chat-screen">
      <div className="chat-shell chat-thread-shell">
        <TopBackButton label="Back to chats" onClick={onBack} />

        <header className="chat-thread-toolbar">
          <div className="chat-thread-title-block">
            <h1>{activeThread.title}</h1>
            <p className="chat-thread-context">
              {listing.title} | {activeThread.participants.length} people
            </p>
          </div>
          <button type="button" className="secondary-button chat-toolbar-button" onClick={onOpenCandidate}>
            Profile
          </button>
        </header>

        <div className="tag-preview chat-participant-strip">
          {activeThread.participants.map((participant) => (
            <span key={participant.id} className="tag-chip">
              {participant.name}
            </span>
          ))}
        </div>

        <div className="chat-thread-body">
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
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          <div className="chat-composer chat-composer-bar">
            {status.kind === "error" ? <StatusBanner status={status} /> : null}
            <div className="chat-compose-row">
              <input
                type="text"
                className="chat-input"
                value={draft}
                onChange={(event) => onChangeDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSend();
                  }
                }}
                placeholder={`Message ${candidate.name}...`}
                aria-label={`Message ${candidate.name}`}
              />
              <button
                type="button"
                className="chat-send-button"
                onClick={onSend}
                disabled={!draft.trim()}
                aria-label="Send message"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OwnerChatThreadPage;
