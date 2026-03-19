import { CategoryId, MatchTarget, OwnerCandidate, OwnerListingDraft } from "../types";
import { clamp, matchReasons } from "./onboarding";

export function scoreOwnerCandidate(ownerScores: MatchTarget, candidateScores: MatchTarget) {
  const averageDifference =
    (Object.keys(ownerScores) as CategoryId[]).reduce((sum, category) => {
      return sum + Math.abs(ownerScores[category] - candidateScores[category]);
    }, 0) / 5;

  return Math.round(clamp(98 - averageDifference * 14, 72, 98));
}

export function formatOwnerRent(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(amount);
}

export function ownerListingHighlights(listing: OwnerListingDraft) {
  return [
    `${formatOwnerRent(listing.monthlyRent)} / month`,
    listing.leaseLength,
    listing.roomSize,
    listing.bills
  ];
}

export function rankOwnerCandidates(
  ownerScores: MatchTarget,
  candidates: OwnerCandidate[],
  categoryTitles: Record<CategoryId, string>
) {
  return candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreOwnerCandidate(ownerScores, candidate.compatibilityTarget),
      alignedOn: matchReasons(ownerScores, candidate.compatibilityTarget, categoryTitles)
    }))
    .sort((left, right) => right.score - left.score);
}
