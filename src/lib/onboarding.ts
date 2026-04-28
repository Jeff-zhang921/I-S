import {
  CategoryId,
  MatchTarget,
  PrivacyLevel,
  PrivacyLevelOption,
  ProfileNotesState,
  Question,
  QuizAnswers
} from "../types";
import { privacyLevelOptions } from "../data/onboarding";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function validateAccount(account: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  if (!account.fullName.trim() || !account.email.trim() || !account.phone.trim() || !account.password.trim()) {
    return "Complete name, email, phone, and password before moving on.";
  }

  if (!/\S+@\S+\.\S+/.test(account.email)) {
    return "Use a valid email address for the prototype sign-up.";
  }

  if (account.phone.replace(/\D/g, "").length < 10) {
    return "Enter a phone number with at least 10 digits.";
  }

  if (account.password.trim().length < 8) {
    return "Use at least 8 characters for the prototype password.";
  }

  return "";
}

export function validateTargetCity(targetCity: string) {
  if (!targetCity.trim()) {
    return "Enter the target city before continuing.";
  }

  if (targetCity.trim().length < 2) {
    return "Use a real city name so the onboarding state can carry it forward.";
  }

  return "";
}

export function validateEditableProfile(profile: {
  fullName: string;
  email: string;
  phone: string;
  targetCity: string;
}) {
  if (!profile.fullName.trim() || !profile.email.trim() || !profile.phone.trim() || !profile.targetCity.trim()) {
    return "Complete name, email, phone, and target city before saving the profile.";
  }

  if (!/\S+@\S+\.\S+/.test(profile.email)) {
    return "Use a valid email address before saving profile changes.";
  }

  if (profile.phone.replace(/\D/g, "").length < 10) {
    return "Enter a phone number with at least 10 digits before saving profile changes.";
  }

  return validateTargetCity(profile.targetCity);
}

export function isQuestionVisible(question: Question, privacyLevel: PrivacyLevel) {
  if (question.category !== "privacy") {
    return true;
  }

  return question.privacyLevels?.includes(privacyLevel) ?? true;
}

export function isQuestionAnswered(
  question: Question,
  answers: QuizAnswers,
  profileNotes: ProfileNotesState
) {
  if (question.type === "text") {
    return profileNotes[question.field].trim().length > 0;
  }

  return typeof answers[question.id] === "number";
}

export function getCategoryQuestionCounts(questions: Question[]) {
  return questions.reduce<Record<CategoryId, number>>(
    (counts, question) => {
      counts[question.category] += 1;
      return counts;
    },
    {
      basics: 0,
      lifestyle: 0,
      interests: 0,
      dealbreakers: 0,
      privacy: 0
    }
  );
}

export function getCategoryAverage(categoryId: CategoryId, answers: QuizAnswers, questions: Question[]) {
  const answeredScores = questions
    .filter((question) => question.category === categoryId && question.type === "scale")
    .map((question) => answers[question.id])
    .filter((score): score is number => typeof score === "number");

  if (!answeredScores.length) {
    return 0;
  }

  const total = answeredScores.reduce((sum, score) => sum + score, 0);
  return Number((total / answeredScores.length).toFixed(1));
}

export function describeCategoryScore(score: number) {
  if (score >= 4.5) {
    return "Very strong";
  }

  if (score >= 3.8) {
    return "Strong";
  }

  if (score >= 3) {
    return "Balanced";
  }

  if (score >= 2.2) {
    return "Light";
  }

  return "Low";
}

export function parseProfileList(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getPrivacyLevelMeta(level: PrivacyLevel): PrivacyLevelOption {
  return privacyLevelOptions.find((option) => option.value === level) ?? privacyLevelOptions[1];
}

export function describeMatchScore(score: number) {
  if (score >= 92) {
    return "Very close fit";
  }

  if (score >= 84) {
    return "Strong fit";
  }

  if (score >= 76) {
    return "Good fit";
  }

  return "Possible fit";
}

export function matchReasons(userScores: MatchTarget, targetScores: MatchTarget, titles: Record<CategoryId, string>) {
  return (Object.keys(userScores) as CategoryId[])
    .map((category) => ({
      title: titles[category],
      diff: Math.abs(userScores[category] - targetScores[category])
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 2)
    .map((item) => item.title)
    .join(" + ");
}
