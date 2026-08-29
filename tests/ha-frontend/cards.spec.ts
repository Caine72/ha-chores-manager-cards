import { expect, test } from "@playwright/test";
import { fileURLToPath } from "node:url";

const bundlePath = fileURLToPath(
  new URL("../../dist/ha-chores-manager-cards.js", import.meta.url),
);

test("registers and renders every card and editor in Home Assistant", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/", { waitUntil: "networkidle" });
  await page.addScriptTag({ path: bundlePath });

  const result = await page.evaluate(async () => {
    const cardTypes = [
      "chores-manager-daily-card",
      "chores-manager-overview-card",
      "chores-manager-history-card",
      "chores-manager-correction-card",
    ];
    const editorTypes = cardTypes.map((type) => `${type}-editor`);
    const completion = {
      completion_id: "completion_1",
      assignment_id: "assignment_1",
      assignment_exists: true,
      child_id: "kid_1",
      chore_id: "chore_1",
      local_date: "2026-08-23",
      completed_at: "2026-08-23T08:00:00+00:00",
      child_name: "Acceptance Avery",
      chore_title: "Test chore",
      category: "Morning",
      points: 2,
    };
    const weeklyPoints = {
      child_id: "kid_1",
      child_name: "Acceptance Avery",
      points_entity_id: "sensor.kid_1_weekly_points",
      current_week: { start: "2026-08-22", end: "2026-08-28", points: 7 },
      previous_week: { start: "2026-08-15", end: "2026-08-21", points: 5 },
    };
    const inventory = {
      children: [{
        child_id: "kid_1",
        name: "Acceptance Avery",
        active: true,
        points_entity_id: "sensor.kid_1_weekly_points",
      }],
      chores: [{
        chore_id: "chore_1",
        title: "Test chore",
        category: "Morning",
        points: 2,
        icon: "mdi:bed",
        active: true,
        sort_order: 1,
      }],
      assignments: [{
        assignment_id: "assignment_1",
        child_id: "kid_1",
        chore_id: "chore_1",
        active: true,
        switch_expected: true,
        switch_entity_id: "switch.kid_1_chore_1",
      }],
      week: { start: "2026-08-22", end: "2026-08-28" },
    };
    const connection = {
      sendMessagePromise: async (message: Record<string, unknown>) => {
        switch (message.type) {
          case "chores_manager/inventory":
            return inventory;
          case "chores_manager/current_week_completions":
            return {
              window: { start: "2026-08-22", end: "2026-08-23" },
              completions: [completion],
            };
          case "chores_manager/current_week_history":
            return {
              ...weeklyPoints,
              window: { start: "2026-08-22", end: "2026-08-23" },
              completions: [completion],
            };
          case "chores_manager/weekly_points":
            return weeklyPoints;
          case "config/auth/list":
            return [];
          default:
            throw new Error(`Unexpected command ${String(message.type)}`);
        }
      },
    };
    const hass = {
      states: {
        "sensor.kid_1_weekly_points": {
          state: "7",
          last_updated: "2026-08-23T08:00:00+00:00",
          attributes: {
            child_id: "kid_1",
            kid_name: "Acceptance Avery",
            week_start: "2026-08-22",
          },
        },
        "switch.kid_1_chore_1": {
          state: "off",
          attributes: {
            assignment_id: "assignment_1",
            child_id: "kid_1",
            kid_name: "Acceptance Avery",
            title: "Test chore",
            category: "Morning",
            points: 2,
            icon: "mdi:bed",
            sort_order: 1,
          },
        },
      },
      language: "en",
      locale: {
        language: "en",
        number_format: "language",
        time_format: "language",
        date_format: "language",
        first_weekday: "language",
        time_zone: "local",
      },
      user: { id: "owner", is_admin: true },
      connection,
      callService: async () => undefined,
    };
    const configs: Record<string, Record<string, unknown>> = {
      "chores-manager-daily-card": { child_id: "kid_1" },
      "chores-manager-overview-card": { child_id: "kid_1", goal_points: 20 },
      "chores-manager-history-card": { child_id: "kid_1" },
      "chores-manager-correction-card": { child_id: "kid_1" },
    };

    const renderText: Record<string, string> = {};
    for (const type of cardTypes) {
      const element = document.createElement(type) as HTMLElement & {
        hass: typeof hass;
        setConfig: (config: Record<string, unknown>) => void;
        updateComplete: Promise<boolean>;
      };
      element.hass = hass;
      element.setConfig(configs[type]);
      document.body.append(element);
      await element.updateComplete;
      await Promise.resolve();
      await element.updateComplete;
      renderText[type] = element.shadowRoot?.textContent ?? "";
    }

    const editorForms: Record<string, boolean> = {};
    for (const type of editorTypes) {
      const editor = document.createElement(type) as HTMLElement & {
        hass: typeof hass;
        setConfig: (config: Record<string, unknown>) => void;
        updateComplete: Promise<boolean>;
      };
      editor.hass = hass;
      editor.setConfig({ child_id: "kid_1" });
      document.body.append(editor);
      await editor.updateComplete;
      editorForms[type] = Boolean(editor.shadowRoot?.querySelector("ha-form"));
    }

    const sharedHass = {
      ...hass,
      states: {
        ...hass.states,
        "switch.kid_1_chore_1": {
          ...hass.states["switch.kid_1_chore_1"],
          state: "on",
          attributes: {
            ...hass.states["switch.kid_1_chore_1"].attributes,
            completion_mode: "shared",
            completed_by_child_id: "kid_2",
            completed_by_child_name: "Isabelle",
          },
        },
      },
    };
    const sharedCard = document.createElement("chores-manager-daily-card") as unknown as HTMLElement & {
      hass: typeof hass;
      setConfig: (config: Record<string, unknown>) => void;
      updateComplete: Promise<boolean>;
    };
    sharedCard.hass = sharedHass;
    sharedCard.setConfig({ child_id: "kid_1" });
    document.body.append(sharedCard);
    await sharedCard.updateComplete;
    const sharedButton = sharedCard.shadowRoot?.querySelector(".chore") as HTMLButtonElement;

    return {
      registeredCards: cardTypes.filter((type) => customElements.get(type)),
      registeredEditors: editorTypes.filter((type) => customElements.get(type)),
      listedCards: (window as Window & { customCards?: Array<{ type: string }> })
        .customCards?.map(({ type }) => type)
        .filter((type) => cardTypes.includes(type)) ?? [],
      renderText,
      editorForms,
      sharedClaim: {
        disabled: sharedButton.disabled,
        text: sharedCard.shadowRoot?.textContent ?? "",
      },
    };
  });

  expect(result.registeredCards).toHaveLength(4);
  expect(result.registeredEditors).toHaveLength(4);
  expect(result.listedCards).toHaveLength(4);
  expect(Object.values(result.editorForms)).not.toContain(false);
  expect(result.renderText["chores-manager-daily-card"]).toContain("Test chore");
  expect(result.renderText["chores-manager-overview-card"]).toContain("7 / 20 points");
  expect(result.renderText["chores-manager-history-card"]).toContain("Test chore");
  expect(result.renderText["chores-manager-correction-card"]).toContain("Test chore");
  expect(result.sharedClaim.disabled).toBe(true);
  expect(result.sharedClaim.text).toContain("Claimed by Isabelle");
  expect(pageErrors).toEqual([]);
});
