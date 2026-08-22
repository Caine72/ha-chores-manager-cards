# Roadmap

## Available cards

- [x] Daily chores from visible assignment switches.
- [x] Weekly overview with rewards, previous-week totals, and audited adjustments.
- [x] Administrator correction within the backend-owned current chore week.
- [x] Entity-authorized current-week history.
- [x] Visual editors, border controls, localization, and optional Person portraits.

## Current release work

- [x] Align card naming on `name` → integration child name → localized fallback.
- [x] Document automatic child-to-Person portrait resolution.
- [x] Add public screenshots with fictional test data.
- [ ] Complete signed-in desktop and mobile acceptance on the matching backend branch.
- [ ] Prepare release notes and version compatibility before merging.

## Later

- Improve accessible labels and keyboard behavior where live acceptance identifies gaps.
- Add diagnostics for missing or unavailable selected entities without moving business data into the frontend.
- Consider broader history ranges only after the backend defines retention, authorization, and pagination.
- Keep Home Assistant actions and wrapper compatibility independent from any one popup card.
