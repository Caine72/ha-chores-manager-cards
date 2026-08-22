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
    points_entity_id: "sensor.kid_1_weekly_points",
    window: { start: "2026-08-21", end: "2026-08-27" },
    completions,
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
  it("renders a localized current-week history grouped by ascending date", async () => {
    const { hass, send } = apiHass(response([
      completion("3", "2026-08-22", "Ge katten mat", "Katten", 1),
      completion("2", "2026-08-21", "Göra frukost", "Morgonen", 2),
      completion("1", "2026-08-21", "Bädda sängen", "Morgonen", 2),
    ]));
    const card = new ChoresManagerHistoryCard();
    card.hass = hass;
    card.setConfig({ child_id: "kid_1", person_entity: "person.alex" });
    document.body.append(card);
    await settle(card);

    expect(send).toHaveBeenCalledWith({
      type: "chores_manager/current_week_history",
      child_id: "kid_1",
    });
    expect(card.shadowRoot?.querySelector("h1")?.textContent).toBe("Veckans sysslor");
    expect(card.shadowRoot?.querySelector("header p")?.textContent).toBe("Alex");
    expect(card.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe("/local/alex.jpg");
    const sections = [...(card.shadowRoot?.querySelectorAll("section") ?? [])];
    expect(sections.map((section) => section.dataset.localDate)).toEqual([
      "2026-08-21",
      "2026-08-22",
    ]);
    expect(sections[0].querySelector("h2")?.textContent).toBe("fredag");
    expect(sections[0].querySelectorAll("li")[0].textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Bädda sängen · 2p",
    );
    expect(sections[0].querySelector(".total")?.textContent).toBe("Totalt: 4p");
    expect(sections[1].querySelector("h2")?.textContent).toBe("lördag");
  });

  it("supports a borderless headerless popup layout and hiding points", async () => {
    const { hass } = apiHass(response([
      completion("1", "2026-08-22", "Ge katten mat", "Katten", 1),
    ]));
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
