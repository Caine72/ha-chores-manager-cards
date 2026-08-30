# Card configuration

Every card has a visual editor. YAML remains available for dashboard source control and advanced Home Assistant actions.

## Common fields

| Field | Cards | Purpose |
| --- | --- | --- |
| `child_id` | Daily, Overview, History, Correction | Stable Chores Manager child ID. |
| `weekly_points_entity` | Daily, Overview, History | Optional explicit weekly-points sensor. Normally selected automatically. |
| `name` | Daily, Overview, History, Correction | Optional display-name override. Blank values fall back to the integration child name. |
| `person_entity` | Daily, Overview, History, Correction | Optional Home Assistant Person override. Normally inherited from the integration child. |
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

With Chores Manager `0.8.0` or newer, a shared chore claimed by a different
child is shown as completed but disabled on this child's Daily card. The row
identifies the child who claimed it; only the claimant can undo it from their
Daily card.

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
adjustment_visibility:
  mode: allow-list
  users:
    - parent-user-id
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

Point adjustments and up to three buttons may use `all`, `administrators`, `allow-list`, or `deny-list` visibility. These rules change presentation only; any authenticated Home Assistant user can call the adjustment API directly. Buttons also support standard Home Assistant tap, hold, and double-tap actions.

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

## Quick Chore card

```yaml
type: custom:chores-manager-quick-chore-card
title: Blixten and Tusse's food
children:
  - child_id: kid_38
  - child_id: kid_39
chores:
  - chore_id: chore_1
    display_name: Morning (00–14)
    start_time: "00:00"
    end_time: "14:00"
    icon: mdi:food-croissant
    color: "#ffc107"
  - chore_id: chore_2
    display_name: Evening (14–23)
    start_time: "14:00"
    end_time: "24:00"
    icon: mdi:food-steak
    color: "#9c6ade"
shortcut_mode: time_window
status_layout: rows
density: comfortable
shortcut_person_size: medium
show_manual_actions: true
show_reset_action: true
show_border: true
locale: auto
```

The card requires one or more children and shared chores. Status rows inherit
the chore name and icon by default. Child shortcuts claim the first unfinished
chore, or the chore whose optional time window contains the current local time.
Once claimed, other children cannot undo that occurrence.

Manual buttons call `chores_manager.complete_chore_manually`, awarding no child
and no points. The optional reset menu reverses either the manual occurrence or
the claiming child's switch action. Manual completion and reset require Chores
Manager `0.9.0` or newer.

The visual editor supports reordering children and chores, optional display
names, status rows or columns, three density levels, three portrait sizes, and
manual-button icon and color customization.

## Person portraits

Associate a child with a Home Assistant Person under **Settings > Devices & services > Chores Manager > Configure > Children**. The cards use that Person's current `entity_picture`.
