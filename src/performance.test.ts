import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoresManagerDailyCard } from "./daily-card";
import { ChoresManagerHistoryCard } from "./history-card";
import {
  getAssignments,
  getAssociatedPersonEntity,
  getChildDisplayName,
  getWeeklyPoints,
} from "./data";
import type { CurrentWeekHistoryResponse, HomeAssistant } from "./types";

function createHass(states: HomeAssistant["states"]): HomeAssistant {
  return {
    states,
    language: "en",
    callService: async () => undefined,
  };
}

function relevantStates(): HomeAssistant["states"] {
  return {
    "switch.kid_1_chore_1": {
      state: "off",
      attributes: {
        assignment_id: "assignment_1",
        child_id: "kid_1",
        child_name: "Avery",
        title: "Make the bed",
        category: "Morning",
        points: 2,
        sort_order: 1,
        person_entity_id: "person.avery",
      },
    },
    "sensor.kid_1_weekly_points": {
      state: "2",
      last_updated: "2026-08-23T08:00:00Z",
      attributes: {
        child_id: "kid_1",
        child_name: "Avery",
        week_start: "2026-08-21",
        person_entity_id: "person.avery",
      },
    },
    "person.avery": {
      state: "home",
      attributes: {
        friendly_name: "Avery",
        entity_picture: "/local/avery.jpg",
      },
    },
  };
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("card performance regressions", () => {
  it("indexes one Home Assistant state snapshot only once across card data lookups", () => {
    let enumerations = 0;
    const states = new Proxy(relevantStates(), {
      ownKeys(target) {
        enumerations += 1;
        return Reflect.ownKeys(target);
      },
    });
    const hass = createHass(states);

    getAssignments(hass, "kid_1");
    getWeeklyPoints(hass, "kid_1");
    getAssociatedPersonEntity(hass, "kid_1");
    getChildDisplayName(hass, "kid_1", undefined, undefined, "Chores");

    expect(enumerations).toBe(1);
  });

  it("does not render a daily card for an unrelated state update", async () => {
    const render = vi.spyOn(
      ChoresManagerDailyCard.prototype as unknown as { render: () => unknown },
      "render",
    );
    const states = relevantStates();
    const hass = createHass(states);
    const card = new ChoresManagerDailyCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1" });
    document.body.append(card);
    await card.updateComplete;
    const initialRenders = render.mock.calls.length;

    const unrelatedHass: HomeAssistant = {
      ...hass,
      states: {
        ...states,
        "sensor.unrelated": {
          state: "changed",
          attributes: {},
        },
      },
    };
    card.hass = unrelatedHass;
    await card.updateComplete;

    expect(render).toHaveBeenCalledTimes(initialRenders);

    card.hass = {
      ...unrelatedHass,
      states: {
        ...unrelatedHass.states,
        "switch.kid_1_chore_1": {
          ...states["switch.kid_1_chore_1"],
          state: "on",
        },
      },
    };
    await card.updateComplete;

    expect(render).toHaveBeenCalledTimes(initialRenders + 1);
    expect(card.shadowRoot?.querySelector(".chore")?.classList).toContain("completed");
  });

  it("reuses grouped history while the API response is unchanged", () => {
    const history: CurrentWeekHistoryResponse = {
      child_id: "kid_1",
      child_name: "Avery",
      points_entity_id: "sensor.kid_1_weekly_points",
      window: { start: "2026-08-21", end: "2026-08-27" },
      completions: [
        {
          completion_id: "completion_1",
          assignment_id: "assignment_1",
          assignment_exists: true,
          child_id: "kid_1",
          chore_id: "chore_1",
          local_date: "2026-08-23",
          completed_at: "2026-08-23T08:00:00Z",
          child_name: "Avery",
          chore_title: "Make the bed",
          category: "Morning",
          points: 2,
        },
      ],
    };
    const card = new ChoresManagerHistoryCard();
    const internals = card as unknown as {
      history?: CurrentWeekHistoryResponse;
      groupedCompletions: () => Map<string, CurrentWeekHistoryResponse["completions"]>;
    };
    internals.history = history;

    const first = internals.groupedCompletions();
    const second = internals.groupedCompletions();

    expect(second).toBe(first);
  });

  it("coalesces identical history fetches from concurrent card instances", async () => {
    const history: CurrentWeekHistoryResponse = {
      child_id: "kid_1",
      child_name: "Avery",
      points_entity_id: "sensor.kid_1_weekly_points",
      window: { start: "2026-08-21", end: "2026-08-27" },
      completions: [],
    };
    let resolveRequest: ((value: CurrentWeekHistoryResponse) => void) | undefined;
    const pending = new Promise<CurrentWeekHistoryResponse>((resolve) => {
      resolveRequest = resolve;
    });
    const sendMessagePromise = vi.fn(() => pending);
    const hass: HomeAssistant = {
      ...createHass(relevantStates()),
      connection: {
        sendMessagePromise: sendMessagePromise as NonNullable<
          HomeAssistant["connection"]
        >["sendMessagePromise"],
      },
    };
    const first = new ChoresManagerHistoryCard();
    const second = new ChoresManagerHistoryCard();
    first.hass = hass;
    second.hass = hass;
    first.setConfig({ child_id: "kid_1" });
    second.setConfig({ child_id: "kid_1" });
    document.body.append(first, second);

    await Promise.all([first.updateComplete, second.updateComplete]);
    expect(sendMessagePromise).toHaveBeenCalledTimes(1);

    resolveRequest?.(history);
    await pending;
  });
});
