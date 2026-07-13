# Architecture

Chores Manager Cards is a frontend-only package. It never stores chores, points, permissions, or history.

## Child-facing cards

The daily and overview cards use only Home Assistant entities visible to the current user:

- active assignment switches are discovered from their `assignment_id`, `child_id`, title, category, points, icon, and sort-order attributes;
- the weekly point total is read from the child weekly-points sensor;
- the daily card calls `switch.turn_on` and `switch.turn_off` for the selected assignment.

This lets a child use the cards without admin WebSocket access. Entity visibility and service permissions remain enforced by Home Assistant.

## Parent and admin cards

- History will use the Chores Manager current-week completion command after the backend provides parent-user authorization.
- Correction will use the existing admin-only inventory and correction WebSocket commands.
- UI visibility is never a security boundary.

## Presentation

Cards render independently. Bubble Card may wrap a card, but it is not imported or required. Overview action tiles use standard Home Assistant actions so a dashboard chooses navigation or popup presentation.
