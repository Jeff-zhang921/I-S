import { GroupChatThread, RoommateMatch } from "../types";
import { roomMatches } from "./findRoom";

const ownerProfiles: Record<string, { name: string; label: string }> = {
  "rm-101": { name: "Claire Woods", label: "Owner" },
  "rm-102": { name: "Martin Cole", label: "Owner" },
  "rm-103": { name: "Tanya Holt", label: "Owner" },
  "rm-104": { name: "Lewis Grant", label: "Owner" },
  "rm-105": { name: "Hannah Price", label: "Owner" },
  "rm-106": { name: "Oliver Kent", label: "Owner" },
  "rm-107": { name: "Sabrina Hall", label: "Owner" },
  "rm-108": { name: "Marcus Webb", label: "Owner" },
  "rm-109": { name: "Jade Foster", label: "Owner" },
  "rm-110": { name: "Derek Lowe", label: "Owner" },
  "rm-111": { name: "Ava Turner", label: "Owner" },
  "rm-112": { name: "Helen Brooks", label: "Owner" }
};

function formatRent(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(amount);
}

function buildThread(match: RoommateMatch): GroupChatThread {
  const owner = ownerProfiles[match.id];
  const ownerId = `${match.id}-owner`;
  const roommateId = `${match.id}-roommate`;

  return {
    matchId: match.id,
    title: `${match.neighborhood} house group`,
    participants: [
      {
        id: ownerId,
        name: owner.name,
        role: "owner",
        label: owner.label
      },
      {
        id: roommateId,
        name: match.roommate.name,
        role: "roommate",
        label: "Current tenant"
      }
    ],
    messages: [
      {
        id: `${match.id}-m1`,
        senderId: ownerId,
        body: `Hi everyone, this thread is for ${match.roomTitle}. Rent is ${formatRent(match.monthlyRent)} and the target move-in is ${match.moveIn}.`,
        sentAt: "9:10 AM"
      },
      {
        id: `${match.id}-m2`,
        senderId: roommateId,
        body: `I am the current tenant on this listing. Happy to answer questions about the flat, commute, and how the house usually runs.`,
        sentAt: "9:14 AM"
      },
      {
        id: `${match.id}-m3`,
        senderId: ownerId,
        body: `Use this group chat for viewing slots, house rules, and anything practical before you decide.`,
        sentAt: "9:18 AM"
      }
    ]
  };
}

export const groupChatThreads = roomMatches.reduce<Record<string, GroupChatThread>>((threads, match) => {
  threads[match.id] = buildThread(match);
  return threads;
}, {});

const autoReplyTemplates = [
  "That works. We can keep discussing details here and line up a viewing time after.",
  "Thanks for the message. I can answer that here, and the current tenant can jump in too.",
  "Noted. This group is the quickest place to sort out viewing logistics and house questions.",
  "Sounds good. If you have questions about bills, house rules, or move-in timing, send them here."
];

export function buildFakeGroupReply(match: RoommateMatch, messageCount: number) {
  const ownerId = `${match.id}-owner`;

  return {
    id: `${match.id}-auto-${messageCount + 1}`,
    senderId: ownerId,
    body: autoReplyTemplates[messageCount % autoReplyTemplates.length],
    sentAt: "Just now"
  };
}
