## Context

This project uses OpenSpec specs to govern behavior across 7 capabilities. Six of those specs (result-cards, e2e-tests, home-page-content, accessible-search-form, active-ingredient-pills, ui-design-system) hardcode literal Spanish strings and emojis that duplicate content from `messages/es-ES.json`. The seventh (i18n-messages) also embeds literal content in scenarios, undermining its role as the structural authority.

The message catalog was introduced specifically so that all UI-facing text has a single source of truth. But because specs duplicate those strings, any content edit to the JSON risks drifting up to 6 unrelated specs — defeating the purpose.

## Goals / Non-Goals

**Goals:**

- Make `messages/es-ES.json` the sole source of truth for UI string content
- Make `i18n-messages/spec.md` the structural authority over what keys must exist and their semantic purpose/format constraints
- De-reference all 6 other specs so they point to i18n keys by name, not by literal content
- Eliminate spec drift risk from content-only edits to the message catalog

**Non-Goals:**

- Changing any actual string content (wording, emojis, etc.)
- Changing any app code or component behavior
- Altering the key structure of `messages/es-ES.json`
- Introducing new i18n keys or namespaces
- Adding validation tooling for spec/JSON consistency (could be a future change)

## Decisions

### Decision 1: i18n-messages becomes structural-only (Model B)

The i18n-messages spec will define what keys must exist, their semantic purpose, and any format constraints (e.g., ICU plural syntax). It will NOT assert literal string content.

**Rationale**: Model A (spec as full content authority) would still require dual updates for any wording change. Model B eliminates that — content edits touch only the JSON. Key-level changes (add/remove/rename) still require a spec update, which is appropriate since structural changes have broader impact.

**Alternative considered**: Model A — spec copies all literal strings. Rejected because it maintains the same coupling problem, just concentrated in one spec.

### Decision 2: De-referencing pattern for behavior specs

All behavior specs will use the pattern: `SHALL use i18n key <namespace>.<key>` instead of quoting literal content.

Examples:

- Before: `SHALL display "🔴 AINE DETECTADO" in text-status-red color`
- After: `SHALL display the string from i18n key `status.RED.banner` in text-status-red color`

- Before: `aria-label="Principios activos"`
- After: `aria-label from i18n key `status.activeIngredientsLabel``

**Rationale**: This preserves the behavioral contract (what renders where, with what semantics) while decoupling from content. A reviewer can still trace "RED cards must show a banner" without needing the exact text.

### Decision 3: The e2e-tests spec also de-references

Even though e2e tests are integration-level and assert full-stack behavior, the spec will reference i18n keys rather than pinning literal strings. The test implementation can still assert exact rendered text by reading from the JSON at runtime, but the spec contract is key-based.

**Rationale**: If e2e specs hardcoded literal strings, they'd still drift on content changes. The spec governs what the test should verify, not the exact assertion value.

### Decision 4: ICU format constraints remain in i18n-messages spec

Statements like "SHALL use ICU plural format" or "SHALL use ICU `{count, plural, ...}` syntax" are structural contracts the app code depends on, not content. These stay in the spec.

**Rationale**: A key that switches from ICU plural to a plain string would break the consuming component. The format is a structural concern.

## Risks / Trade-offs

- **[Loss of content-level spec governance]** → The spec no longer governs exact wording. A typo or medically inaccurate string change to `messages/es-ES.json` wouldn't be caught by spec review. **Mitigation**: This is acceptable because the JSON is version-controlled and reviewed in PRs. Medical accuracy review should happen at the content level, not the spec level.

- **[Spec readers need to cross-reference]** → To know what a status banner actually says, a reader must look at the JSON. **Mitigation**: This is the desired state — the JSON is the single source of truth. Specs focus on behavior and structure.

- **[Incomplete de-referencing]** → Some specs may embed strings in prose descriptions that are hard to de-reference cleanly. **Mitigation**: Replace the embedded string with a key reference. If the context requires describing what the string says, reference the key and add a brief description (e.g., "the warning message for RED status from i18n key `status.RED.message`").

- **[No automated enforcement yet]** → Nothing prevents a future spec from re-introducing hardcoded strings. **Mitigation**: Could be addressed in a future change with a lint rule or spec validation tool, but out of scope here.
