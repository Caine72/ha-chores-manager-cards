# Chores Manager Cards

Standalone Lovelace cards for the [Chores Manager](https://github.com/Caine72/ha-chores-manager) custom integration.

This project requires Chores Manager `0.3.0` or later. It does not replace the integration and it does not store household data.

## Status

The initial development version provides child-facing daily and overview cards. History and admin correction are planned as separate milestones.

## Installation

Install this repository as a HACS Dashboard repository after the first release. Until then, build the bundle locally and register `dist/ha-chores-manager-cards.js` as a JavaScript module resource.

## Daily card

```yaml
type: custom:chores-manager-daily-card
child_id: kid_1
name: Alex
person_entity: person.alex
locale: auto
```

The card discovers active Chores Manager switches that are visible to the current Home Assistant user. It does not need Bubble Card or a hard-coded list of entity IDs.

## Overview card

```yaml
type: custom:chores-manager-overview-card
child_id: kid_1
name: Alex
person_entity: person.alex
goal_points: 20
rewards:
  - points: 20
    label: Friday candy
  - points: 30
    label: Friday candy and allowance
daily_action:
  action: navigate
  navigation_path: /dashboard-chores/daily
```

`history_action` and `correction_action` accept the same standard Home Assistant action format. They are optional, so the overview is not coupled to any popup implementation.

## Development

Use the supplied dev container or Node 24 with Yarn 4.

```sh
corepack enable
corepack prepare yarn@4.12.0 --activate
yarn install --immutable
yarn validate
```

See [the architecture](docs/ARCHITECTURE.md), [legacy analysis](docs/LEGACY_ANALYSIS.md), and [roadmap](docs/ROADMAP.md).
