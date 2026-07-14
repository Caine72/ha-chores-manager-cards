import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoresManagerDailyCard } from "./daily-card";
import type { HomeAssistant } from "./types";

interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
}

function deferred(): Deferred {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function createHass(
  completed: boolean,
  points: number,
  callService: HomeAssistant["callService"],
): HomeAssistant {
  return {
    states: {
      "switch.kid_28_chore_1": {
        state: completed ? "on" : "off",
        attributes: {
          assignment_id: "assignment_1",
          child_id: "kid_28",
          kid_name: "Alex",
          title: "Test chore",
          category: "Test",
          points: 2,
          sort_order: 1,
        },
      },
      "sensor.kid_28_weekly_points": {
        state: String(points),
        attributes: { child_id: "kid_28", kid_name: "Alex" },
      },
    },
    callService,
  };
}

function createCard(hass: HomeAssistant): ChoresManagerDailyCard {
  const card = new ChoresManagerDailyCard();
  card.hass = hass;
  card.setConfig({ child_id: "kid_28", title: "Alex" });
  document.body.append(card);
  return card;
}

function choreButton(card: ChoresManagerDailyCard): HTMLButtonElement {
  return card.shadowRoot?.querySelector(".chore") as HTMLButtonElement;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("Chores Manager daily card", () => {
  it("rerenders from a new Home Assistant state without recreating the card", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const card = createCard(createHass(false, 4, callService));
    await card.updateComplete;

    expect(choreButton(card).classList.contains("completed")).toBe(false);
    expect(card.shadowRoot?.textContent).toContain("4 points");

    card.hass = createHass(true, 6, callService);
    await card.updateComplete;

    expect(choreButton(card).classList.contains("completed")).toBe(true);
    expect(card.shadowRoot?.textContent).toContain("6 points");
  });

  it("optimistically completes and then reverses a chore after each confirmation", async () => {
    const first = deferred();
    const second = deferred();
    const callService = vi
      .fn<HomeAssistant["callService"]>()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    const card = createCard(createHass(false, 4, callService));
    await card.updateComplete;

    choreButton(card).click();
    await card.updateComplete;

    expect(callService).toHaveBeenCalledWith("switch", "turn_on", {
      entity_id: "switch.kid_28_chore_1",
    });
    expect(choreButton(card).disabled).toBe(true);
    expect(choreButton(card).classList.contains("completed")).toBe(true);
    expect(card.shadowRoot?.textContent).toContain("6 points");

    choreButton(card).click();
    expect(callService).toHaveBeenCalledTimes(1);

    first.resolve();
    await card.updateComplete;
    card.hass = createHass(true, 6, callService);
    await card.updateComplete;

    expect(choreButton(card).disabled).toBe(false);

    choreButton(card).click();
    await card.updateComplete;

    expect(callService).toHaveBeenLastCalledWith("switch", "turn_off", {
      entity_id: "switch.kid_28_chore_1",
    });
    expect(choreButton(card).disabled).toBe(true);
    expect(choreButton(card).classList.contains("completed")).toBe(false);
    expect(card.shadowRoot?.textContent).toContain("4 points");

    second.resolve();
    await card.updateComplete;
    card.hass = createHass(false, 4, callService);
    await card.updateComplete;

    expect(choreButton(card).disabled).toBe(false);
  });

  it("rolls back a pending completion when the service call fails", async () => {
    const callService = vi
      .fn<HomeAssistant["callService"]>()
      .mockRejectedValue(new Error("Service unavailable"));
    const card = createCard(createHass(false, 4, callService));
    await card.updateComplete;

    choreButton(card).click();
    await card.updateComplete;
    await Promise.resolve();
    await card.updateComplete;

    expect(choreButton(card).disabled).toBe(false);
    expect(choreButton(card).classList.contains("completed")).toBe(false);
    expect(card.shadowRoot?.textContent).toContain("Service unavailable");
  });
});
