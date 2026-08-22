# Roadmap

## Available cards

- [x] Daily chores from visible assignment switches.
- [x] Weekly overview with rewards, previous-week totals, and audited adjustments.
- [x] Administrator correction within the backend-owned current chore week.
- [x] Entity-authorized current-week history.
- [x] Visual editors, border controls, localization, and optional Person portraits.

## Current release: 0.3.0

- [x] Align card naming on `name` → integration child name → localized fallback.
- [x] Document automatic child-to-Person portrait resolution.
- [x] Add public screenshots with fictional test data.
- [x] Prepare version compatibility and release notes.
- [ ] Apply the version bump, merge, and publish after backend `0.6.0`.

## Later

- Improve accessible labels and keyboard behavior where live acceptance identifies gaps.
- Add diagnostics for missing or unavailable selected entities without moving business data into the frontend.
- Consider broader history ranges only after the backend defines retention, authorization, and pagination.
- Keep Home Assistant actions and wrapper compatibility independent from any one popup card.
