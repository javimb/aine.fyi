## 1. Remove Left Border from Component

- [ ] 1.1 Remove `border-l-4` and `${config.border}` from the card's className in `result-card.tsx`
- [ ] 1.2 Remove the `border` key from each entry in `STATUS_CONFIG` (RED, AMBER, GREEN, YELLOW)
- [ ] 1.3 Commit: `refactor(result-card): remove left border from result cards`

## 2. Update Tests

- [ ] 2.1 Write failing test: assert that cards do NOT have `border-l-4` or `border-l-status-*-border` classes, and assert they DO have background classes
- [ ] 2.2 Run tests to confirm failure
- [ ] 2.3 Verify all existing tests still pass with the implementation changes from task group 1
- [ ] 2.4 Commit: `test(result-card): update assertions for removed left border`

## 3. Push and Create PR

- [ ] 3.1 Push branch to remote
- [ ] 3.2 Create pull request via `gh` CLI
