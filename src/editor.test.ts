import { describe, expect, it, vi } from "vitest";

import "./editor";
import type { HomeAssistant } from "./types";

const hass: HomeAssistant = {
  states: {
    "switch.kid_28_bed": {
      state: "off",
      attributes: { assignment_id: "bed", child_id: "kid_28", kid_name: "Alex" },
    },
    "sensor.kid_28_weekly_points": {
      state: "2",
      attributes: { child_id: "kid_28", kid_name: "Alex" },
    },
  },
  callService: async () => undefined,
};

describe("dynamic Chores Manager editor", () => {
  it("uses Home Assistant ha-form controls with child metadata choices", async () => {
    const editor = document.createElement("chores-manager-daily-card-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: Record<string, unknown>): void;
    };
    editor.hass = hass;
    editor.setConfig({ child_id: "kid_28" });
    document.body.append(editor);
    await (editor as unknown as { updateComplete: Promise<void> }).updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement & {
      schema: Array<Record<string, unknown>>;
      data: Record<string, unknown>;
    };
    expect(form).toBeTruthy();
    expect(form.data.show_header).toBe(true);
    expect(form.data.show_points).toBe(true);
    expect(form.data.weekly_points_entity).toBe("sensor.kid_28_weekly_points");
    expect(form.schema[0]).toMatchObject({
      name: "child_id",
      selector: { select: { options: [{ label: "Alex", value: "kid_28" }] } },
    });
  });
});

  it("uses dropdown selectors for language and picture controls", async () => {
    const editor = document.createElement("chores-manager-overview-card-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: Record<string, unknown>): void;
    };
    editor.hass = hass;
    editor.setConfig({ child_id: "kid_28" });
    document.body.append(editor);
    await (editor as unknown as { updateComplete: Promise<void> }).updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement & {
      schema: Array<Record<string, unknown>>;
    };
    const display = form.schema.find((item) => item.name === "display") as {
      schema: Array<{ name: string; selector: { select?: { mode?: string } } }>;
    };
    for (const name of ["locale", "person_position", "person_size"]) {
      const field =
        form.schema.find((item) => item.name === name) ??
        display.schema.find((item) => item.name === name);
      expect(field).toMatchObject({ selector: { select: { mode: "dropdown" } } });
    }
  });

describe("button visibility editor", () => {
  it("uses the native user selector for list visibility and saves nested YAML", async () => {
    const editor = document.createElement("chores-manager-overview-card-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: Record<string, unknown>): void;
    };
    editor.hass = hass;
    editor.setConfig({
      child_id: "kid_28",
      buttons: [
        {
          label: "Correction",
          icon: "mdi:wrench-cog",
          color: "#9c27b0",
          visibility: { mode: "allow-list", users: ["parent"] },
        },
      ],
    });
    document.body.append(editor);
    await (editor as unknown as { updateComplete: Promise<void> }).updateComplete;

    const forms = [...(editor.shadowRoot?.querySelectorAll("ha-form") ?? [])] as Array<HTMLElement & {
      data: Record<string, unknown>;
      schema: Array<Record<string, unknown>>;
      computeLabel: (schema: { name: string }) => string | undefined;
    }>;
    const buttonForm = forms[1];
    expect(forms[0].computeLabel({ name: "show_points" })).toBe("Show points and reward message");
    expect(buttonForm.data.visibility_users).toEqual(["parent"]);
    expect(buttonForm.schema.find((item) => item.name === "visibility_users")).toEqual({
      name: "visibility_users",
      selector: {
        select: {
          multiple: true,
          mode: "dropdown",
          options: [{ value: "parent", label: "parent" }],
        },
      },
    });

    const changed = new Promise<Record<string, unknown>>((resolve) => {
      editor.addEventListener("config-changed", (event) => {
        resolve((event as CustomEvent<{ config: Record<string, unknown> }>).detail.config);
      }, { once: true });
    });
    buttonForm.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: { ...buttonForm.data, visibility_mode: "allow-list" } },
    }));
    await expect(changed).resolves.toMatchObject({
      buttons: [{ visibility: { mode: "allow-list", users: ["parent"] } }],
    });

    const changedSecond = new Promise<Record<string, unknown>>((resolve) => {
      editor.addEventListener("config-changed", (event) => {
        resolve((event as CustomEvent<{ config: Record<string, unknown> }>).detail.config);
      }, { once: true });
    });
    buttonForm.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: {
        value: {
          ...buttonForm.data,
          visibility_mode: "deny-list",
          visibility_users: ["tablet"],
        },
      },
    }));

    await expect(changedSecond).resolves.toMatchObject({
      buttons: [{ visibility: { mode: "deny-list", users: ["tablet"] } }],
    });
  });

  it("includes a user selector for every visibility mode", async () => {
    const editor = document.createElement("chores-manager-overview-card-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: Record<string, unknown>): void;
    };
    editor.hass = hass;
    editor.setConfig({
      child_id: "kid_28",
      buttons: [{
        label: "Chores",
        icon: "mdi:format-list-checks",
        color: "#00bcd4",
        visibility: { mode: "all", users: ["parent"] },
      }],
    });
    document.body.append(editor);
    await (editor as unknown as { updateComplete: Promise<void> }).updateComplete;

    const buttonForm = (editor.shadowRoot?.querySelectorAll("ha-form")[1]) as HTMLElement & {
      schema: Array<Record<string, unknown>>;
    };
    expect(buttonForm.schema.find((item) => item.name === "visibility_users")).toEqual({
      name: "visibility_users",
      selector: {
        select: {
          multiple: true,
          mode: "dropdown",
          options: [{ value: "parent", label: "parent" }],
        },
      },
    });
  });
});

describe("daily labels", () => {
  it("does not refer to reward messages", async () => {
    const editor = document.createElement("chores-manager-daily-card-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: Record<string, unknown>): void;
    };
    editor.hass = hass;
    editor.setConfig({ child_id: "kid_28" });
    document.body.append(editor);
    await (editor as unknown as { updateComplete: Promise<void> }).updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement & {
      computeLabel: (schema: { name: string }) => string | undefined;
    };
    expect(form.computeLabel({ name: "show_points" })).toBe("Show points");
  });
});

describe("authenticated user options", () => {
  it("loads active Home Assistant users into the visibility multi-select", async () => {
    const sendMessagePromise = vi.fn().mockResolvedValue([
      { id: "parent", name: "Parent", is_active: true, system_generated: false },
      { id: "child", name: "Child", is_active: true, system_generated: false },
      { id: "inactive", name: "Inactive", is_active: false, system_generated: false },
      { id: "system", name: "System", is_active: true, system_generated: true },
    ]);
    const editor = document.createElement("chores-manager-overview-card-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: Record<string, unknown>): void;
      updateComplete: Promise<boolean>;
    };
    editor.hass = { ...hass, connection: { sendMessagePromise } };
    editor.setConfig({
      child_id: "kid_28",
      buttons: [{ label: "Correction", icon: "mdi:wrench-cog", color: "#9c27b0" }],
    });
    document.body.append(editor);
    await editor.updateComplete;
    await Promise.resolve();
    await editor.updateComplete;

    const buttonForm = (editor.shadowRoot?.querySelectorAll("ha-form")[1]) as HTMLElement & {
      schema: Array<Record<string, unknown>>;
    };
    expect(sendMessagePromise).toHaveBeenCalledWith({ type: "config/auth/list" });
    expect(buttonForm.schema.find((item) => item.name === "visibility_users")).toMatchObject({
      selector: {
        select: {
          multiple: true,
          options: [
            { value: "child", label: "Child" },
            { value: "parent", label: "Parent" },
          ],
        },
      },
    });
  });
});
