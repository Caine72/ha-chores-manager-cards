# Card configuration

Every card has a visual editor. YAML remains available for dashboard source control and advanced Home Assistant actions.

## Common fields

| Field | Cards | Purpose |
| --- | --- | --- |
| `child_id` | All | Stable Chores Manager child ID. |
| `weekly_points_entity` | Daily, Overview, History | Optional explicit weekly-points sensor. Normally selected automatically. |
| `name` | All | Optional display-name override. Blank values fall back to the integration child name. |
| `person_entity` | All | Optional Home Assistant Person override. Normally inherited from the integration child. |
| `locale` | All | `auto`, `en`, or `sv`. |
| `show_border` | All | Show or hide the outer Home Assistant card border. |

The removed daily-card `title` field is ignored. Legacy `child_entity` remains supported for existing Daily and Overview YAML, but new configurations should use `child_id`.

## Daily card

```yaml
type: custom:chores-manager-daily-card
child_id: kid_29
weekly_points_entity: sensor.kid_29_weekly_points
show_header: true
show_border: true
show_person: true
show_points: true
locale: auto
```

The card discovers active assignment switches visible to the current Home Assistant user. Toggling a row calls `switch.turn_on` or `switch.turn_off` and shows an immediate pending state.

## Overview card

```yaml
type: custom:chores-manager-overview-card
child_id: kid_29
show_name: true
show_person: true
show_border: true
person_position: center
person_size: medium
show_points: true
show_previous_week: true
show_adjustments: true
progress_color: "#00a6d6"
rewards:
  - points: 20
    label: Friday candy
    color: "#34c759"
  - points: 30
    label: Friday candy and allowance
    color: "#ff9f0a"
buttons:
  - label: Chores
    icon: mdi:format-list-checks
    color: "#00bcd4"
    tap_action:
      action: navigate
      navigation_path: /dashboard-chores/daily
  - label: Correction
    icon: mdi:wrench-cog
    color: "#9c27b0"
    visibility:
      mode: administrators
    tap_action:
      action: navigate
      navigation_path: /dashboard-chores/correction
```

Rewards define progress targets. `progress_color` applies before the first reward; an optional reward color applies at its threshold. `goal_points` remains a YAML compatibility fallback.

Up to three buttons may use standard Home Assistant tap, hold, and double-tap actions. Button visibility changes presentation only.

## History card

```yaml
type: custom:chores-manager-history-card
child_id: kid_29
weekly_points_entity: sensor.kid_29_weekly_points
locale: auto
show_header: true
show_border: true
show_person: true
show_points: true
```

The card shows immutable completion snapshots from the backend-owned current chore week, grouped by local date with optional row points and daily totals.

## Correction card

```yaml
type: custom:chores-manager-correction-card
child_id: kid_29
locale: auto
show_header: true
show_border: true
```

The administrator-only correction card navigates dates within the current chore week and adds or removes completion snapshots through Chores Manager.

## Popup placement

Each card works directly on a dashboard. When a Bubble Card or another popup wrapper supplies its own header, set `show_header: false`. Set `show_border: false` to remove the outer card border.

Bubble Card, Mushroom, Bar Card, card-mod, helper entities, To-do lists, scripts, and template sensors are not runtime dependencies.

## Person portraits

Associate a child with a Home Assistant Person under **Settings > Devices & services > Chores Manager > Configure > Children**. The cards use that Person's current `entity_picture`.

Chores Manager stores only the Person entity ID. The association affects presentation and never grants access.
