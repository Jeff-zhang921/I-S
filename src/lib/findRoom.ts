import { FiltersState, MatchTarget, RoommateMatch } from "../types";
import { clamp } from "./onboarding";

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPerPersonMonthly(amount: number) {
  return `${formatPrice(amount)} per person / per month`;
}

export function formatMoveIn(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function toggleAmenity(current: string[], amenity: string) {
  return current.includes(amenity)
    ? current.filter((item) => item !== amenity)
    : [...current, amenity];
}

export function getOccupantCount(occupantsLabel: string) {
  const match = occupantsLabel.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function getFilteredMatches<T extends RoommateMatch>(matches: T[], filters: FiltersState): T[] {
  return matches.filter((match) => {
    if (match.monthlyRent > filters.maxRent) {
      return false;
    }

    if (match.commuteMinutes > filters.maxCommute) {
      return false;
    }

    if (filters.petFriendly === "yes" && !match.petFriendly) {
      return false;
    }

    if (filters.petFriendly === "no" && match.petFriendly) {
      return false;
    }

    if (filters.amenities.length && !filters.amenities.every((amenity) => match.amenities.includes(amenity as never))) {
      return false;
    }

    return true;
  });
}

export function scoreRoomMatch(userScores: MatchTarget, targetScores: MatchTarget, filters: FiltersState, match: RoommateMatch) {
  const categoryDifference = (Object.keys(userScores) as Array<keyof MatchTarget>).reduce((sum, key) => {
    return sum + Math.abs(userScores[key] - targetScores[key]);
  }, 0) / 5;

  let score = Math.round(96 - categoryDifference * 16);

  if (match.monthlyRent <= filters.maxRent - 100) {
    score += 2;
  }

  if (match.commuteMinutes <= filters.maxCommute - 10) {
    score += 2;
  }

  if (filters.petFriendly === "yes" && match.petFriendly) {
    score += 2;
  }

  if (filters.petFriendly === "no" && !match.petFriendly) {
    score += 2;
  }

  if (filters.amenities.length >= 2 && filters.amenities.every((amenity) => match.amenities.includes(amenity as never))) {
    score += 2;
  }

  return clamp(score, 68, 98);
}
