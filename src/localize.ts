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
  | "reward_levels"
  | "previous_week"
  | "adjust_points"
  | "adjustment_amount"
  | "adjustment_reason"
  | "add_points"
  | "subtract_points"
  | "adjustment_error"
  | "weekly_points_error"
  | "correction_error"
  | "correction_child_not_found"
  | "previous_date"
  | "next_date"
  | "choose_date"
  | "close"
  | "back"
  | "correct_chores"
  | "adjust"
  | "show"
  | "add_completion"
  | "remove_completion"
  | "weekly_chores"
  | "history_error"
  | "history_empty"
  | "total"
  | "claimed_by";

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
    previous_week: "Previous week",
    adjust_points: "Adjust points",
    adjustment_amount: "Amount",
    adjustment_reason: "Reason (optional)",
    add_points: "Add points",
    subtract_points: "Subtract points",
    adjustment_error: "The point adjustment could not be saved.",
    weekly_points_error: "Weekly totals could not be loaded.",
    correction_error: "Correction data could not be loaded.",
    correction_child_not_found: "This child no longer exists. Select an available child in the card editor.",
    previous_date: "Previous date",
    next_date: "Next date",
    choose_date: "Choose date",
    close: "Close",
    back: "Back",
    correct_chores: "Correct chores",
    adjust: "Adjust",
    show: "View",
    add_completion: "Add completion",
    remove_completion: "Remove completion",
    weekly_chores: "Weekly chores",
    history_error: "Chore history could not be loaded.",
    history_empty: "No chores logged this week.",
    total: "Total",
    claimed_by: "Claimed by",
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
    previous_week: "Förra veckan",
    adjust_points: "Justera poäng",
    adjustment_amount: "Antal",
    adjustment_reason: "Orsak (valfri)",
    add_points: "Lägg till poäng",
    subtract_points: "Dra av poäng",
    adjustment_error: "Poängjusteringen kunde inte sparas.",
    weekly_points_error: "Veckopoängen kunde inte hämtas.",
    correction_error: "Korrigeringsdata kunde inte hämtas.",
    correction_child_not_found: "Barnet finns inte längre. Välj ett tillgängligt barn i kortets redigerare.",
    previous_date: "Föregående datum",
    next_date: "Nästa datum",
    choose_date: "Välj datum",
    close: "Stäng",
    back: "Tillbaka",
    correct_chores: "Korrigera sysslor",
    adjust: "Justera",
    show: "Visa",
    add_completion: "Lägg till genomförd syssla",
    remove_completion: "Ta bort genomförd syssla",
    weekly_chores: "Veckans sysslor",
    history_error: "Historiken kunde inte hämtas.",
    history_empty: "Inga sysslor registrerade den här veckan.",
    total: "Totalt",
    claimed_by: "Tagen av",
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
