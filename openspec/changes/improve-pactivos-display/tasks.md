## 1. Title-case utility

- [ ] 1.1 Write failing tests for `toTitleCase` covering: single word, multi-word, Spanish minor words, first-word minor word, idempotent input
- [ ] 1.2 Implement `toTitleCase` in `src/lib/utils.ts` (or create the file) to pass all tests
- [ ] 1.3 Commit: `feat: add toTitleCase utility with Spanish minor words`

## 2. Export normalizePactivos

- [ ] 2.1 Write failing test that imports `normalizePactivos` from `aine-matcher.ts` and verifies it splits, strips accents, uppercases, and trims
- [ ] 2.2 Export `normalizePactivos` and `stripAccents` from `aine-matcher.ts`
- [ ] 2.3 Commit: `refactor: export normalizePactivos and stripAccents from aine-matcher`

## 3. CompoundPill NEUTRAL level

- [ ] 3.1 Write failing tests for CompoundPill with `level="NEUTRAL"`: renders name only (no family/dot), muted styling, correct aria-label with name only
- [ ] 3.2 Update CompoundPill to accept `level="NEUTRAL"`, render without family separator, use muted styling (`bg-muted text-muted-foreground border border-muted`)
- [ ] 3.3 Commit: `feat: add NEUTRAL level to CompoundPill`

## 4. Title-case in CompoundPill

- [ ] 4.1 Write failing test verifying that CompoundPill applies `toTitleCase` to both `name` and `family` props
- [ ] 4.2 Apply `toTitleCase` to `name` and `family` display text inside CompoundPill; update existing test assertions to expect title-cased output
- [ ] 4.3 Commit: `feat: apply title-case to CompoundPill name and family`

## 5. Result card active ingredient pills

- [ ] 5.1 Write failing tests for new result card layout: "Principios activos:" label present, all tokens rendered as pills, token-to-matchedAine correlation, NEUTRAL pills for non-RED/AMBER tokens, RED/AMBER pills keep existing styling
- [ ] 5.2 Refactor `result-card.tsx`: remove `<p>{pactivos}</p>`, add "Principios activos:" label, split `pactivos` by comma, correlate each token with `matchedAines` via `normalizePactivos`, render as CompoundPill elements (RED/AMBER/NEUTRAL)
- [ ] 5.3 Commit: `feat: replace raw pactivos display with labeled pills section`

## 6. E2E test updates

- [ ] 6.1 Update `e2e/exhaustive/search.spec.ts` to verify "Principios activos:" label and pill rendering for RED/AMBER/GREEN/YELLOW results
- [ ] 6.2 Commit: `test: update e2e tests for active ingredient pills`

## 7. Spec sync and verify

- [ ] 7.1 Run all unit tests to confirm no regressions
- [ ] 7.2 Run lint and typecheck
- [ ] 7.3 Commit: `chore: verify all tests and lint pass`

## 8. Push and Create PR

- [ ] 8.1 Push branch to remote
- [ ] 8.2 Create pull request via `gh` CLI
