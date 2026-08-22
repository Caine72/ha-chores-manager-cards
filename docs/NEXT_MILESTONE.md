# Current milestone: history-card release acceptance

The standalone history card and its matching backend contract are implemented. The remaining milestone is release acceptance and documentation alignment.

## Completed

- child selection through YAML and the visual editor;
- entity-authorized current-week history reads;
- immutable completion rows grouped by local day;
- Swedish and English weekday, empty, and error presentation;
- optional header, portrait, points, and border;
- automatic child-to-Person portrait resolution;
- consistent `name` handling across all cards;
- automated card tests and production build validation;
- public screenshots using a fictional test child.

## Acceptance before release

1. Validate Overview, Daily, History, and Correction against the matching backend in a signed-in Home Assistant session.
2. Check desktop and mobile widths, including long chore names and tall correction lists.
3. Confirm non-admin read/control boundaries with restricted test users.
4. Confirm Bubble Card embedding with header and border disabled.
5. Verify HACS installation and resource refresh from the release artifact.

Template sensors, Markdown cards, To-do lists, helper entities, Bubble Card, and card-mod remain migration references rather than runtime dependencies.
