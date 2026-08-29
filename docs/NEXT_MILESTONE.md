# Current milestone: 0.5.0 shared chore claims

This release makes a shared chore safely read-only on every non-claimant Daily
card.

## Scope

- read shared-completion claimant attributes from Chores Manager `0.8.0`;
- mark a shared chore as claimed by another child;
- disable that row and suppress its switch action;
- retain normal completion and undo behavior for the claiming child.

See [the release notes](RELEASE_0.5.0.md).
