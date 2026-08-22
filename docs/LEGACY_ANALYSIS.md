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

The legacy overview contains manual `-1/+1` counter changes and a previous-week total. The overview card now uses Chores Manager's audited-adjustment and previous-week read APIs rather than legacy helpers.

## History popup reference

The household history view rendered a child-specific Markdown attribute from a template sensor inside a Bubble Card popup. Its useful presentation contract is a compact list of the current week's completed chores grouped by day, with each snapshot's points and a daily total.

The standalone history card preserves that hierarchy while reading structured snapshots from `chores_manager/current_week_history`. The integration owns child scoping, authorization, week boundaries, and immutable completion data. Template sensors, To-do list parsing, Markdown, card-mod, and Bubble Card remain optional migration references and are not imported by the card.

## Correction popup reference

The household correction view used Bubble Card as a popup shell around a custom
correction card. Its YAML selected one person and child, displayed a counter in the
header, navigated through an `input_datetime`, grouped explicitly listed
`input_boolean` helpers into Morning, Dinner, Cat, and Other sections, and delegated
changes to a correction script.

The dedicated correction card preserves the compact portrait/name and point header,
date navigation, category grouping, and large add/remove targets from the reference
interface. Children, assignments, categories, icons, points, dates, and completion
state come from Chores Manager's inventory and correction WebSocket contracts. Bubble
Card, counters, input datetimes, input booleans, summary sensors, and correction scripts
remain migration references rather than runtime dependencies.
