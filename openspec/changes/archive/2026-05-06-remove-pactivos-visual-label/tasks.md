## 1. Tests

- [x] 1.1 Update `result-card.test.tsx`: change assertions for `"Principios activos:"` visible text to assert `aria-label="Principios activos"` on the pills container; remove any assertions that the visible label text is in the document
- [x] 1.2 Update `e2e/exhaustive/search.spec.ts`: replace `toContainText("Principios activos:")` assertions with assertions that the pills section has `aria-label="Principios activos"`

## 2. Implementation

- [x] 2.1 In `result-card.tsx`: remove the `<p className="text-sm font-medium text-muted-foreground">Principios activos:</p>` element; add `aria-label="Principios activos"` to the `<div role="list">` element
- [x] 2.2 Commit: `refactor(result-card): remove visible principios activos label, use aria-label for accessibility`

## 3. Verify

- [x] 3.1 Run unit tests and confirm all pass
- [x] 3.2 Run E2E tests and confirm all pass
- [x] 3.3 Run lint and typecheck

## 4. Push and Create PR

- [x] 4.1 Push branch to remote
- [x] 4.2 Create pull request via `gh` CLI
