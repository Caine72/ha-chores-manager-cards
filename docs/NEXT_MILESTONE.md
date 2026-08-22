# Next milestone: authorized current-week history

Build a standalone history card on the integration-owned, entity-authorized completion-history contract.

Acceptance requires:

1. A card can select one child through YAML or the visual editor.
2. The backend returns only that child's immutable completion snapshots from the configured current chore week.
3. Home Assistant read permission for the child's weekly-points sensor is enforced by the backend.
4. The card groups entries by local date, localizes weekday headings, and shows optional row points and daily totals.
5. Empty and authorization/load-failure states are clear in Swedish and English.
6. Header, portrait, points, and outer border can be toggled for standalone or popup placement.
7. Template sensors, Markdown cards, To-do lists, Bubble Card, and card-mod remain optional migration references rather than dependencies.
8. Automated tests and live desktop/mobile acceptance cover rendering, refresh, authorization, and responsive layout.
