# Roadmap

## Foundation and child cards

- [x] HACS dashboard repository, TypeScript/Lit build, validation workflows, and public documentation.
- [x] Daily card using visible assignment switches for non-admin children.
- [x] Overview card using weekly-points sensors, optional person portraits, configurable rewards, and standard actions.
- [x] Live Home Assistant desktop and mobile acceptance.

## Next release: audited adjustments and previous-week totals

- [x] Add a parent/admin adjustment experience backed by Chores Manager's audited manual-adjustment API.
- [x] Add a previous-week total to the overview card using Chores Manager's read API.
- [x] Keep child-facing cards restricted to their existing assignment-switch workflow.
- [x] Document required Chores Manager version, authorization, and audit-trail behaviour.

## Current milestone: current-week history

- [x] Implement a standalone current-week history card using the backend's entity read authorization policy.
- [x] Group immutable completion snapshots by local date with localized day headings and daily totals.
- [x] Support visual editing and borderless/headerless Bubble Card embedding without a Bubble Card dependency.
- [ ] Complete live desktop and mobile acceptance against the matching backend branch.

## Later milestones

- [x] Implement a dedicated admin correction card.
