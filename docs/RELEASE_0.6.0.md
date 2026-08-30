# Chores Manager Cards 0.6.0

## Added

- Quick Chore card for one or more shared household tasks.
- Compact status rows or columns with claimant portraits and completion time.
- Child portrait shortcuts using first-unfinished or time-window selection.
- Zero-point manual completion buttons and an optional reset menu.
- Visual configuration with reorderable children and chores.
- Compact, normal, and comfortable density options.
- Optional manual-button icons, colors, display names, and section titles.

## Behavior

- A child claim locks the shared occurrence for every other child.
- Manual completion assigns no child and awards no points.
- Completion time follows the Home Assistant user's time-format preference.
- Disabling the card border removes only the outline and preserves its surface.

## Compatibility

- Manual completion and reset require Chores Manager `0.9.0` or newer.
- Bubble Card, Mushroom, helper entities, scripts, and template sensors are not
  runtime dependencies.
