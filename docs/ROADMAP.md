# Roadmap

## Foundation and child cards

- [x] HACS dashboard repository, TypeScript/Lit build, validation workflows, and public documentation.
- [x] Daily card using visible assignment switches for non-admin children.
- [x] Overview card using weekly-points sensors, optional person portraits, configurable rewards, and standard actions.
- [x] Live Home Assistant desktop and mobile acceptance.

## Next release: audited adjustments and previous-week totals

- [ ] Add a parent/admin adjustment experience backed by Chores Manager's audited manual-adjustment API.
- [ ] Add a previous-week total to the overview card using Chores Manager's read API.
- [ ] Keep child-facing cards restricted to their existing assignment-switch workflow.
- [ ] Document required Chores Manager version, authorization, and audit-trail behaviour.

## Later milestones

- [ ] Implement a current-week history card using the backend's parent-user read authorization policy.
- [ ] Implement a dedicated admin correction card.
