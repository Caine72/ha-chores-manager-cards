import { UNKNOWN_STATES } from "./const";
import type { BaseCardConfig, ChoreAssignment, HassEntity, HomeAssistant } from "./types";

export interface ChoreChild {
  id: string;
  name: string;
}

export interface PersonOption {
  entityId: string;
  name: string;
}

interface StateIndex {
  assignmentsByChild: Map<string, ChoreAssignment[]>;
  associatedPersonByChild: Map<string, string>;
  childEntities: Map<string, HassEntity[]>;
  childNames: Map<string, string>;
  children: ChoreChild[];
  personOptions: PersonOption[];
  weeklyPointsByChild: Map<string, HassEntity>;
}

const stateIndexes = new WeakMap<HomeAssistant["states"], StateIndex>();

function attribute<T>(entity: HassEntity, name: string): T | undefined {
  return entity.attributes[name] as T | undefined;
}

function numberAttribute(entity: HassEntity, name: string): number {
  const value = Number(attribute<unknown>(entity, name));
  return Number.isFinite(value) ? value : 0;
}

function normalized(value: string): string {
  return value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

function getStateIndex(hass: HomeAssistant): StateIndex {
  const cached = stateIndexes.get(hass.states);
  if (cached) {
    return cached;
  }

  const assignmentsByChild = new Map<string, ChoreAssignment[]>();
  const associatedPersonByChild = new Map<string, string>();
  const childEntities = new Map<string, HassEntity[]>();
  const childNames = new Map<string, string>();
  const personOptions: PersonOption[] = [];
  const weeklyPointsByChild = new Map<string, HassEntity>();

  for (const [entityId, entity] of Object.entries(hass.states)) {
    if (entityId.startsWith("person.")) {
      personOptions.push({
        entityId,
        name:
          attribute<string>(entity, "friendly_name") ??
          entityId.slice("person.".length).replaceAll("_", " "),
      });
    }

    const childId = attribute<string>(entity, "child_id");
    if (!childId) {
      continue;
    }

    const entities = childEntities.get(childId) ?? [];
    entities.push(entity);
    childEntities.set(childId, entities);

    const childName =
      attribute<string>(entity, "kid_name") ??
      attribute<string>(entity, "child_name");
    if (childName?.trim()) {
      childNames.set(childId, childName);
    } else if (!childNames.has(childId)) {
      childNames.set(childId, childId);
    }

    const personEntityId = attribute<unknown>(entity, "person_entity_id");
    if (
      !associatedPersonByChild.has(childId) &&
      typeof personEntityId === "string" &&
      personEntityId.startsWith("person.")
    ) {
      associatedPersonByChild.set(childId, personEntityId);
    }

    if (entityId.startsWith("sensor.") && !weeklyPointsByChild.has(childId)) {
      weeklyPointsByChild.set(childId, entity);
    }

    if (
      entityId.startsWith("switch.") &&
      !UNKNOWN_STATES.has(entity.state) &&
      typeof attribute<string>(entity, "assignment_id") === "string"
    ) {
      const assignments = assignmentsByChild.get(childId) ?? [];
      assignments.push({
        assignmentId: attribute<string>(entity, "assignment_id") ?? entityId,
        entityId,
        childId,
        title:
          attribute<string>(entity, "title") ??
          attribute<string>(entity, "friendly_name") ??
          entityId,
        category: attribute<string>(entity, "category") ?? "Other",
        points: numberAttribute(entity, "points"),
        icon:
          attribute<string>(entity, "icon") ??
          "mdi:checkbox-marked-circle-outline",
        sortOrder: numberAttribute(entity, "sort_order"),
        completed: entity.state === "on",
      });
      assignmentsByChild.set(childId, assignments);
    }
  }

  for (const assignments of assignmentsByChild.values()) {
    assignments.sort(
      (left, right) =>
        left.category.localeCompare(right.category) ||
        left.sortOrder - right.sortOrder ||
        left.title.localeCompare(right.title),
    );
  }
  personOptions.sort((left, right) => left.name.localeCompare(right.name));

  const index: StateIndex = {
    assignmentsByChild,
    associatedPersonByChild,
    childEntities,
    childNames,
    children: [...childNames.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((left, right) => left.name.localeCompare(right.name)),
    personOptions,
    weeklyPointsByChild,
  };
  stateIndexes.set(hass.states, index);
  return index;
}

function findWeeklyPointsEntity(
  hass: HomeAssistant,
  childId: string,
  weeklyPointsEntityId?: string,
): HassEntity | undefined {
  return (
    (weeklyPointsEntityId ? hass.states[weeklyPointsEntityId] : undefined) ??
    getStateIndex(hass).weeklyPointsByChild.get(childId)
  );
}

export function getChildren(hass: HomeAssistant): ChoreChild[] {
  return getStateIndex(hass).children;
}

export function getConfiguredChildId(
  hass: HomeAssistant,
  config: Pick<BaseCardConfig, "child_id" | "child_entity">,
): string | undefined {
  const selectedEntity = config.child_entity
    ? hass.states[config.child_entity]
    : undefined;
  return config.child_id ?? (selectedEntity ? attribute<string>(selectedEntity, "child_id") : undefined);
}

export function getChildName(
  hass: HomeAssistant,
  childId: string,
): string | undefined {
  return getStateIndex(hass).childNames.get(childId);
}

export function getChildDisplayName(
  hass: HomeAssistant,
  childId: string,
  configuredName: string | undefined,
  backendName: string | undefined,
  fallback: string,
): string {
  return [configuredName, backendName, getChildName(hass, childId)]
    .find((candidate) => candidate?.trim())
    ?.trim() ?? fallback;
}

export function getPersonOptions(hass: HomeAssistant): PersonOption[] {
  return getStateIndex(hass).personOptions;
}

export function findPersonForChild(
  hass: HomeAssistant,
  childName: string,
): string | undefined {
  const childKey = normalized(childName);
  return getPersonOptions(hass).find((person) => normalized(person.name) === childKey)
    ?.entityId;
}

export function getAssignments(
  hass: HomeAssistant,
  childId: string,
): ChoreAssignment[] {
  return getStateIndex(hass).assignmentsByChild.get(childId) ?? [];
}

export function getWeeklyPoints(
  hass: HomeAssistant,
  childId: string,
  weeklyPointsEntity?: string,
): number | undefined {
  const entity = findWeeklyPointsEntity(hass, childId, weeklyPointsEntity);

  if (!entity || UNKNOWN_STATES.has(entity.state)) {
    return undefined;
  }

  const points = Number(entity.state);
  return Number.isFinite(points) ? points : undefined;
}

export function getWeeklyPointsWeekStart(
  hass: HomeAssistant,
  childId: string,
  weeklyPointsEntity?: string,
): string | undefined {
  const entity = findWeeklyPointsEntity(hass, childId, weeklyPointsEntity);
  const weekStart = entity ? attribute<unknown>(entity, "week_start") : undefined;
  return typeof weekStart === "string" ? weekStart : undefined;
}

export function getWeeklyPointsUpdateKey(
  hass: HomeAssistant,
  childId: string,
  weeklyPointsEntityId?: string,
): string | undefined {
  const entity = findWeeklyPointsEntity(hass, childId, weeklyPointsEntityId);
  if (!entity) {
    return undefined;
  }
  const weekStart = attribute<unknown>(entity, "week_start");
  return [
    entity.state,
    typeof weekStart === "string" ? weekStart : "",
    entity.last_updated ?? "",
  ].join("|");
}

export function getEntityPicture(
  hass: HomeAssistant,
  personEntityId: string | undefined,
): string | undefined {
  const person = personEntityId ? hass.states[personEntityId] : undefined;
  return person ? attribute<string>(person, "entity_picture") : undefined;
}

export function getAssociatedPersonEntity(
  hass: HomeAssistant,
  childId: string,
): string | undefined {
  return getStateIndex(hass).associatedPersonByChild.get(childId);
}

export function getChildStateEntities(
  hass: HomeAssistant,
  childId: string,
  extraEntityIds: Array<string | undefined> = [],
): HassEntity[] {
  const index = getStateIndex(hass);
  const entities = new Set(index.childEntities.get(childId) ?? []);
  const personEntityId = index.associatedPersonByChild.get(childId);
  for (const entityId of [...extraEntityIds, personEntityId]) {
    const entity = entityId ? hass.states[entityId] : undefined;
    if (entity) {
      entities.add(entity);
    }
  }
  return [...entities];
}

export function getCardHassUpdateKey(
  hass: HomeAssistant,
  childId: string,
  extraEntityIds: Array<string | undefined> = [],
): readonly unknown[] {
  return [
    hass.connection,
    hass.language,
    hass.locale?.language,
    hass.locale?.number_format,
    hass.locale?.time_format,
    hass.locale?.date_format,
    hass.locale?.first_weekday,
    hass.locale?.time_zone,
    hass.user?.id,
    hass.user?.is_admin,
    ...getChildStateEntities(hass, childId, extraEntityIds),
  ];
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
