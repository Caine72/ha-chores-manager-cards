import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoresManagerCorrectionCard } from "./correction-card";
import type { HomeAssistant } from "./types";

type SendMessagePromise = NonNullable<HomeAssistant["connection"]>["sendMessagePromise"];

function apiHass(): {
  hass: HomeAssistant;
  send: ReturnType<typeof vi.fn>;
  setWeekStart: (weekStart: string) => void;
} {
  let weekStart = "2026-08-15";
  const weekEnd = () => weekStart === "2026-08-21" ? "2026-08-27" : "2026-08-21";
  const windowEnd = () => weekStart === "2026-08-21" ? "2026-08-22" : "2026-08-17";
  const send = vi.fn(async (message: Record<string, unknown>) => {
    switch (message.type) {
      case "chores_manager/inventory":
        return {
          children: [{ child_id: "kid_1", name: "Alex", active: true, points_entity_id: "sensor.kid_1_weekly_points" }],
          chores: [
            { chore_id: "chore_1", title: "Make the bed", category: "Morning", points: 2, icon: "mdi:bed", active: true, sort_order: 1 },
            { chore_id: "chore_2", title: "Make breakfast", category: "Morning", points: 2, icon: "mdi:food", active: true, sort_order: 2 },
            { chore_id: "chore_3", title: "Empty dishwasher", category: "Dinner", points: 1, icon: "mdi:dishwasher", active: true, sort_order: 3 },
          ],
          assignments: [
            { assignment_id: "assignment_1", child_id: "kid_1", chore_id: "chore_1", active: true, switch_expected: true, switch_entity_id: "switch.one" },
            { assignment_id: "assignment_2", child_id: "kid_1", chore_id: "chore_2", active: true, switch_expected: true, switch_entity_id: "switch.two" },
            { assignment_id: "assignment_3", child_id: "kid_1", chore_id: "chore_3", active: true, switch_expected: true, switch_entity_id: "switch.three" },
          ],
          week: { start: weekStart, end: weekEnd() },
        };
      case "chores_manager/current_week_completions":
        return {
          window: { start: weekStart, end: windowEnd() },
          completions: [
            {
              completion_id: "completion_1",
              assignment_id: "assignment_2",
              assignment_exists: true,
              child_id: "kid_1",
              chore_id: "chore_2",
              local_date: "2026-08-17",
              completed_at: "2026-08-17T08:00:00+00:00",
              child_name: "Alex",
              chore_title: "Make breakfast",
              category: "Morning",
              points: 2,
            },
          ],
        };
      case "chores_manager/weekly_points":
        return {
          child_id: "kid_1",
          child_name: "Alex",
          points_entity_id: "sensor.kid_1_weekly_points",
          current_week: { start: weekStart, end: weekEnd(), points: 2 },
          previous_week: { start: "2026-08-08", end: "2026-08-14", points: 10 },
        };
      case "chores_manager/set_current_week_completion":
        return {
          assignment_id: message.assignment_id,
          local_date: message.local_date,
          completed: message.completed,
          completion_id: message.completed ? "completion_2" : null,
          changed: true,
        };
      default:
        throw new Error(`Unexpected command ${String(message.type)}`);
    }
  });
  return {
    hass: {
      states: {
        "sensor.kid_1_weekly_points": {
          state: "2",
          attributes: { child_id: "kid_1", kid_name: "Alex", week_start: weekStart },
        },
      },
      language: "sv",
      user: { id: "admin", is_admin: true },
      connection: { sendMessagePromise: send as SendMessagePromise },
      callService: async () => undefined,
    },
    send,
    setWeekStart: (value: string) => {
      weekStart = value;
    },
  };
}

async function settle(card: ChoresManagerCorrectionCard): Promise<void> {
  await card.updateComplete;
  await Promise.resolve();
  await card.updateComplete;
}

afterEach(() => {
  document.body.replaceChildren();
  delete (window as Window & { loadCardHelpers?: unknown }).loadCardHelpers;
});

describe("Chores Manager correction card", () => {
  it("reloads the correction window when the backend week boundary changes", async () => {
    const { hass, send, setWeekStart } = apiHass();
    const card = new ChoresManagerCorrectionCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1" });
    document.body.append(card);
    await settle(card);

    setWeekStart("2026-08-21");
    card.hass = {
      ...hass,
      states: {
        ...hass.states,
        "sensor.kid_1_weekly_points": {
          ...hass.states["sensor.kid_1_weekly_points"],
          attributes: {
            ...hass.states["sensor.kid_1_weekly_points"].attributes,
            week_start: "2026-08-21",
          },
        },
      },
    };
    await settle(card);

    expect(send.mock.calls.filter(([message]) =>
      (message as Record<string, unknown>).type === "chores_manager/current_week_completions"
    )).toHaveLength(2);
    const dateInput = card.shadowRoot?.querySelector("ha-date-input") as HTMLElement & {
      value: string;
      min: string;
      max: string;
    };
    expect(dateInput.min).toBe("2026-08-21");
    expect(dateInput.max).toBe("2026-08-22");
    expect(dateInput.value).toBe("2026-08-22");
  });

  it("loads Home Assistant's standard date input through card helpers", async () => {
    const importMoreInfoControl = vi.fn();
    (window as Window & {
      loadCardHelpers?: () => Promise<{ importMoreInfoControl: (domain: string) => void }>;
    }).loadCardHelpers = vi.fn().mockResolvedValue({ importMoreInfoControl });
    const { hass } = apiHass();
    const card = new ChoresManagerCorrectionCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1" });
    document.body.append(card);
    await Promise.resolve();
    await Promise.resolve();

    expect(importMoreInfoControl).toHaveBeenCalledWith("input_datetime");
  });

  it("can hide the outer card border", async () => {
    const { hass } = apiHass();
    const card = new ChoresManagerCorrectionCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", show_border: false });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector("ha-card")?.classList).toContain("borderless");
  });

  it("provides a visual editor and chooses a real child for new cards", () => {
    expect(ChoresManagerCorrectionCard.getConfigElement().tagName.toLowerCase()).toBe(
      "chores-manager-correction-card-editor",
    );
    const { hass } = apiHass();
    expect(ChoresManagerCorrectionCard.getStubConfig(hass).child_id).toBe("kid_1");
  });

  it("explains when the configured child no longer exists", async () => {
    const { hass, send } = apiHass();
    const card = new ChoresManagerCorrectionCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_missing", locale: "en" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector("[role=alert]")?.textContent).toContain(
      "Select an available child",
    );
    expect(send).not.toHaveBeenCalledWith(expect.objectContaining({
      type: "chores_manager/weekly_points",
      child_id: "kid_missing",
    }));
  });

  it("matches the grouped date-correction interaction", async () => {
    const { hass } = apiHass();
    const card = new ChoresManagerCorrectionCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", locale: "sv" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector(".title")?.textContent).toBe(
      "Korrigera sysslor - Alex",
    );
    expect(card.shadowRoot?.querySelector(".header-points")?.textContent).toBe("2p");
    expect(card.shadowRoot?.querySelectorAll(".group h2")).toHaveLength(2);
    expect(card.shadowRoot?.textContent).toContain("Morning");
    expect(card.shadowRoot?.textContent).toContain("Dinner");
    expect(card.shadowRoot?.querySelectorAll(".chore-row")).toHaveLength(3);
    expect(card.shadowRoot?.querySelectorAll(".chore-row .remove")).toHaveLength(1);
    expect(card.shadowRoot?.querySelectorAll(".chore-row .add")).toHaveLength(2);
    const dateInput = card.shadowRoot?.querySelector("ha-date-input") as HTMLElement & {
      value: string;
      min: string;
      max: string;
      locale: { language: string };
    };
    expect(dateInput).toBeTruthy();
    expect(dateInput.value).toBe("2026-08-17");
    expect(dateInput.min).toBe("2026-08-15");
    expect(dateInput.max).toBe("2026-08-17");
    expect(dateInput.locale.language).toBe("sv");
  });

  it("adds and removes a completion through the backend contract", async () => {
    const { hass, send } = apiHass();
    const card = new ChoresManagerCorrectionCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1" });
    document.body.append(card);
    await settle(card);

    const makeBed = card.shadowRoot?.querySelectorAll<HTMLButtonElement>(".chore-row button")[0];
    makeBed?.click();
    await settle(card);

    expect(send).toHaveBeenCalledWith({
      type: "chores_manager/set_current_week_completion",
      assignment_id: "assignment_1",
      local_date: "2026-08-17",
      completed: true,
    });
    expect(card.shadowRoot?.querySelectorAll(".chore-row .remove")).toHaveLength(2);

    const updatedMakeBed = card.shadowRoot?.querySelectorAll<HTMLButtonElement>(".chore-row button")[0];
    updatedMakeBed?.click();
    await settle(card);
    expect(send).toHaveBeenCalledWith({
      type: "chores_manager/set_current_week_completion",
      assignment_id: "assignment_1",
      local_date: "2026-08-17",
      completed: false,
    });
  });
});
