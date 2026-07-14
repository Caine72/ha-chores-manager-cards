import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoresManagerOverviewCard } from "./overview-card";
import type { HomeAssistant } from "./types";

function createHass(points: number, includeExtraChore = false): HomeAssistant {
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
        attributes: { child_id: "kid_28", kid_name: "Alex" },
      },
    },
    callService: vi.fn<HomeAssistant["callService"]>(),
  };
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
