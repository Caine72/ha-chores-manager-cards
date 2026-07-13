import { UNKNOWN_STATES } from "./const";
import type { ChoreAssignment, HassEntity, HomeAssistant } from "./types";

function attribute<T>(entity: HassEntity, name: string): T | undefined {
  return entity.attributes[name] as T | undefined;
}

function numberAttribute(entity: HassEntity, name: string): number {
  const value = Number(attribute<unknown>(entity, name));
  return Number.isFinite(value) ? value : 0;
}

export function getAssignments(
  hass: HomeAssistant,
  childId: string,
): ChoreAssignment[] {
  return Object.entries(hass.states)
    .filter(
      ([entityId, entity]) =>
        entityId.startsWith("switch.") &&
        !UNKNOWN_STATES.has(entity.state) &&
        attribute<string>(entity, "child_id") === childId &&
        typeof attribute<string>(entity, "assignment_id") === "string",
    )
    .map(([entityId, entity]) => ({
      assignmentId: attribute<string>(entity, "assignment_id") ?? entityId,
      entityId,
      childId,
      title:
        attribute<string>(entity, "title") ??
        attribute<string>(entity, "friendly_name") ??
        entityId,
      category: attribute<string>(entity, "category") ?? "Other",
      points: numberAttribute(entity, "points"),
      icon: attribute<string>(entity, "icon") ?? "mdi:checkbox-marked-circle-outline",
      sortOrder: numberAttribute(entity, "sort_order"),
      completed: entity.state === "on",
    }))
    .sort(
      (left, right) =>
        left.category.localeCompare(right.category) ||
        left.sortOrder - right.sortOrder ||
        left.title.localeCompare(right.title),
    );
}

export function getWeeklyPoints(
  hass: HomeAssistant,
  childId: string,
): number | undefined {
  const entity = Object.entries(hass.states).find(
    ([entityId, candidate]) =>
      entityId.startsWith("sensor.") &&
      attribute<string>(candidate, "child_id") === childId,
  )?.[1];

  if (!entity || UNKNOWN_STATES.has(entity.state)) {
    return undefined;
  }

  const points = Number(entity.state);
  return Number.isFinite(points) ? points : undefined;
}

export function getEntityPicture(
  hass: HomeAssistant,
  personEntityId: string | undefined,
): string | undefined {
  const person = personEntityId ? hass.states[personEntityId] : undefined;
  return person ? attribute<string>(person, "entity_picture") : undefined;
}

export function groupAssignments(
  assignments: ChoreAssignment[],
): Map<string, ChoreAssignment[]> {
  return assignments.reduce((groups, assignment) => {
    const entries = groups.get(assignment.category) ?? [];
    entries.push(assignment);
    groups.set(assignment.category, entries);
    return groups;
  }, new Map<string, ChoreAssignment[]>());
}
