# Chores Manager Cards 0.3.0

## Summary

Chores Manager Cards `0.3.0` adds current-week history and completes the shared child presentation model across all four cards.

## Added

- Standalone current-week History card with visual editor.
- Day grouping, localized weekday headings, row points, and daily totals.
- Automatic portraits from the Home Assistant Person associated with an integration child.
- Public card screenshots using fictional test data.

## Changed

- Overview, Daily, History, and Correction use the same display-name precedence: card `name`, integration child name, localized fallback.
- The removed Daily `title` field is ignored; use `name` for an explicit override.
- Card-level `person_entity` remains available as a portrait override.

## Compatibility

- Requires Chores Manager `0.6.0` or later.
- Existing `child_entity`, action, reward, popup, and border configuration remains supported as documented.
- No Bubble Card, Mushroom, card-mod, helper entity, script, To-do list, or template-sensor dependency is introduced.

## Final release steps

- [ ] Change `package.json` from `0.2.0` to `0.3.0`.
- [ ] Change `CARD_VERSION` in `src/const.ts` from `0.2.0` to `0.3.0`.
- [ ] Rebuild `dist/ha-chores-manager-cards.js` and run full validation.
- [ ] Merge the release pull request and confirm checks on `main`.
- [ ] Publish `v0.3.0` after Chores Manager `v0.6.0`; confirm the release workflow attaches the JavaScript bundle.
