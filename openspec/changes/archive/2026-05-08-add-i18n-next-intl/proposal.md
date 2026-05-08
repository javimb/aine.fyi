## Why

UI strings are hardcoded across 9 source files (~32 distinct strings), making them difficult to review as a group. A medical professional needs to review all patient-facing text for accuracy, but currently must hunt through component files to find every string. Centralizing strings via next-intl makes review tractable and establishes a foundation for future locale support.

## What Changes

- Add `next-intl` as a project dependency
- Create a `messages/es-ES.json` file containing all UI strings (client-facing, server-rendered, and API error responses)
- Add next-intl configuration (`i18n/config.ts`, `i18n/request.ts`) using the Provider-Only pattern (no `[locale]` route segment)
- Wrap the app in `NextIntlClientProvider` in the root layout
- Convert all 9 component/source files from hardcoded Spanish strings to next-intl `useTranslations()` / `getTranslations()` calls
- Migrate `metadata` export in `layout.tsx` to `generateMetadata` using `getTranslations()`
- Handle the singular/plural pattern in `result-list.tsx` using next-intl's ICU message syntax
- Update existing tests that assert on hardcoded Spanish strings

## Capabilities

### New Capabilities

- `i18n-messages`: Centralized message catalog for all UI strings, with type-safe access via next-intl's `useTranslations` / `getTranslations` hooks

### Modified Capabilities

- `i18n-lang`: Expands scope from HTML lang/OG locale metadata to include next-intl provider configuration and message catalog integration

## Impact

- **Dependencies**: Adds `next-intl` package
- **Code**: Every component with hardcoded strings changes import/usage pattern (`search-bar`, `result-card`, `result-list`, `aine-explainer`, `disclaimer`, `data-source`, `page.tsx`, `layout.tsx`, `api/cima/route.ts`)
- **Tests**: All test files asserting on Spanish string literals update to reference message keys or translated values
- **New files**: `src/i18n/config.ts`, `src/i18n/request.ts`, `messages/es-ES.json`
- **No breaking API changes**: URL structure stays the same (no locale segment)
