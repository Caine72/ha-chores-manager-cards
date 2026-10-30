import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoresManagerHistoryCard } from "./history-card";
import type { CurrentWeekHistoryResponse, HomeAssistant } from "./types";

type SendMessagePromise = NonNullable<HomeAssistant["connection"]>["sendMessagePromise"];

function response(
  completions: CurrentWeekHistoryResponse["completions"],
): CurrentWeekHistoryResponse {
  return {
    child_id: "kid_1",
    child_name: "Alex",
    person_entity_id: "person.alex",
    points_entity_id: "sensor.kid_1_weekly_points",
    window: { start: "2026-08-21", end: "2026-08-27" },
    completions,
    activities: [],
  };
}

function completion(
  completionId: string,
  localDate: string,
  title: string,
  category: string,
  points: number,
): CurrentWeekHistoryResponse["completions"][number] {
  return {
    completion_id: completionId,
    assignment_id: `assignment_${completionId}`,
    assignment_exists: true,
    child_id: "kid_1",
    chore_id: `chore_${completionId}`,
    local_date: localDate,
    completed_at: `${localDate}T08:00:00+02:00`,
    child_name: "Alex",
    chore_title: title,
    category,
    points,
  };
}

function adjustment(
  activityId: string,
  localDate: string,
  points: number,
  actor: string,
  reason?: string,
): CurrentWeekHistoryResponse["activities"][number] {
  return {
    activity_id: activityId,
    occurred_at: `${localDate}T08:00:00+00:00`,
    local_date: localDate,
    action: "points_adjusted",
    child_id: "kid_1",
    chore_id: null,
    assignment_id: null,
    points_delta: points,
    actor_user_id: "parent_1",
    actor_name: actor,
    reason,
  };
}

function apiHass(history: CurrentWeekHistoryResponse): {
  hass: HomeAssistant;
  send: ReturnType<typeof vi.fn>;
} {
  const send = vi.fn().mockResolvedValue(history);
  return {
    hass: {
      states: {
        "sensor.kid_1_weekly_points": {
          state: "3",
          last_updated: "2026-08-22T10:00:00+00:00",
          attributes: {
            child_id: "kid_1",
            kid_name: "Alex",
            week_start: "2026-08-21",
          },
        },
        "person.alex": {
          state: "home",
          attributes: { entity_picture: "/local/alex.jpg" },
        },
        "person.override": {
          state: "home",
          attributes: { entity_picture: "/local/override.jpg" },
        },
      },
      language: "sv",
      connection: { sendMessagePromise: send as SendMessagePromise },
      callService: async () => undefined,
    },
    send,
  };
}

async function settle(card: ChoresManagerHistoryCard): Promise<void> {
  await card.updateComplete;
  await Promise.resolve();
  await card.updateComplete;
}

afterEach(() => document.body.replaceChildren());

describe("Chores Manager history card", () => {
  it.each([false, true])(
    "includes dated point adjustments and actor with completions=%s",
    async (hasCompletions) => {
      const history = response(
        hasCompletions
          ? [completion("1", "2026-08-22", "Ge katten mat", "Katten", 1)]
          : [],
      );
      history.activities = [adjustment("1", "2026-08-22", 6, "Parent", "Bonus")];
      const { hass } = apiHass(history);
      const card = new ChoresManagerHistoryCard();
      card.hass = hass;
      card.setConfig({ child_id: "kid_1" });
      document.body.append(card);
      await settle(card);

      expect(card.shadowRoot?.querySelectorAll("section")).toHaveLength(1);
      expect(card.shadowRoot?.querySelector(".empty")).toBeNull();
      expect(card.shadowRoot?.querySelector(".activity")?.textContent?.replace(/\s+/g, " ").trim()).toBe(
        "Poäng justerade · +6p · Parent · Bonus",
      );
      expect(card.shadowRoot?.querySelector("time")?.getAttribute("datetime")).toBe("2026-08-22");
      expect(card.shadowRoot?.querySelector("time")?.textContent).toBe("22 aug.");
      expect(card.shadowRoot?.querySelector(".total")?.textContent).toBe(
        `Totalt: ${hasCompletions ? 7 : 6}p`,
      );
      expect(card.getCardSize()).toBe(3);
    },
  );

  it("includes adjustment-only dates, negative deltas and no duplicate completion activity", async () => {
    const history = response([completion("1", "2026-08-22", "Feed cat", "Cat", 1)]);
    history.activities = [
      adjustment("3", "2026-08-23", -2, "Sam"),
      { ...adjustment("added", "2026-08-22", 1, "Alex"), action: "completion_added" },
      adjustment("2", "2026-08-21", 1, "Pat"),
      { ...adjustment("removed", "2026-08-24", -1, "Alex"), action: "completion_removed" },
      { ...adjustment("1", "2026-08-21", 2, "Lee"), occurred_at: "2026-08-21T07:00:00+00:00" },
    ];
    const { hass } = apiHass(history);
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", locale: "en" });
    document.body.append(card);
    await settle(card);

    const sections = [...(card.shadowRoot?.querySelectorAll("section") ?? [])];
    expect(sections.map((section) => section.dataset.localDate)).toEqual([
      "2026-08-21", "2026-08-22", "2026-08-23",
    ]);
    expect(sections.map((section) => section.querySelector(".total")?.textContent)).toEqual([
      "Total: 3p", "Total: 1p", "Total: -2p",
    ]);
    expect(sections[0].querySelectorAll(".activity")[0].textContent).toContain("Lee");
    expect(sections[2].querySelector(".activity")?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Points adjusted · -2p · Sam",
    );
    expect(card.shadowRoot?.querySelectorAll("li")).toHaveLength(4);
    expect(card.shadowRoot?.textContent).not.toContain("Completion added");
    expect(card.shadowRoot?.textContent).not.toContain("Completion removed");
    expect(sections[2].querySelector("time")?.textContent).toBe("Aug 23");
  });

  it.each([true, false])("summarizes ten +1 entries without changing their payload, show_points=%s", async (showPoints) => {
    const history = response([completion("1", "2026-08-22", "Feed cat", "Cat", 2)]);
    history.activities = Array.from({ length: 10 }, (_, index) => ({
      ...adjustment(String(index), "2026-08-22", 1, "Parent"),
      occurred_at: `2026-08-22T08:${String(index).padStart(2, "0")}:00+00:00`,
    })).reverse();
    const original = structuredClone(history);
    history.activities.forEach(Object.freeze);
    Object.freeze(history.activities);
    const { hass } = apiHass(history);
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", locale: "en", show_points: showPoints });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelectorAll(".activity")).toHaveLength(1);
    expect(card.shadowRoot?.querySelector(".activity")?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      showPoints ? "Points adjusted · +10p · Parent" : "Points adjusted · Parent",
    );
    if (showPoints) {
      expect(card.shadowRoot?.querySelector(".total")?.textContent).toBe("Total: 12p");
    } else {
      expect(card.shadowRoot?.querySelector(".total")).toBeNull();
      expect(card.shadowRoot?.querySelector(".points")).toBeNull();
    }
    expect(history).toEqual(original);
  });

  it("keeps different actors, reasons, directions and dates separate", async () => {
    const history = response([]);
    history.activities = [
      adjustment("1", "2026-08-22", 1, "Parent", "Bonus"),
      adjustment("2", "2026-08-22", 2, "Parent", "Bonus"),
      { ...adjustment("3", "2026-08-22", 4, "Parent", "Bonus"), actor_user_id: "parent_2" },
      adjustment("4", "2026-08-22", 8, "Parent", "Homework"),
      adjustment("5", "2026-08-22", -1, "Parent", "Bonus"),
      adjustment("6", "2026-08-22", -2, "Parent", "Bonus"),
      adjustment("7", "2026-08-23", 1, "Parent", "Bonus"),
      { ...adjustment("8", "2026-08-22", 16, "Renamed parent", "Bonus") },
    ];
    const { hass } = apiHass(history);
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", locale: "en" });
    document.body.append(card);
    await settle(card);

    const sections = [...(card.shadowRoot?.querySelectorAll("section") ?? [])];
    expect(sections.map((section) => section.dataset.localDate)).toEqual(["2026-08-22", "2026-08-23"]);
    expect([...sections[0].querySelectorAll(".activity")].map((row) => row.textContent?.replace(/\s+/g, " ").trim())).toEqual([
      "Points adjusted · +3p · Parent · Bonus",
      "Points adjusted · +4p · Parent · Bonus",
      "Points adjusted · +8p · Parent · Homework",
      "Points adjusted · -3p · Parent · Bonus",
      "Points adjusted · +16p · Renamed parent · Bonus",
    ]);
    expect(sections[0].querySelector(".total")?.textContent).toBe("Total: 28p");
    expect(sections[1].querySelectorAll(".activity")).toHaveLength(1);
    expect(sections[1].querySelector(".total")?.textContent).toBe("Total: 1p");
  });

  it("summarizes missing actor IDs by name without mixing known actors", async () => {
    const history = response([]);
    history.activities = [
      { ...adjustment("1", "2026-08-22", 1, "Parent"), actor_user_id: null },
      { ...adjustment("2", "2026-08-22", 1, "Parent"), actor_user_id: null, reason: "" },
      { ...adjustment("3", "2026-08-22", 1, "Other"), actor_user_id: null },
      adjustment("4", "2026-08-22", 1, "Parent"),
    ];
    const { hass } = apiHass(history);
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", locale: "en" });
    document.body.append(card);
    await settle(card);

    expect([...card.shadowRoot!.querySelectorAll(".activity")].map((row) => row.textContent?.replace(/\s+/g, " ").trim())).toEqual([
      "Points adjusted · +2p · Parent",
      "Points adjusted · +1p · Other",
      "Points adjusted · +1p · Parent",
    ]);
  });

  it("supports history responses without activities", async () => {
    const history = response([completion("1", "2026-08-22", "Feed cat", "Cat", 1)]);
    Reflect.deleteProperty(history, "activities");
    const { hass } = apiHass(history);
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", locale: "en" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelectorAll("li")).toHaveLength(1);
    expect(card.shadowRoot?.querySelector(".total")?.textContent).toBe("Total: 1p");
  });

  it("renders a localized current-week history grouped by ascending date", async () => {
    const { hass, send } = apiHass(response([
      completion("3", "2026-08-22", "Ge katten mat", "Katten", 1),
      completion("2", "2026-08-21", "Göra frukost", "Morgonen", 2),
      completion("1", "2026-08-21", "Bädda sängen", "Morgonen", 2),
    ]));
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1" });
    document.body.append(card);
    await settle(card);

    expect(send).toHaveBeenCalledWith({
      type: "chores_manager/current_week_history",
      child_id: "kid_1",
    });
    expect(card.shadowRoot?.querySelector("h1")?.textContent).toBe("Alex");
    expect(card.shadowRoot?.querySelector("header p")?.textContent).toBe("Veckans sysslor");
    expect(card.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe("/local/alex.jpg");
    const sections = [...(card.shadowRoot?.querySelectorAll("section") ?? [])];
    expect(sections.map((section) => section.dataset.localDate)).toEqual([
      "2026-08-21",
      "2026-08-22",
    ]);
    expect(sections[0].querySelector("h2")?.textContent).toContain("fredag");
    expect(sections[0].querySelectorAll("li")[0].textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Bädda sängen · 2p",
    );
    expect(sections[0].querySelector(".total")?.textContent).toBe("Totalt: 4p");
    expect(sections[1].querySelector("h2")?.textContent).toContain("lördag");
  });

  it("supports a borderless headerless popup layout and hiding points", async () => {
    const history = response([completion("1", "2026-08-22", "Ge katten mat", "Katten", 1)]);
    history.activities = [adjustment("1", "2026-08-22", 1, "Parent", "Bonus")];
    const { hass } = apiHass(history);
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({
      child_id: "kid_1",
      show_border: false,
      show_header: false,
      show_points: false,
    });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector("ha-card")?.classList).toContain("borderless");
    expect(card.shadowRoot?.querySelector("header")).toBeNull();
    expect(card.shadowRoot?.querySelector("li")?.textContent?.trim()).toBe("Ge katten mat");
    expect(card.shadowRoot?.querySelector(".total")).toBeNull();
    expect(card.shadowRoot?.querySelector(".activity")?.textContent?.replace(/\s+/g, " ").trim()).toBe("Poäng justerade · Parent · Bonus");
    expect(card.shadowRoot?.querySelector(".points")).toBeNull();
  });

  it("lets card YAML override the Person associated by the integration", async () => {
    const { hass } = apiHass(response([]));
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", person_entity: "person.override" });
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe(
      "/local/override.jpg",
    );
  });

  it("renders localized empty and failure states", async () => {
    const empty = apiHass(response([]));
    const emptyCard = new ChoresManagerHistoryCard();
    emptyCard.hass = empty.hass;
    emptyCard.setConfig({ child_id: "kid_1", locale: "en" });
    document.body.append(emptyCard);
    await settle(emptyCard);
    expect(emptyCard.shadowRoot?.querySelector(".empty")?.textContent).toBe(
      "No chores logged this week.",
    );

    const failure = apiHass(response([]));
    failure.send.mockRejectedValueOnce(new Error("denied"));
    const failureCard = new ChoresManagerHistoryCard();
    failureCard.hass = failure.hass;
    failureCard.setConfig({ child_id: "kid_1", locale: "en" });
    document.body.append(failureCard);
    await settle(failureCard);
    expect(failureCard.shadowRoot?.querySelector("[role=alert]")?.textContent).toBe(
      "Chore history could not be loaded.",
    );
  });

  it("reloads after the selected weekly-points entity changes", async () => {
    const first = response([]);
    const second = response([
      completion("1", "2026-08-22", "Ge katten mat", "Katten", 1),
    ]);
    const { hass, send } = apiHass(first);
    send.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1" });
    document.body.append(card);
    await settle(card);

    card.hass = {
      ...hass,
      states: {
        ...hass.states,
        "sensor.kid_1_weekly_points": {
          ...hass.states["sensor.kid_1_weekly_points"],
          state: "4",
          last_updated: "2026-08-22T10:01:00+00:00",
        },
      },
    };
    await settle(card);

    expect(send).toHaveBeenCalledTimes(2);
    expect(card.shadowRoot?.textContent).toContain("Ge katten mat");
  });

  it("provides a visual editor and chooses a real child for new cards", () => {
    const { hass } = apiHass(response([]));
    expect(ChoresManagerHistoryCard.getConfigElement().tagName.toLowerCase()).toBe(
      "chores-manager-history-card-editor",
    );
    expect(ChoresManagerHistoryCard.getStubConfig(hass).child_id).toBe("kid_1");
  });
});
