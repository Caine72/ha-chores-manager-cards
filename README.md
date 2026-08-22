# Chores Manager Cards

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Lovelace%20cards-1677B8?logo=home-assistant&logoColor=white)](https://www.home-assistant.io/)

Standalone Lovelace cards for the [Chores Manager](https://github.com/Caine72/ha-chores-manager) custom integration.

> [!IMPORTANT]
> These cards are maintained for a private Home Assistant setup and published primarily for HACS installation. Bug reports are welcome, but there is no support or broad compatibility promise.

Development is AI-assisted.

## Screenshots

The examples use the fictional **Acceptance Avery** test child and a generated documentation-only portrait. No real household profile is shown.

| Overview | Daily chores |
| --- | --- |
| ![Overview card showing weekly progress and point controls](docs/images/overview-card.png) | ![Daily card showing grouped chores and completion state](docs/images/daily-card.png) |

| Current-week history | Correction |
| --- | --- |
| ![History card showing completed chores grouped by day](docs/images/history-card.png) | ![Correction card showing dated add and remove controls](docs/images/correction-card.png) |

## Cards

- **Daily** — grouped chores with point values and immediate completion controls.
- **Overview** — weekly progress, rewards, previous-week points, adjustments, and dashboard actions.
- **History** — completed chores grouped by day within the current chore week.
- **Correction** — administrator controls for adding or removing dated current-week completions.

All cards support visual configuration, Swedish and English presentation, border controls, and portraits from a Home Assistant Person associated with the selected child. Daily, History, and Correction can also hide their standalone headers for popup placement.

## Installation

Install this repository as a HACS Dashboard custom repository.

For a manual installation, copy `dist/ha-chores-manager-cards.js` into Home Assistant's `www` directory and register it as a JavaScript module resource.

## Configuration

Cards select a child by the stable Chores Manager `child_id`. The visual editor lists available children and matching weekly-points entities.

Display names resolve from an optional card `name`, then the integration child name. Portraits resolve from the child's associated Home Assistant Person, with an optional card-level `person_entity` override.

See the [configuration guide](docs/CONFIGURATION.md) for YAML examples, display options, rewards, actions, popup placement, and compatibility fields.

## Authorization

Card visibility is not authorization.

- Daily controls use Home Assistant's assignment-switch permissions.
- Weekly totals and history require access to the selected weekly-points sensor.
- Point adjustments require control permission for that sensor.
- Dated correction remains administrator-only.

The integration owns chores, points, history, permissions, and week boundaries. These cards do not store household data.

## Documentation

- [Configuration](docs/CONFIGURATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Migration notes](docs/LEGACY_ANALYSIS.md)
- [Roadmap](docs/ROADMAP.md)
