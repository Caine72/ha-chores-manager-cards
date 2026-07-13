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

The legacy overview contains manual `-1/+1` counter changes and a previous-week total. Chores Manager `0.3.0` has neither capability. Manual adjustments are a future audited backend milestone; the previous-week value is hidden until a backend read contract exists.
