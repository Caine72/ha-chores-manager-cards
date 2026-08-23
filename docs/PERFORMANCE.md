# Performance

Run the focused performance regression suite with:

```sh
yarn test:performance
```

The tests keep these behaviors stable:

| Path | Before | Current budget |
| --- | ---: | ---: |
| State-registry enumerations for one card data lookup | 4 | 1 |
| Card renders after an unrelated Home Assistant state update | 1 | 0 |
| Home Assistant calls for two concurrent identical reads | 2 | 1 |

Derived history groups and correction rows are also reused until their source data changes.
