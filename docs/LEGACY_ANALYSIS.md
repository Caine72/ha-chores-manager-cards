# Legacy resource analysis

The files in `/workspaces/card resources` are household-specific migration references and are deliberately not included in this public repository.

| Legacy concern | Replacement |
| --- | --- |
| Bubble Card popup wrappers and hashes | Standard card placement and configurable Home Assistant actions |
| Mushroom, Bar Card, and Expander Card composition | Native Lit card rendering |
| `counter.*` point totals | Chores Manager weekly-points sensors |
| `input_datetime` correction date | Backend-owned current-week correction window |
| To-do list summary parsing | Chores Manager completion history contract |
| hard-coded input booleans and categories | Assignment switch attributes and stable IDs |
| correction script | `chores_manager/set_current_week_completion` |
| reset, audit, and notification automations | Outside this card package |

The legacy overview contains manual `-1/+1` counter changes and a previous-week total. These capabilities are the next card milestone and will use the latest Chores Manager audited-adjustment and previous-week read APIs rather than legacy helpers.

## Correction popup reference

The household correction view used Bubble Card as a popup shell around a custom
correction card. Its YAML selected one person and child, displayed a counter in the
header, navigated through an `input_datetime`, grouped explicitly listed
`input_boolean` helpers into Morning, Dinner, Cat, and Other sections, and delegated
changes to a correction script.

The dedicated correction-card milestone should preserve the compact portrait/name and
point header, date navigation, category grouping, and large add/remove targets shown in
the reference images. It must derive children, assignments, categories, icons, points,
dates, and completion state from Chores Manager's inventory and correction WebSocket
contracts. Bubble Card, counters, input datetimes, input booleans, summary sensors, and
correction scripts remain migration references rather than runtime dependencies.
