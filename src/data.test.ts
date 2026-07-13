import { describe, expect, it } from "vitest";

import { getAssignments, getWeeklyPoints, groupAssignments } from "./data";
import type { HomeAssistant } from "./types";

const hass = {
  states: {
    "switch.kid_1_chore_2": {
      state: "on",
      attributes: {
        assignment_id: "assignment_2",
        child_id: "kid_1",
        title: "Clear the table",
        category: "Dinner",
        points: 1,
        sort_order: 20,
      },
    },
    "switch.kid_1_chore_1": {
      state: "off",
      attributes: {
        assignment_id: "assignment_1",
        child_id: "kid_1",
        title: "Make the bed",
        category: "Morning",
        points: 2,
        sort_order: 10,
      },
    },
    "switch.kid_2_chore_1": {
      state: "off",
      attributes: {
        assignment_id: "assignment_3",
        child_id: "kid_2",
      },
    },
    "sensor.kid_1_weekly_points": {
      state: "3",
      attributes: { child_id: "kid_1" },
    },
  },
  callService: async () => undefined,
} satisfies HomeAssistant;

describe("Chores Manager state adapter", () => {
  it("discovers only visible assignment switches for a child", () => {
    expect(getAssignments(hass, "kid_1").map(({ assignmentId }) => assignmentId)).toEqual([
      "assignment_2",
      "assignment_1",
    ]);
  });

  it("groups assignments by their backend category", () => {
    expect([...groupAssignments(getAssignments(hass, "kid_1")).keys()]).toEqual([
      "Dinner",
      "Morning",
    ]);
  });

  it("reads the weekly-points sensor rather than an assignment switch", () => {
    expect(getWeeklyPoints(hass, "kid_1")).toBe(3);
  });
});
