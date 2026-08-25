# Architecture

Chores Manager Cards is a frontend-only package. The integration owns children, chores, assignments, points, week boundaries, permissions, and immutable history.

## Data sources and control

| Card | Reads | Writes | Authorization |
| --- | --- | --- | --- |
| Daily | Visible assignment switches and weekly-points sensor | `switch.turn_on`, `switch.turn_off` | Home Assistant entity visibility and service permissions |
| Overview | Visible entities and `chores_manager/weekly_points` | `chores_manager/adjust_weekly_points` | Weekly-points sensor permission and the optional child adjustment-user allowlist |
| History | `chores_manager/current_week_history` | None | Weekly-points sensor `read` permission |
| Correction | Inventory, current-week completions, and weekly points | `chores_manager/set_current_week_completion` | Administrator-only backend commands |

Conditional rendering is presentation, not authorization. The backend returns capabilities and enforces each protected operation.

## Stable identity

Cards select a child by the integration's stable `child_id`. Assignment switches expose stable child, chore, and assignment IDs as attributes. Display names and entity IDs may change without becoming relationship keys.

All cards resolve their heading consistently: a non-empty card `name`, then the integration child name, then a localized fallback. The former daily-card `title` field is ignored.

## Portraits

A child may carry an optional `person_entity_id`. Cards resolve the associated Person's current `entity_picture` from visible Home Assistant state, while card YAML may override it with `person_entity`.

The integration stores no image files. The association is a presentation hint and does not affect permissions.

## Refresh behavior

Visible entity changes update child-facing state through Home Assistant. Overview, history, and correction API data reload when the selected child, connection, weekly-points entity, or backend week boundary changes. Consumers use returned week dates rather than calculating a reset weekday.

## Optional wrappers

Cards render independently. Bubble Card may provide a popup shell, but it is not imported or required. Header and border controls allow the standalone cards to fit either direct dashboard placement or a wrapper.
