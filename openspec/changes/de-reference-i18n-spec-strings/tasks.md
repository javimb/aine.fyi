## 1. Update i18n-messages spec

- [x] 1.1 Replace the existing `openspec/specs/i18n-messages/spec.md` with the structural-only version from the delta spec at `openspec/changes/de-reference-i18n-spec-strings/specs/i18n-messages/spec.md`, removing all literal string content from scenarios and adding the new namespace key-schema requirements
- [x] 1.2 Verify the updated spec contains no literal Spanish strings or emoji content — only i18n key references and format constraints
- [x] 1.3 Commit: `refactor(specs): make i18n-messages spec structural authority only`

## 2. De-reference result-cards spec

- [x] 2.1 Apply the delta spec from `openspec/changes/de-reference-i18n-spec-strings/specs/result-cards/spec.md` to `openspec/specs/result-cards/spec.md`, replacing all hardcoded banner labels, warning messages, and aria-labels with i18n key references
- [x] 2.2 Verify no literal Spanish strings or emojis remain in `openspec/specs/result-cards/spec.md`
- [x] 2.3 Commit: `refactor(specs): de-reference literal strings in result-cards spec`

## 3. De-reference e2e-tests spec

- [x] 3.1 Apply the delta spec from `openspec/changes/de-reference-i18n-spec-strings/specs/e2e-tests/spec.md` to `openspec/specs/e2e-tests/spec.md`, replacing hardcoded page titles, section headings, status banners, and result count strings with i18n key references
- [x] 3.2 Verify no literal Spanish strings or emojis remain in `openspec/specs/e2e-tests/spec.md`
- [x] 3.3 Commit: `refactor(specs): de-reference literal strings in e2e-tests spec`

## 4. De-reference home-page-content spec

- [x] 4.1 Apply the delta spec from `openspec/changes/de-reference-i18n-spec-strings/specs/home-page-content/spec.md` to `openspec/specs/home-page-content/spec.md`, replacing hardcoded headings, disclaimer text, and attribution strings with i18n key references
- [x] 4.2 Verify no literal Spanish strings or emojis remain in `openspec/specs/home-page-content/spec.md`
- [x] 4.3 Commit: `refactor(specs): de-reference literal strings in home-page-content spec`

## 5. De-reference accessible-search-form spec

- [x] 5.1 Apply the delta spec from `openspec/changes/de-reference-i18n-spec-strings/specs/accessible-search-form/spec.md` to `openspec/specs/accessible-search-form/spec.md`, replacing hardcoded button text and loading-state text with i18n key references
- [x] 5.2 Verify no literal Spanish strings remain in `openspec/specs/accessible-search-form/spec.md`
- [x] 5.3 Commit: `refactor(specs): de-reference literal strings in accessible-search-form spec`

## 6. De-reference active-ingredient-pills spec

- [x] 6.1 Apply the delta spec from `openspec/changes/de-reference-i18n-spec-strings/specs/active-ingredient-pills/spec.md` to `openspec/specs/active-ingredient-pills/spec.md`, replacing the hardcoded `"Principios activos"` aria-label with i18n key `status.activeIngredientsLabel`
- [x] 6.2 Verify no literal Spanish strings remain in `openspec/specs/active-ingredient-pills/spec.md`
- [x] 6.3 Commit: `refactor(specs): de-reference literal strings in active-ingredient-pills spec`

## 7. De-reference ui-design-system spec

- [x] 7.1 Apply the delta spec from `openspec/changes/de-reference-i18n-spec-strings/specs/ui-design-system/spec.md` to `openspec/specs/ui-design-system/spec.md`, replacing hardcoded page title and banner label references with i18n key references
- [x] 7.2 Verify no literal Spanish strings or emojis remain in `openspec/specs/ui-design-system/spec.md`
- [x] 7.3 Commit: `refactor(specs): de-reference literal strings in ui-design-system spec`

## 8. Verify no regressions

- [x] 8.1 Grep all spec files under `openspec/specs/` for literal Spanish strings (emoji characters, quoted text like `"¿Es un AINE?"`, `"🔴"`, `"Principios activos"`, `"Buscando..."`) to confirm complete de-referencing
- [x] 8.2 Confirm `messages/es-ES.json` is unchanged (this is a spec-only refactor, no app code changes)
- [x] 8.3 Commit: `chore(specs): verify complete de-referencing of literal strings`
