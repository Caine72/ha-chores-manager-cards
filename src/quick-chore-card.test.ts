import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoresManagerQuickChoreCard } from "./quick-chore-card";
import { ChoresManagerQuickChoreCardEditor } from "./quick-chore-editor";
import type { HomeAssistant } from "./types";

function hass(callService: HomeAssistant["callService"]): HomeAssistant {
  return {
    states: {
      "person.alex": { state: "home", attributes: { entity_picture: "/alex.png" } },
      "person.isabelle": { state: "home", attributes: { entity_picture: "/isabelle.png" } },
      "switch.kid_1_chore_1": { state: "on", attributes: { assignment_id: "assignment_1", child_id: "kid_1", kid_name: "Alex", person_entity_id: "person.alex", chore_id: "chore_1", title: "Feed cats", category: "Cats", points: 2, sort_order: 1, completion_mode: "shared", completed_by_child_id: "kid_1", completed_by_child_name: "Alex", completed_at: "2026-08-29T16:48:00+00:00" } },
      "switch.kid_2_chore_1": { state: "on", attributes: { assignment_id: "assignment_2", child_id: "kid_2", kid_name: "Isabelle", person_entity_id: "person.isabelle", chore_id: "chore_1", title: "Feed cats", category: "Cats", points: 2, sort_order: 1, completion_mode: "shared", completed_by_child_id: "kid_1", completed_by_child_name: "Alex", completed_at: "2026-08-29T16:48:00+00:00" } },
    },
    callService,
  };
}

afterEach(() => document.body.replaceChildren());

describe("quick chore card", () => {
  it("shows claimant portrait and disables every non-claimant action", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const card = new ChoresManagerQuickChoreCard();
    card.hass = hass(callService);
    card.setConfig({ title: "Cat food", show_reset_action: true, children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1", label: "Morning" }] });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".status img")?.getAttribute("src")).toBe("/alex.png");
    const children = [...(card.shadowRoot?.querySelectorAll(".shortcut") ?? [])] as HTMLButtonElement[];
    expect(children[0].disabled).toBe(false);
    expect(children[1].disabled).toBe(true);
    children[1].click();
    expect(callService).not.toHaveBeenCalled();

    (card.shadowRoot?.querySelector(".reset-toggle") as HTMLButtonElement).click();
    await card.updateComplete;
    (card.shadowRoot?.querySelector(".reset-slot") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(callService).toHaveBeenCalledWith("switch", "turn_off", {
      entity_id: "switch.kid_1_chore_1",
    });
  });

  it("uses Home Assistant's configured 24-hour clock for completion times", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const state = hass(callService);
    state.locale = {
      language: "en-US", number_format: "language", time_format: "24", date_format: "language", first_weekday: "language", time_zone: "Europe/Stockholm",
    };
    const card = new ChoresManagerQuickChoreCard();
    card.hass = state;
    card.setConfig({ children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(card);
    await card.updateComplete;

    const detail = card.shadowRoot?.querySelector(".status-copy span")?.textContent ?? "";
    expect(detail).toMatch(/\bat \d{2}:\d{2}\b/);
    expect(detail).not.toMatch(/AM|PM/);
  });

  it("supports the same three portrait sizes as the overview card without a portrait frame", async () => {
    const card = new ChoresManagerQuickChoreCard();
    card.hass = hass(vi.fn<HomeAssistant["callService"]>());
    card.setConfig({ shortcut_person_size: "large", children: [{ child_id: "kid_1" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".shortcuts")?.classList.contains("size-large")).toBe(true);
    expect(ChoresManagerQuickChoreCard.styles.cssText).toContain(".shortcuts.size-large .portrait { width: 96px");
    expect(ChoresManagerQuickChoreCard.styles.cssText).not.toContain("border: 1px solid var(--divider-color); border-radius: 50%; }");
  });

  it("offers compact, normal, and comfortable card densities", async () => {
    const card = new ChoresManagerQuickChoreCard();
    card.hass = hass(vi.fn<HomeAssistant["callService"]>());
    card.setConfig({ density: "comfortable", children: [{ child_id: "kid_1" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector("ha-card")?.classList.contains("density-comfortable")).toBe(true);
    expect(ChoresManagerQuickChoreCard.styles.cssText).toContain("ha-card.density-normal");
    expect(ChoresManagerQuickChoreCard.styles.cssText).toContain("ha-card.density-comfortable");
  });

  it("removes only the card border when the border option is disabled", async () => {
    const card = new ChoresManagerQuickChoreCard();
    card.hass = hass(vi.fn<HomeAssistant["callService"]>());
    card.setConfig({
      show_border: false,
      children: [{ child_id: "kid_1" }],
      chores: [{ chore_id: "chore_1" }],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector("ha-card")?.classList).toContain("borderless");
    expect(ChoresManagerQuickChoreCard.styles.cssText).toContain("ha-card.borderless { border: 0");
    expect(ChoresManagerQuickChoreCard.styles.cssText).not.toContain("background: none");
    expect(ChoresManagerQuickChoreCard.styles.cssText).not.toContain("box-shadow: none");
  });

  it("uses a child portrait as the configured time-window shortcut", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-29T16:00:00"));
    const callService = vi.fn<HomeAssistant["callService"]>();
    const state = hass(callService);
    state.states["switch.kid_1_chore_1"].state = "off";
    state.states["switch.kid_2_chore_1"].state = "off";
    state.states["switch.kid_1_chore_2"] = { state: "off", attributes: { assignment_id: "assignment_3", child_id: "kid_1", kid_name: "Alex", person_entity_id: "person.alex", chore_id: "chore_2", title: "Evening", icon: "mdi:moon-waning-crescent", completion_mode: "shared" } };
    state.states["switch.kid_2_chore_2"] = { state: "off", attributes: { assignment_id: "assignment_4", child_id: "kid_2", kid_name: "Isabelle", person_entity_id: "person.isabelle", chore_id: "chore_2", title: "Evening", icon: "mdi:moon-waning-crescent", completion_mode: "shared" } };
    const card = new ChoresManagerQuickChoreCard();
    card.hass = state;
    card.setConfig({
      shortcut_mode: "time_window",
      children: [{ child_id: "kid_1" }, { child_id: "kid_2" }],
      chores: [
        { chore_id: "chore_1", start_time: "00:00", end_time: "14:00" },
        { chore_id: "chore_2", start_time: "14:00", end_time: "24:00" },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    (card.shadowRoot?.querySelector(".shortcut") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(callService).toHaveBeenCalledWith("switch", "turn_on", { entity_id: "switch.kid_1_chore_2" });
    vi.useRealTimers();
  });

  it("resets a manual completion with the backend manual reset action", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const state = hass(callService);
    state.states["switch.kid_1_chore_1"].attributes.completed_manually = true;
    delete state.states["switch.kid_1_chore_1"].attributes.completed_by_child_id;
    delete state.states["switch.kid_1_chore_1"].attributes.completed_by_child_name;
    state.states["switch.kid_2_chore_1"].attributes.completed_manually = true;
    delete state.states["switch.kid_2_chore_1"].attributes.completed_by_child_id;
    delete state.states["switch.kid_2_chore_1"].attributes.completed_by_child_name;
    const card = new ChoresManagerQuickChoreCard();
    card.hass = state;
    card.setConfig({ show_reset_action: true, children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(card);
    await card.updateComplete;

    (card.shadowRoot?.querySelector(".reset-toggle") as HTMLButtonElement).click();
    await card.updateComplete;
    (card.shadowRoot?.querySelector(".reset-slot") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(callService).toHaveBeenCalledWith("chores_manager", "reset_manual_chore_completion", { chore_id: "chore_1" });
  });

  it("uses the inherited chore icon for the manual action", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const state = hass(callService);
    state.states["switch.kid_1_chore_1"].state = "off";
    state.states["switch.kid_1_chore_1"].attributes.icon = "mdi:cat";
    state.states["switch.kid_2_chore_1"].state = "off";
    const card = new ChoresManagerQuickChoreCard();
    card.hass = state;
    card.setConfig({ children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".manual ha-icon")?.getAttribute("icon")).toBe("mdi:cat");
  });

  it("keeps reset out of the layout until there is a completed chore", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const state = hass(callService);
    state.states["switch.kid_1_chore_1"].state = "off";
    state.states["switch.kid_2_chore_1"].state = "off";
    const card = new ChoresManagerQuickChoreCard();
    card.hass = state;
    card.setConfig({ show_reset_action: true, children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".reset-control")).toBeNull();
  });

  it("keeps the status icon inherited when the manual icon is overridden", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const state = hass(callService);
    state.states["switch.kid_1_chore_1"].state = "off";
    state.states["switch.kid_2_chore_1"].state = "off";
    state.states["switch.kid_1_chore_1"].attributes.icon = "mdi:cat";
    state.states["switch.kid_2_chore_1"].attributes.icon = "mdi:cat";
    delete state.states["switch.kid_1_chore_1"].attributes.completed_by_child_id;
    delete state.states["switch.kid_1_chore_1"].attributes.completed_by_child_name;
    delete state.states["switch.kid_2_chore_1"].attributes.completed_by_child_id;
    delete state.states["switch.kid_2_chore_1"].attributes.completed_by_child_name;
    const card = new ChoresManagerQuickChoreCard();
    card.hass = state;
    card.setConfig({
      children: [{ child_id: "kid_1" }, { child_id: "kid_2" }],
      chores: [{ chore_id: "chore_1", manual_icon_override: "mdi:food-steak" }],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".status ha-icon")?.getAttribute("icon")).toBe("mdi:cat");
    expect(card.shadowRoot?.querySelector(".manual ha-icon")?.getAttribute("icon")).toBe("mdi:food-steak");
  });

  it("applies a chosen colour only to the manual action icon", async () => {
    const callService = vi.fn<HomeAssistant["callService"]>();
    const state = hass(callService);
    state.states["switch.kid_1_chore_1"].state = "off";
    state.states["switch.kid_2_chore_1"].state = "off";
    const card = new ChoresManagerQuickChoreCard();
    card.hass = state;
    card.setConfig({
      children: [{ child_id: "kid_1" }, { child_id: "kid_2" }],
      chores: [{ chore_id: "chore_1", color: "#00bcd4" }],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".manual ha-icon")?.getAttribute("style")).toContain("#00bcd4");
    expect(card.shadowRoot?.querySelector(".status ha-icon")?.getAttribute("style")).toBeFalsy();
  });

  it("uses compact child rows and keeps the display-name input blank in its edit pop-out", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    editor.hass = hass(vi.fn<HomeAssistant["callService"]>());
    editor.setConfig({ children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(editor);
    await editor.updateComplete;

    expect([...editor.shadowRoot?.querySelectorAll(".child-row .item-name") ?? []].map((row) => row.textContent)).toEqual([
      "Alex", "Isabelle",
    ]);
    expect(editor.shadowRoot?.querySelector("ha-expansion-panel")).toBeNull();

    (editor.shadowRoot?.querySelector(".child-row ha-icon-button") as HTMLElement).click();
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-dialog ha-form") as HTMLElement & {
      data: { child_id: string; display_name?: string };
    };
    expect(form.data).toEqual({ child_id: "kid_1" });
  });

  it("uses the chore name as the editor heading while keeping its display name blank", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    editor.hass = hass(vi.fn<HomeAssistant["callService"]>());
    editor.setConfig({ children: [{ child_id: "kid_1" }], chores: [{ chore_id: "chore_1", label: "chore_1" }] });
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.shadowRoot?.querySelector(".chore-row .item-name")?.textContent).toBe("Feed cats");
    (editor.shadowRoot?.querySelector(".chore-row ha-icon-button") as HTMLElement).click();
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-dialog ha-form") as HTMLElement & {
      data: { chore_id: string; display_name?: string };
    };
    expect(form.data).toEqual({ chore_id: "chore_1", color_mode: "automatic" });
  });

  it("only shows a populated standard color picker after custom color is chosen", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    editor.hass = hass(vi.fn<HomeAssistant["callService"]>());
    editor.setConfig({ children: [{ child_id: "kid_1" }], chores: [{ chore_id: "chore_1" }] });
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    document.body.append(editor);
    await editor.updateComplete;

    (editor.shadowRoot?.querySelector(".chore-row ha-icon-button") as HTMLElement).click();
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-dialog ha-form") as HTMLElement & {
      data: { chore_id: string; color_mode: string };
      schema: Array<{ name: string }>;
    };
    expect(form.data.color_mode).toBe("automatic");
    expect(form.schema.map((field) => field.name)).not.toContain("color");

    form.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { chore_id: "chore_1", color_mode: "custom" } }, bubbles: true, composed: true,
    }));
    await editor.updateComplete;
    expect(changed).not.toHaveBeenCalled();
    (editor.shadowRoot?.querySelector('ha-dialog ha-button[slot="primaryAction"]') as HTMLElement).click();
    expect(changed.mock.calls[0][0].detail.config.chores).toEqual([{ chore_id: "chore_1", color: "#03a9f4" }]);
  });

  it("reorders children by dragging their compact editor rows", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    editor.hass = hass(vi.fn<HomeAssistant["callService"]>());
    editor.setConfig({ children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    document.body.append(editor);
    await editor.updateComplete;

    const rows = [...(editor.shadowRoot?.querySelectorAll(".child-row") ?? [])] as HTMLElement[];
    rows[1].dispatchEvent(new Event("dragstart", { bubbles: true }));
    rows[0].dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));

    expect(changed.mock.calls.at(-1)?.[0].detail.config.children).toEqual([
      { child_id: "kid_2" }, { child_id: "kid_1" },
    ]);
  });

  it("uses standard dialog actions and only saves child edits when Save is pressed", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    editor.hass = hass(vi.fn<HomeAssistant["callService"]>());
    editor.setConfig({ children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    const changed = vi.fn();
    const escapedClick = vi.fn();
    const escapedClosed = vi.fn();
    editor.addEventListener("config-changed", changed);
    editor.addEventListener("click", escapedClick);
    editor.addEventListener("closed", escapedClosed);
    document.body.append(editor);
    await editor.updateComplete;

    const openEditor = (): void => {
      (editor.shadowRoot?.querySelector(".child-row ha-icon-button") as HTMLElement).click();
    };
    openEditor();
    await editor.updateComplete;
    let form = editor.shadowRoot?.querySelector("ha-dialog ha-form") as HTMLElement;
    form.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { child_id: "kid_1", display_name: "Alexander" } }, bubbles: true, composed: true,
    }));
    await editor.updateComplete;

    const footer = editor.shadowRoot?.querySelector("ha-dialog-footer");
    expect(footer).not.toBeNull();
    expect(editor.shadowRoot?.querySelector('ha-button[slot="secondaryAction"]')?.textContent).toBe("Cancel");
    expect(editor.shadowRoot?.querySelector('ha-button[slot="primaryAction"]')?.textContent).toBe("Save");
    escapedClick.mockClear();
    (editor.shadowRoot?.querySelector('ha-button[slot="secondaryAction"]') as HTMLElement).click();
    await editor.updateComplete;
    expect(changed).not.toHaveBeenCalled();
    expect(escapedClick).not.toHaveBeenCalled();
    expect(editor.shadowRoot?.querySelector(".child-row .item-name")?.textContent).toBe("Alex");

    openEditor();
    await editor.updateComplete;
    form = editor.shadowRoot?.querySelector("ha-dialog ha-form") as HTMLElement;
    form.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { child_id: "kid_1", display_name: "Alexander" } }, bubbles: true, composed: true,
    }));
    await editor.updateComplete;
    escapedClick.mockClear();
    (editor.shadowRoot?.querySelector('ha-button[slot="primaryAction"]') as HTMLElement).click();
    expect(changed.mock.calls.at(-1)?.[0].detail.config.children[0]).toEqual({
      child_id: "kid_1", display_name: "Alexander",
    });
    expect(escapedClick).not.toHaveBeenCalled();

    openEditor();
    await editor.updateComplete;
    editor.shadowRoot?.querySelector("ha-dialog")?.dispatchEvent(new Event("closed", {
      bubbles: true, composed: true,
    }));
    await editor.updateComplete;
    expect(escapedClosed).not.toHaveBeenCalled();
    expect(editor.shadowRoot?.querySelector("ha-dialog")).toBeNull();
  });

  it("uses trash actions without overriding Home Assistant dialog geometry", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    editor.hass = hass(vi.fn<HomeAssistant["callService"]>());
    editor.setConfig({ children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] });
    document.body.append(editor);
    await editor.updateComplete;

    const remove = editor.shadowRoot?.querySelector('ha-icon-button[title="Remove child"]') as HTMLElement & { path: string };
    expect(remove.path).toContain("M19,4H15.5");
    expect(ChoresManagerQuickChoreCardEditor.styles.cssText).not.toContain("ha-dialog");
    expect(ChoresManagerQuickChoreCardEditor.styles.cssText).not.toContain("dialog-form");
  });

  it("reorders chores by dragging their compact editor rows", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    const state = hass(vi.fn<HomeAssistant["callService"]>());
    state.states["switch.kid_1_chore_2"] = { state: "off", attributes: { assignment_id: "assignment_3", child_id: "kid_1", chore_id: "chore_2", title: "Refill water", completion_mode: "shared" } };
    editor.hass = state;
    editor.setConfig({ children: [{ child_id: "kid_1" }], chores: [{ chore_id: "chore_1" }, { chore_id: "chore_2" }] });
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    document.body.append(editor);
    await editor.updateComplete;

    const rows = [...(editor.shadowRoot?.querySelectorAll(".chore-row") ?? [])] as HTMLElement[];
    rows[1].dispatchEvent(new Event("dragstart", { bubbles: true }));
    rows[0].dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));

    expect(changed.mock.calls.at(-1)?.[0].detail.config.chores).toEqual([
      { chore_id: "chore_2" }, { chore_id: "chore_1" },
    ]);
  });

  it("keeps generated child names out of the saved configuration", async () => {
    const editor = new ChoresManagerQuickChoreCardEditor();
    editor.hass = hass(vi.fn<HomeAssistant["callService"]>());
    editor.setConfig({ children: [{ child_id: "kid_1" }], chores: [{ chore_id: "chore_1" }] });
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement & { data: unknown };
    form.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: form.data }, bubbles: true, composed: true,
    }));

    expect(changed.mock.calls[0][0].detail.config.children).toEqual([{ child_id: "kid_1" }]);
  });
});
