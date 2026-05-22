> **For agentic workers:** Follow apply's instructions and don't implement these tasks directly. Instead, use superpowers:subagent-driven-development to implement the plan.md.

## 1. Query detection utility — tests

- [x] 1.1 Write failing tests for `detectQueryType()`: 6-digit → `"cn"`, 7-digit → `"cn"`, 13-digit → `"ean13"`, alphanumeric → `"name"`, short numeric → `"name"`, 8-12 digit → `"name"`, whitespace-trimmed input
- [x] 1.2 Write failing tests for `extractCnFromEan13()`: valid EAN-13 → CN substring at indices 6-11, too-short string → `null`, too-long string → `null`, exact substring extraction at indices 6-12

## 2. Query detection utility — implementation

- [x] 2.1 Implement `detectQueryType()` in `src/lib/query-detection.ts` to pass all tests
- [x] 2.2 Implement `extractCnFromEan13()` in `src/lib/query-detection.ts` to pass all tests
- [x] 2.3 Run tests and confirm all pass; ensure coverage does not decrease
- [x] 2.4 Commit: `feat: add detectQueryType and extractCnFromEan13 utilities`

## 3. Search bar integration — tests

- [x] 3.1 Write failing tests for search bar: CN query routes to `/api/cima?cn=<query>`, EAN-13 query extracts CN and routes to `/api/cima?cn=<extractedCN>`, name query routes to `/api/cima?nombre=<query>`
- [x] 3.2 Write failing tests for fallback: CN 404 → retry with `nombre`, CN empty result → retry with `nombre`, CN success → no retry, fallback also empty → show empty state, name query empty → show empty state (no retry)

## 4. Search bar integration — implementation

- [x] 4.1 Update `src/components/search-bar.tsx` to import and call `detectQueryType()` and `extractCnFromEan13()` on form submit
- [x] 4.2 Add fallback logic: on CN/EAN-13 query, if response is 404 or returns no result, retry with `nombre=<original_query>`
- [x] 4.3 Run tests and confirm all pass; ensure coverage does not decrease
- [x] 4.4 Commit: `feat: integrate query detection and fallback in search bar`

## 5. Placeholder i18n update

- [x] 5.1 Update `messages/es-ES.json`: add or update `search.placeholder` key with value `"Buscar medicamento por nombre, código nacional o código de barras..."`
- [x] 5.2 Update `src/components/search-bar.tsx` to use the `search.placeholder` i18n key instead of the current hardcoded placeholder
- [x] 5.3 Run tests and confirm all pass; ensure coverage does not decrease
- [x] 5.4 Commit: `feat: update search placeholder to indicate CN and barcode support`

## 6. Push and Create PR

- [ ] 6.1 Push the feature branch to remote
- [ ] 6.2 Create pull request via `gh` CLI with a summary of changes
