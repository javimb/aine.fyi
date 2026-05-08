## Why

Six specs currently hardcode literal UI strings (Spanish text, emojis), creating a coupling where any content edit to `messages/es-ES.json` causes spec drift across multiple files. Only `i18n-messages/spec.md` references keys instead of content, but it too hardcodes exact strings in scenarios. This means touching a single translated string can require updates in up to 6 unrelated specs — a maintenance burden that undermines the single-source-of-truth principle that the message catalog was designed to provide.

## What Changes

- Refactor `i18n-messages/spec.md` to be a **structural authority only**: define what keys must exist, their semantics, and format constraints (e.g., ICU plural syntax), but not the literal string content. Exact wording lives exclusively in `messages/es-ES.json`.
- De-reference all literal UI strings in 6 specs to point to i18n keys by name (e.g., `status.RED.banner` instead of `"🔴 AINE DETECTADO"`), removing content duplication.
- Preserve all behavioral requirements: status color mappings, accessibility semantics, component structure, and typography rules remain unchanged. Only the source-of-truth for string content shifts from specs to the JSON file.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `i18n-messages`: Remove literal string content from scenarios; retain key schema, semantic descriptions, and format constraints only. Add explicit statement that `messages/es-ES.json` is the sole authority for string content.
- `result-cards`: De-reference all hardcoded banner labels, warning messages, and aria-labels to i18n keys.
- `e2e-tests`: De-reference all hardcoded page titles, section headings, status banners, and result count strings to i18n keys.
- `home-page-content`: De-reference hardcoded headings and disclaimer text to i18n keys.
- `accessible-search-form`: De-reference hardcoded button text and loading-state text to i18n keys.
- `active-ingredient-pills`: De-reference hardcoded aria-label text to i18n key.
- `ui-design-system`: De-reference hardcoded page title and banner label text to i18n keys or remove string references that belong in other specs.

## Impact

- No code changes — this is a spec-only refactor.
- 7 spec files will be modified.
- Content governance shifts: wording changes now require updating only `messages/es-ES.json` (and `i18n-messages/spec.md` only if a key is added/removed/renamed, not if content changes).
- Future edits to `messages/es-ES.json` content no longer risk spec drift.
