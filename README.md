# Chores Manager Cards

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Lovelace%20cards-1677B8?logo=home-assistant&logoColor=white)](https://www.home-assistant.io/)
[![Validate](https://github.com/Caine72/ha-chores-manager-cards/actions/workflows/validate.yml/badge.svg)](https://github.com/Caine72/ha-chores-manager-cards/actions/workflows/validate.yml)

Standalone Lovelace cards for the [Chores Manager](https://github.com/Caine72/ha-chores-manager) custom integration.

The cards present daily chores, weekly progress, current-week history, and administrator correction. Chores, points, permissions, and history remain owned by the integration; this repository is frontend-only.

> [!IMPORTANT]
> These cards are maintained for a private Home Assistant setup and published primarily for HACS installation. Bug reports are welcome, but there is no support or broad compatibility promise.

Development is AI-assisted, with automated validation and live Home Assistant acceptance used to review the resulting behavior.

## Screenshots

The examples use the fictional **Acceptance Avery** test child and a generated documentation-only portrait. No real household profile is shown.

| Overview | Daily chores |
| --- | --- |
| ![Overview card showing weekly progress and point controls](docs/images/overview-card.png) | ![Daily card showing grouped chores and completion state](docs/images/daily-card.png) |

| Current-week history | Correction |
| --- | --- |
| ![History card showing completed chores grouped by day](docs/images/history-card.png) | ![Correction card showing dated add and remove controls](docs/images/correction-card.png) |

## Compatibility

Released cards version `0.2.0` requires Chores Manager `0.5.0` or later. The current development branch adds the history card, automatic child-to-Person portraits, and consistent display-name handling; use it with the matching Chores Manager development branch until those changes are released.

The cards have no runtime dependency on Bubble Card, Mushroom, Bar Card, card-mod, helper entities, To-do lists, scripts, or template sensors.

## Installation

Install this repository as a HACS Dashboard custom repository. HACS normally registers the released JavaScript module automatically. For a manual installation, copy `dist/ha-chores-manager-cards.js` into Home Assistant's `www` directory and register it as a JavaScript module resource.

## Child and portrait selection

Every card selects a child with `child_id`. The visual editor lists children discovered from visible Chores Manager entities and selects the matching weekly-points sensor when needed.

All cards use the same display-name order:

1. card-level `name`, when it contains a value;
2. the child's name from Chores Manager;
3. a localized generic fallback.

The removed daily-card `title` field is ignored. Use `name` only when the dashboard needs an explicit display-name override.

A child may optionally reference a Home Assistant Person under **Settings > Devices & services > Chores Manager > Configure > Children**. Cards use that Person's current `entity_picture`; the integration stores only the entity ID and never copies the image. Card-level `person_entity` remains available as an override. A Person association affects presentation only and never grants access.

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

The daily card discovers active assignment switches visible to the current Home Assistant user. Toggling a row calls `switch.turn_on` or `switch.turn_off`, with an immediate pending state while Home Assistant confirms the change.

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

The overview card reads current and previous totals using the backend-configured chore-week boundary. Compact `-1` and `+1` controls appear only when the backend reports that the signed-in user may control the selected weekly-points sensor. Confirmed totals come from the backend, and subtraction can never reduce the total below zero.

Rewards set progress targets. `progress_color` applies before the first reward, and an optional reward color takes over at its threshold. The expanded section lists available chores by point value and the configured rewards. `goal_points` remains a YAML compatibility fallback.

Up to three action buttons can use standard Home Assistant tap, hold, and double-tap actions. Visibility controls presentation only; backend authorization still applies.

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

The history card lists immutable completion snapshots from the backend-owned current chore week. Entries are grouped by local date with localized weekday headings, optional row points, and daily totals. Reading requires Home Assistant `read` permission for the child's weekly-points sensor.

## Correction card

```yaml
type: custom:chores-manager-correction-card
child_id: kid_29
locale: auto
show_header: true
show_border: true
```

The correction card is administrator-only. It navigates dates within the current chore week and adds or removes completion snapshots through the integration's correction APIs. Categories, icons, point values, dates, and state come from Chores Manager rather than card YAML.

For Bubble Card or another popup wrapper, set `show_header: false` when the wrapper provides its own header. Set `show_border: false` on any card to remove the outer Home Assistant card border.

## Authorization

Card visibility is never authorization.

- Daily state and control use Home Assistant's normal assignment-switch visibility and service permissions.
- Weekly totals and history require `read` permission for the selected weekly-points sensor.
- Manual point adjustments require `control` permission for that sensor.
- Dated correction and structural inventory remain administrator-only.

## Development

Use the supplied dev container or Node 24 with Yarn 4.

```sh
corepack enable
corepack prepare yarn@4.12.0 --activate
yarn install --immutable
yarn validate
```

Pull requests validate linting, TypeScript, unit tests, the production bundle, dependency consistency, HACS metadata, and lockfile policy.

Further detail is available in the [architecture](docs/ARCHITECTURE.md), [migration notes](docs/LEGACY_ANALYSIS.md), [roadmap](docs/ROADMAP.md), and [current acceptance milestone](docs/NEXT_MILESTONE.md).
