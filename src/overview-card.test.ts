import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoresManagerOverviewCard } from "./overview-card";
import type { HomeAssistant } from "./types";

type SendMessagePromise = NonNullable<HomeAssistant["connection"]>["sendMessagePromise"];

function createHass(
  points: number,
  includeExtraChore = false,
  weekStart = "2026-08-15",
): HomeAssistant {
  return {
    states: {
      "switch.kid_28_make_bed": {
        state: "off",
        attributes: {
          assignment_id: "make_bed",
          child_id: "kid_28",
          title: "Make the bed",
          category: "Morning",
          points: 2,
          sort_order: 1,
        },
      },
      "switch.kid_28_clean_litter": {
        state: "off",
        attributes: {
          assignment_id: "clean_litter",
          child_id: "kid_28",
          title: "Clean the litter box",
          category: "Cat",
          points: 3,
          sort_order: 2,
        },
      },
      ...(includeExtraChore
        ? {
            "switch.kid_28_read": {
              state: "off",
              attributes: {
                assignment_id: "read",
                child_id: "kid_28",
                title: "Read a book",
                category: "School",
                points: 1,
                sort_order: 3,
              },
            },
          }
        : {}),
      "sensor.kid_28_weekly_points": {
        state: String(points),
        attributes: { child_id: "kid_28", kid_name: "Alex", week_start: weekStart },
      },
    },
    callService: vi.fn<HomeAssistant["callService"]>(),
  };
}

function createApiHass(
  canAdjust: boolean,
  sendMessagePromise?: SendMessagePromise,
): HomeAssistant {
  const send = sendMessagePromise ?? vi.fn(async (message: Record<string, unknown>) => {
    if (message.type === "chores_manager/weekly_points") {
      return {
        child_id: "kid_28",
        child_name: "Alex",
        points_entity_id: "sensor.kid_28_weekly_points",
        can_adjust: canAdjust,
        current_week: { start: "2026-08-15", end: "2026-08-21", points: 4 },
        previous_week: { start: "2026-08-08", end: "2026-08-14", points: 12 },
      };
    }
    return {
      child_id: "kid_28",
      points_entity_id: "sensor.kid_28_weekly_points",
      adjustment_id: "adjustment_1",
      requested_amount: message.amount,
      applied_amount: message.amount,
      current_points: 6,
    };
  }) as SendMessagePromise;
  return { ...createHass(4), connection: { sendMessagePromise: send } };
}

async function settle(card: ChoresManagerOverviewCard): Promise<void> {
  await card.updateComplete;
  await Promise.resolve();
  await card.updateComplete;
}

function progressStyle(card: ChoresManagerOverviewCard): string | null {
  return card.shadowRoot?.querySelector(".progress span")?.getAttribute("style") ?? null;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("Chores Manager overview card", () => {
  it("updates the progress color at configured reward levels", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createHass(4);
    card.setConfig({
      child_id: "kid_28",
      name: "Alex",
      progress_color: "#00a6d6",
      rewards: [
        { points: 20, label: "Candy", color: "#34c759" },
        { points: 30, label: "Candy and allowance", color: "#ff9f0a" },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(progressStyle(card)).toContain("background: #00a6d6");

    card.hass = createHass(20);
    await card.updateComplete;
    expect(progressStyle(card)).toContain("background: #34c759");

    card.hass = createHass(35);
    await card.updateComplete;
    expect(progressStyle(card)).toContain("background: #ff9f0a");
  });

  it("falls back to the theme color for invalid YAML colors", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createHass(20);
    card.setConfig({
      child_id: "kid_28",
      progress_color: "not-a-color",
      rewards: [{ points: 20, label: "Candy", color: "#xyzxyz" }],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(progressStyle(card)).toContain("background: var(--primary-color)");
  });

  it("uses the final configured reward label after all levels are reached", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createHass(30);
    card.setConfig({
      child_id: "kid_28",
      rewards: [
        { points: 20, label: "Candy" },
        { points: 30, label: "Candy and allowance" },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).toContain("Candy and allowance");

    card.setConfig({ child_id: "kid_28", rewards: [{ points: 20, label: " " }] });
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).toContain("Goal reached");
  });

  it("shows live chores grouped by points and configured reward levels", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createHass(4);
    card.setConfig({
      child_id: "kid_28",
      rewards: [
        {
          points: 20,
          label: "Friday candy",
          description: "Available on Friday",
        },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    const content = card.shadowRoot?.textContent;
    expect(content).toContain("Chores");
    expect(content).toContain("3 points");
    expect(content).toContain("Clean the litter box");
    expect(content).toContain("2 points");
    expect(content).toContain("Make the bed");
    expect(content).toContain("20p: Friday candy");
    expect(content).toContain("Available on Friday");

    card.hass = createHass(4, true);
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).toContain("1 points");
    expect(card.shadowRoot?.textContent).toContain("Read a book");
  });
});

describe("weekly points API", () => {
  it("reloads backend week totals when the sensor week boundary changes", async () => {
    let reads = 0;
    const sendMessagePromise = vi.fn(async () => {
      reads += 1;
      return {
        child_id: "kid_28",
        child_name: "Alex",
        points_entity_id: "sensor.kid_28_weekly_points",
        can_adjust: true,
        current_week: {
          start: reads === 1 ? "2026-08-15" : "2026-08-21",
          end: reads === 1 ? "2026-08-21" : "2026-08-27",
          points: 4,
        },
        previous_week: {
          start: reads === 1 ? "2026-08-08" : "2026-08-14",
          end: reads === 1 ? "2026-08-14" : "2026-08-20",
          points: reads === 1 ? 12 : 7,
        },
      };
    }) as SendMessagePromise;
    const initialHass = createApiHass(true, sendMessagePromise);
    const card = new ChoresManagerOverviewCard();
    card.hass = initialHass;
    card.setConfig({ child_id: "kid_28" });
    document.body.append(card);
    await settle(card);

    card.hass = {
      ...initialHass,
      states: createHass(4, false, "2026-08-21").states,
    };
    await settle(card);

    expect(sendMessagePromise).toHaveBeenCalledTimes(2);
    expect(card.shadowRoot?.querySelector(".previous-week")?.textContent).toContain("7");
  });

  it("disables subtraction when the backend-confirmed total is zero", async () => {
    const sendMessagePromise = vi.fn(async (message: Record<string, unknown>) => {
      if (message.type === "chores_manager/weekly_points") {
        return {
          child_id: "kid_28",
          child_name: "Alex",
          points_entity_id: "sensor.kid_28_weekly_points",
          can_adjust: true,
          current_week: { start: "2026-08-15", end: "2026-08-21", points: 0 },
          previous_week: { start: "2026-08-08", end: "2026-08-14", points: 12 },
        };
      }
      throw new Error(`Unexpected command ${String(message.type)}`);
    }) as SendMessagePromise;
    const card = new ChoresManagerOverviewCard();
    card.hass = createApiHass(true, sendMessagePromise);
    card.setConfig({ child_id: "kid_28" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector<HTMLButtonElement>(".subtract")?.disabled).toBe(true);
    expect(card.shadowRoot?.querySelector<HTMLButtonElement>(".add")?.disabled).toBe(false);
    expect(card.shadowRoot?.querySelector(".subtract span")?.textContent).toBe("1");
    expect(card.shadowRoot?.querySelector(".add span")?.textContent).toBe("1");
  });

  it("can hide the outer card border", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createApiHass(true);
    card.setConfig({ child_id: "kid_28", show_border: false });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector("ha-card")?.classList).toContain("borderless");
  });

  it("shows the previous-week total and authorized adjustment controls", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createApiHass(true);
    card.setConfig({ child_id: "kid_28" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector(".previous-week")?.textContent).toContain(
      "Previous week",
    );
    expect(card.shadowRoot?.querySelector(".previous-week")?.textContent).toContain("12");
    expect(card.shadowRoot?.querySelector(".compact-adjustment")).toBeTruthy();
  });

  it("omits adjustment controls when the backend denies control permission", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createApiHass(false);
    card.setConfig({ child_id: "kid_28" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector(".previous-week")).toBeTruthy();
    expect(card.shadowRoot?.querySelector(".compact-adjustment")).toBeNull();
  });

  it("submits an audited adjustment and shows the confirmed total", async () => {
    const sendMessagePromise = vi.fn(async (message: Record<string, unknown>) => {
      if (message.type === "chores_manager/weekly_points") {
        return {
          child_id: "kid_28",
          child_name: "Alex",
          points_entity_id: "sensor.kid_28_weekly_points",
          can_adjust: true,
          current_week: { start: "2026-08-15", end: "2026-08-21", points: 4 },
          previous_week: { start: "2026-08-08", end: "2026-08-14", points: 12 },
        };
      }
      return {
        child_id: "kid_28",
        points_entity_id: "sensor.kid_28_weekly_points",
        adjustment_id: "adjustment_4",
        requested_amount: 1,
        applied_amount: 1,
        current_points: 5,
      };
    }) as SendMessagePromise;
    const card = new ChoresManagerOverviewCard();
    card.hass = createApiHass(true, sendMessagePromise);
    card.setConfig({ child_id: "kid_28", rewards: [{ points: 20, label: "Reward" }] });
    document.body.append(card);
    await settle(card);

    card.shadowRoot?.querySelector<HTMLButtonElement>(".adjustment-actions .add")?.click();
    await settle(card);

    expect(sendMessagePromise).toHaveBeenLastCalledWith({
      type: "chores_manager/adjust_weekly_points",
      child_id: "kid_28",
      amount: 1,
    });
    expect(card.shadowRoot?.querySelector(".points-row strong")?.textContent).toContain(
      "5 / 20 points",
    );
  });

  it("localizes API failures in Swedish", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = {
      ...createHass(4),
      language: "sv",
      connection: { sendMessagePromise: vi.fn().mockRejectedValue(new Error("failed")) },
    };
    card.setConfig({ child_id: "kid_28", locale: "auto" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector(".api-error")?.textContent).toContain(
      "Veckopoängen kunde inte hämtas.",
    );
  });
});

describe("overview action buttons", () => {
  it("renders configured buttons and only adds the divider when one is visible", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = { ...createHass(4), user: { id: "parent", is_admin: true } };
    card.setConfig({
      child_id: "kid_28",
      buttons: [
        { label: "Chores", icon: "mdi:format-list-checks", color: "#00bcd4" },
        {
          label: "Correction",
          icon: "mdi:wrench-cog",
          color: "#9c27b0",
          visibility: { mode: "allow-list", users: ["other-parent"] },
        },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelectorAll(".actions button")).toHaveLength(1);
    expect(card.shadowRoot?.querySelector(".button-divider")).toBeTruthy();
    expect(card.shadowRoot?.querySelector(".actions ha-icon")?.getAttribute("icon")).toBe("mdi:format-list-checks");

    card.hass = { ...createHass(4), user: { id: "child", is_admin: false } };
    card.setConfig({
      child_id: "kid_28",
      buttons: [
        {
          label: "Correction",
          icon: "mdi:wrench-cog",
          color: "#9c27b0",
          visibility: { mode: "administrators" },
        },
      ],
    });
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".actions")).toBeNull();
    expect(card.shadowRoot?.querySelector(".button-divider")).toBeNull();
  });

  it("keeps legacy actions working when buttons are absent", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createHass(4);
    card.setConfig({
      child_id: "kid_28",
      daily_action: { action: "navigate", navigation_path: "/chores" },
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelectorAll(".actions button")).toHaveLength(1);
    expect(card.shadowRoot?.textContent).toContain("Chores");
  });
});

  it("uses named colors and a derived darker progress track", async () => {
    const card = new ChoresManagerOverviewCard();
    card.hass = createHass(0);
    card.setConfig({
      child_id: "kid_28",
      progress_color: "amber",
      rewards: [{ points: 10, label: "Reward", color: "green" }],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(progressStyle(card)).toContain("background: #ffc107");
    expect(card.shadowRoot?.querySelector(".progress")?.getAttribute("style")).toContain(
      "color-mix(in srgb, #ffc107 22%",
    );

    card.hass = createHass(10);
    await card.updateComplete;
    expect(progressStyle(card)).toContain("background: #4caf50");
  });

describe("overview visibility modes", () => {
  it.each([
    ["all", { id: "child", is_admin: false }, [], true],
    ["administrators", { id: "parent", is_admin: true }, [], true],
    ["administrators", { id: "child", is_admin: false }, [], false],
    ["allow-list", { id: "parent", is_admin: false }, ["parent"], true],
    ["allow-list", { id: "tablet", is_admin: false }, ["parent"], false],
    ["deny-list", { id: "parent", is_admin: false }, ["tablet"], true],
    ["deny-list", { id: "tablet", is_admin: false }, ["tablet"], false],
  ] as const)("applies %s visibility", async (mode, user, users, visible) => {
    const card = new ChoresManagerOverviewCard();
    card.hass = { ...createHass(4), user };
    card.setConfig({
      child_id: "kid_28",
      buttons: [
        {
          label: "Correction",
          icon: "mdi:wrench-cog",
          color: "#9c27b0",
          visibility: { mode, users: [...users] },
        },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelectorAll(".actions button")).toHaveLength(visible ? 1 : 0);
  });
});
