# Chores Manager Cards agent instructions

## Product scope

This repository contains frontend-only Home Assistant Lovelace cards for Chores Manager. Keep backend ownership, storage, and authorization in the `ha-chores-manager` repository.

## Architecture

- Require Chores Manager version `0.3.0` or newer.
- Stable IDs and WebSocket contracts are backend-owned interfaces.
- Daily and overview cards must work for non-admin users using entities visible to their Home Assistant user.
- Never treat conditional card rendering as authorization.
- History needs a backend-enforced parent authorization milestone before non-admin parents can use it.
- Correction remains admin-only.
- Bubble Card, Mushroom, Bar Card, helper entities, counters, To-do lists, scripts, and automations are migration references only. Do not add them as runtime dependencies.

## Development workflow

1. Inspect `git status`, `docs/ROADMAP.md`, and `docs/NEXT_MILESTONE.md` before work.
2. Work on a branch and open a pull request for every change after the initial repository bootstrap.
3. Run `yarn validate` and `git diff --check` before committing.
4. Do not create a GitHub release until the merged commit's GitHub Actions have passed.
5. Validate UI changes against a live Home Assistant instance at desktop and mobile viewport sizes.

## Environment

- Repository: `/workspaces/ha-chores-manager-cards`
- Backend: `/workspaces/ha-chores-manager`
- Legacy migration references: `/workspaces/card resources`
