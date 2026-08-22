# Architecture

Chores Manager Cards is a frontend-only package. It never stores chores, points, permissions, or history.

## Child-facing cards

The daily and overview cards use only Home Assistant entities visible to the current user:

- active assignment switches are discovered from their `assignment_id`, `child_id`, title, category, points, icon, and sort-order attributes;
- the weekly point total is read from the child weekly-points sensor;
- the daily card calls `switch.turn_on` and `switch.turn_off` for the selected assignment.

This lets a child use the cards without admin WebSocket access. Entity visibility and service permissions remain enforced by Home Assistant.

## Parent and admin cards

- The overview card reads current/previous totals from `chores_manager/weekly_points` and renders adjustment controls only when its backend `can_adjust` capability is true.
- Manual changes use `chores_manager/adjust_weekly_points` and display the backend-confirmed result; the integration owns authorization and audit storage.
- The history card reads one child's current-week immutable completion snapshots from `chores_manager/current_week_history`; the backend enforces read permission against that child's weekly-points sensor and owns the week boundary.
- The dedicated correction card uses the existing admin-only inventory and correction WebSocket commands and can be embedded in a Bubble Card popup without depending on Bubble Card.
- UI visibility is never a security boundary.

## Presentation

Cards render independently. A child may carry an optional integration-owned `person_entity_id`; cards resolve its current `entity_picture` from visible Home Assistant state, while card YAML may override the Person. The integration stores no image files and the association never grants access. Bubble Card may wrap a card, but it is not imported or required. Overview action tiles use standard Home Assistant actions so a dashboard chooses navigation or popup presentation.
