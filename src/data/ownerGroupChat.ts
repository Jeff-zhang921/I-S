import { ChatMessage, GroupChatThread, OwnerCandidate } from "../types";
import { initialOwnerListing, ownerCandidateMatches } from "./ownerRoom";

const flatmateProfiles: Record<string, { name: string; label: string }> = {
  "oc-101": { name: "Talia Green", label: "Current flatmate" },
  "oc-102": { name: "Noah Reed", label: "Current flatmate" },
  "oc-103": { name: "Erin Scott", label: "Current flatmate" },
  "oc-104": { name: "Mason Bell", label: "Current flatmate" },
  "oc-105": { name: "Priya Shah", label: "Current flatmate" },
  "oc-106": { name: "Luca Evans", label: "Current flatmate" }
};

function buildOwnerThread(candidate: OwnerCandidate): GroupChatThread {
  const flatmate = flatmateProfiles[candidate.id];
  const candidateId = `${candidate.id}-candidate`;
  const flatmateId = `${candidate.id}-flatmate`;

  return {
    matchId: candidate.id,
    title: `${candidate.name} chat`,
    participants: [
      {
        id: candidateId,
        name: candidate.name,
        role: "roommate",
        label: "Potential roommate"
      },
      {
        id: flatmateId,
        name: flatmate.name,
        role: "roommate",
        label: flatmate.label
      }
    ],
    messages: [
      {
        id: `${candidate.id}-m1`,
        senderId: flatmateId,
        body: `This thread is for ${initialOwnerListing.title}. We usually use it to sort out viewing times, house questions, and move-in details.`,
        sentAt: "10:08 AM"
      },
      {
        id: `${candidate.id}-m2`,
        senderId: candidateId,
        body: `Thanks, I am still interested in the room in ${initialOwnerListing.neighborhood}. Happy to chat here about timing and house setup.`,
        sentAt: "10:12 AM"
      }
    ]
  };
}

export const ownerGroupChatThreads = ownerCandidateMatches.reduce<Record<string, GroupChatThread>>((threads, candidate) => {
  threads[candidate.id] = buildOwnerThread(candidate);
  return threads;
}, {});

const candidateReplyTemplates = [
  "That works for me. I can share a few time slots for a viewing later today.",
  "Thanks. I am happy to answer more about budget, routine, or move-in timing here.",
  "Sounds good. This thread is easiest for me if we want to sort logistics before meeting.",
  "I am still very interested. Let me know what details about the house matter most to you."
];

const flatmateReplyTemplates = [
  "From the current flatmate side, I can answer questions about the weekly routine and how the shared spaces work.",
  "I can also jump in on practical questions about guests, cleaning, and how quiet the flat usually is.",
  "If you want, we can use this thread to settle bills, house rules, and viewing expectations first.",
  "Happy to help here as well. It is easier if we keep the logistics in one thread."
];

export function buildFakeOwnerGroupReply(candidate: OwnerCandidate, messageCount: number): ChatMessage {
  const fromCandidate = messageCount % 2 === 0;

  return {
    id: `${candidate.id}-auto-${messageCount + 1}`,
    senderId: fromCandidate ? `${candidate.id}-candidate` : `${candidate.id}-flatmate`,
    body: fromCandidate
      ? candidateReplyTemplates[messageCount % candidateReplyTemplates.length]
      : flatmateReplyTemplates[messageCount % flatmateReplyTemplates.length],
    sentAt: "Just now"
  };
}
