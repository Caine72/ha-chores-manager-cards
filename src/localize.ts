import type { HomeAssistant } from "./types";

type TranslationKey =
  | "chores"
  | "completed"
  | "no_chores"
  | "points"
  | "remaining"
  | "rewards"
  | "daily"
  | "history"
  | "correction"
  | "how_points_work"
  | "reward_levels";

const translations = {
  en: {
    chores: "Chores",
    completed: "Goal reached",
    no_chores: "No available chores.",
    points: "points",
    remaining: "remaining for",
    rewards: "Points & rewards",
    how_points_work: "How points work",
    reward_levels: "Rewards",
    daily: "Chores",
    history: "History",
    correction: "Correction",
  },
  sv: {
    chores: "Sysslor",
    completed: "Målet är uppnått",
    no_chores: "Inga tillgängliga sysslor.",
    points: "poäng",
    remaining: "kvar till",
    rewards: "Poäng & belöningar",
    how_points_work: "Så fungerar poängen",
    reward_levels: "Belöningar",
    daily: "Sysslor",
    history: "Historik",
    correction: "Korrigering",
  },
} as const;

export function resolveLocale(
  configLocale: "auto" | "en" | "sv" | undefined,
  hass: HomeAssistant | undefined,
): "en" | "sv" {
  if (configLocale === "en" || configLocale === "sv") {
    return configLocale;
  }
  return hass?.language?.toLowerCase().startsWith("sv") ? "sv" : "en";
}

export function localize(
  key: TranslationKey,
  configLocale: "auto" | "en" | "sv" | undefined,
  hass: HomeAssistant | undefined,
): string {
  return translations[resolveLocale(configLocale, hass)][key];
}
