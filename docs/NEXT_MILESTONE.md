# Next milestone: audited adjustments and previous-week totals

Build the parent-facing point-management features that are now supported by the latest Chores Manager backend.

Acceptance requires:

1. A parent or administrator can make a manual point adjustment through Chores Manager's audited API.
2. The UI shows the resulting point total after Home Assistant confirms the backend update.
3. The adjustment workflow is unavailable to child and shared-tablet users unless Home Assistant separately authorizes it.
4. The overview card can show the selected child's previous-week total from the backend read API.
5. The daily child workflow remains reversible through assignment switches and does not gain adjustment privileges.
6. Swedish and English strings cover all new controls, errors, and totals.
7. Desktop and mobile acceptance verifies both authorization boundaries and live state updates.
