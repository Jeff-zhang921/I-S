import { flatmateProfilesByMatchId, listingMetaByMatchId } from "../data/findRoom";
import { roomDetailById } from "../data/roomDetails";
import {
  FiltersState,
  FlatmateLifeStage,
  FlatmateProfile,
  HabitKey,
  HouseEnergy,
  ListingMeta,
  MatchInsightLine,
  MatchTarget,
  MoveInTiming,
  ProfileNotesState,
  RoommateMatch,
  ScoredRoomMatch
} from "../types";
import { clamp, parseProfileList } from "./onboarding";

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

export function toggleStringFilter<T extends string>(current: T[], value: T): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export function getOccupantCount(occupantsLabel: string) {
  const match = occupantsLabel.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function getFlatmateProfile(matchId: string): FlatmateProfile {
  return flatmateProfilesByMatchId[matchId];
}

export function getListingMeta(matchId: string): ListingMeta {
  return listingMetaByMatchId[matchId];
}

export function getLifeStageFieldLabel(lifeStage: FlatmateLifeStage) {
  return lifeStage === "student" ? "Course" : "Job";
}

export function getLifeStageBadgeLabel(lifeStage: FlatmateLifeStage) {
  return lifeStage === "student" ? "Student" : "Professional";
}

export function describeHouseEnergy(energy: HouseEnergy) {
  switch (energy) {
    case "quiet":
      return "Quiet house";
    case "social":
      return "Social house";
    default:
      return "Balanced house";
  }
}

export function describeResidentMix(residentMix: ListingMeta["residentMix"]) {
  switch (residentMix) {
    case "students":
      return "Students only";
    case "professionals":
      return "Professionals only";
    default:
      return "Mixed household";
  }
}

export function describeMoveInTiming(moveInTiming: MoveInTiming) {
  switch (moveInTiming) {
    case "available_now":
      return "Available now";
    case "within_month":
      return "Within 1 month";
    case "later":
      return "Later this term";
    default:
      return "Any time";
  }
}

export function getHabitAxisLabels(habit: HabitKey) {
  switch (habit) {
    case "cleanliness":
      return { min: "Relaxed", max: "Neat freak" };
    case "sleep":
      return { min: "Night owl", max: "Early bird" };
    case "noise":
      return { min: "Library quiet", max: "Social house" };
  }
}

export function getHabitDescriptor(habit: HabitKey, value: number) {
  if (habit === "cleanliness") {
    if (value >= 5) {
      return "Neat freak";
    }
    if (value >= 4) {
      return "Very tidy";
    }
    if (value >= 3) {
      return "Balanced";
    }
    return "Relaxed";
  }

  if (habit === "sleep") {
    if (value >= 5) {
      return "Early bird";
    }
    if (value >= 4) {
      return "Mostly early";
    }
    if (value >= 3) {
      return "Flexible";
    }
    return "Night owl";
  }

  if (value >= 5) {
    return "Social house";
  }
  if (value >= 4) {
    return "Lively";
  }
  if (value >= 3) {
    return "Balanced";
  }
  return "Library quiet";
}

export function getHabitProgress(value: number) {
  return clamp(((value - 1) / 4) * 100, 0, 100);
}

function matchesLocationQuery(match: RoommateMatch, filters: FiltersState) {
  const query = filters.locationQuery.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const meta = getListingMeta(match.id);
  const directText = [match.roomTitle, match.neighborhood].join(" ").toLowerCase();
  if (directText.includes(query)) {
    return true;
  }

  const nearbyText = meta.locationTags.join(" ").toLowerCase();
  return nearbyText.includes(query) && meta.distanceMiles <= filters.radiusMiles;
}

export function getFilteredMatches<T extends RoommateMatch>(matches: T[], filters: FiltersState): T[] {
  return matches.filter((match) => {
    const meta = getListingMeta(match.id);
    const flatmateProfile = getFlatmateProfile(match.id);
    const occupantCount = getOccupantCount(roomDetailById[match.id]?.currentOccupants ?? "");

    if (match.monthlyRent < filters.minRent || match.monthlyRent > filters.maxRent) {
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

    if (!matchesLocationQuery(match, filters)) {
      return false;
    }

    if (filters.moveInTiming !== "any" && meta.moveInCategory !== filters.moveInTiming) {
      return false;
    }

    if (filters.houseTypes.length && !filters.houseTypes.includes(meta.houseType)) {
      return false;
    }

    if (occupantCount < filters.occupantCountMin || occupantCount > filters.occupantCountMax) {
      return false;
    }

    if (filters.professionalsOnly && meta.residentMix !== "professionals") {
      return false;
    }

    if (filters.quietHouse && meta.houseEnergy !== "quiet") {
      return false;
    }

    if (filters.socialHouse && meta.houseEnergy !== "social") {
      return false;
    }

    if (filters.amenities.length && !filters.amenities.every((amenity) => match.amenities.includes(amenity as never))) {
      return false;
    }

    if (filters.professionalsOnly && flatmateProfile.lifeStage !== "professional") {
      return false;
    }

    return true;
  });
}

export function scoreRoomMatch(userScores: MatchTarget, targetScores: MatchTarget, filters: FiltersState, match: RoommateMatch) {
  const categoryDifference = (Object.keys(userScores) as Array<keyof MatchTarget>).reduce((sum, key) => {
    return sum + Math.abs(userScores[key] - targetScores[key]);
  }, 0) / 5;

  const meta = getListingMeta(match.id);
  const profile = getFlatmateProfile(match.id);
  let score = Math.round(96 - categoryDifference * 16);

  if (match.monthlyRent <= filters.maxRent - 100) {
    score += 2;
  }

  if (match.monthlyRent >= filters.minRent) {
    score += 1;
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

  if (filters.locationQuery.trim() && matchesLocationQuery(match, filters)) {
    score += 2;
  }

  if (filters.moveInTiming !== "any" && meta.moveInCategory === filters.moveInTiming) {
    score += 2;
  }

  if (filters.houseTypes.length && filters.houseTypes.includes(meta.houseType)) {
    score += 2;
  }

  if (filters.professionalsOnly && profile.lifeStage === "professional") {
    score += 2;
  }

  if (filters.quietHouse && meta.houseEnergy === "quiet") {
    score += 2;
  }

  if (filters.socialHouse && meta.houseEnergy === "social") {
    score += 2;
  }

  if (filters.amenities.length >= 2 && filters.amenities.every((amenity) => match.amenities.includes(amenity as never))) {
    score += 2;
  }

  return clamp(score, 68, 99);
}

export function getCompatibilityBadge(score: number) {
  if (score >= 90) {
    return "High compatibility";
  }

  if (score >= 80) {
    return "Medium compatibility";
  }

  return "Lower compatibility";
}

function buildLifestyleInsight(match: RoommateMatch, userScores: MatchTarget) {
  const meta = getListingMeta(match.id);
  const flatmateProfile = getFlatmateProfile(match.id);

  if (meta.houseEnergy === "quiet" && flatmateProfile.habits.sleep >= 4) {
    return {
      label: "You both lean toward a quieter house and earlier routines.",
      status: "positive" as const
    };
  }

  if (meta.houseEnergy === "social" && flatmateProfile.habits.noise >= 4) {
    return {
      label: "This match suits renters who want a social house with shared plans and a livelier vibe.",
      status: userScores.lifestyle >= 3 ? "positive" as const : "negative" as const
    };
  }

  return {
    label: "Shared-space expectations look balanced, with similar expectations around routine and respect.",
    status: "positive" as const
  };
}

function buildDealbreakerInsight(match: RoommateMatch, profileNotes: ProfileNotesState) {
  const detail = roomDetailById[match.id];
  const detailText = [
    match.roomTitle,
    match.roommate.vibe,
    match.roommate.bio,
    ...match.whyMatch,
    ...match.amenities,
    ...getListingMeta(match.id).locationTags,
    ...detail.houseRules,
    ...detail.houseHighlights,
    ...detail.idealFor
  ]
    .join(" ")
    .toLowerCase();

  const dealbreakers = parseProfileList(profileNotes.dealbreakers);
  const mustHaves = parseProfileList(profileNotes.mustHaves);
  const signals: string[] = [];

  dealbreakers.forEach((item) => {
    const normalized = item.toLowerCase();
    if (normalized.includes("smok")) {
      signals.push("non-smoking rules are already explicit");
    } else if (normalized.includes("pet")) {
      signals.push(match.petFriendly ? "pet policy is compatible" : "no-pet setup is explicit");
    } else if (normalized.includes("quiet")) {
      signals.push(getListingMeta(match.id).houseEnergy === "quiet" ? "quiet-house preference is met" : "");
    } else if (detailText.includes(normalized)) {
      signals.push(`"${item}" appears in the listing details`);
    }
  });

  mustHaves.forEach((item) => {
    const normalized = item.toLowerCase();
    if (normalized.includes("clean") || normalized.includes("tidy")) {
      signals.push(getFlatmateProfile(match.id).habits.cleanliness >= 4 ? "cleanliness expectations are strong" : "");
    } else if (normalized.includes("quiet")) {
      signals.push(getListingMeta(match.id).houseEnergy === "quiet" ? "quiet-home must-have is covered" : "");
    } else if (normalized.includes("pet")) {
      signals.push(match.petFriendly ? "pet-friendly must-have is covered" : "");
    }
  });

  const filteredSignals = signals.filter(Boolean);
  if (filteredSignals.length) {
    return {
      label: `Passes your key dealbreakers: ${filteredSignals.slice(0, 2).join(", ")}.`,
      status: "positive" as const
    };
  }

  return {
    label: "No obvious clashes show up against your saved dealbreakers and must-haves.",
    status: "positive" as const
  };
}

export function buildMatchInsights(
  match: ScoredRoomMatch,
  filters: FiltersState,
  userScores: MatchTarget,
  profileNotes: ProfileNotesState
) {
  const budgetLine: MatchInsightLine = {
    label:
      match.monthlyRent >= filters.minRent && match.monthlyRent <= filters.maxRent
        ? `Matches your budget range of ${formatPrice(filters.minRent)} to ${formatPrice(filters.maxRent)} per month.`
        : `Sits outside your budget range of ${formatPrice(filters.minRent)} to ${formatPrice(filters.maxRent)} per month.`,
    status: match.monthlyRent >= filters.minRent && match.monthlyRent <= filters.maxRent ? "positive" : "negative"
  };

  return {
    badge: getCompatibilityBadge(match.score),
    lines: [budgetLine, buildLifestyleInsight(match, userScores), buildDealbreakerInsight(match, profileNotes)]
  };
}
