## 1. Install and configure next-intl

- [ ] 1.1 Install `next-intl` dependency
- [ ] 1.2 Create `src/i18n/config.ts` with locale list (`es-ES`) and default locale export
- [ ] 1.3 Create `src/i18n/request.ts` with `getRequestConfig` providing `es-ES` messages
- [ ] 1.4 Create `messages/es-ES.json` with empty skeleton namespaces: `app`, `search`, `status`, `results`, `explainer`, `disclaimer`, `dataSource`, `api`
- [ ] 1.5 Add `i18n/request.ts` path to `next.config.ts` via next-intl plugin or config

## 2. Write tests for message catalog and configuration

- [ ] 2.1 Write test: `i18n/config.ts` exports correct locale list and default locale
- [ ] 2.2 Write test: `messages/es-ES.json` is valid JSON with all required namespaces
- [ ] 2.3 Write test: `getRequestConfig` returns correct locale and messages for es-ES

- [ ] Commit: `feat: add next-intl dependency and configuration`

## 3. Populate message catalog and wire provider

- [ ] 3.1 Fill `messages/es-ES.json` with all current hardcoded UI strings organized by namespace (app, search, status, results, explainer, disclaimer, dataSource, api)
- [ ] 3.2 Add `NextIntlClientProvider` wrapper in `src/app/layout.tsx`, wrapping `{children}` with `locale` and `messages` props
- [ ] 3.3 Confirm `layout.tsx` still renders `<html lang="es-ES">` (locale derived from config, not hardcoded string for the attribute value)

- [ ] Commit: `feat: add message catalog and NextIntlClientProvider`

## 4. Migrate server components to next-intl

- [ ] 4.1 Write failing test: `page.tsx` renders title and description from message catalog keys (`app.title`, `app.description`)
- [ ] 4.2 Migrate `src/app/page.tsx` — convert `<h1>` and `<p>` to use `getTranslations('app')`
- [ ] 4.3 Write failing test: `aine-explainer` renders heading and body from message catalog
- [ ] 4.4 Migrate `src/components/aine-explainer.tsx` — use `getTranslations('explainer')`
- [ ] 4.5 Write failing test: `disclaimer` renders heading and body from message catalog
- [ ] 4.6 Migrate `src/components/disclaimer.tsx` — use `getTranslations('disclaimer')`
- [ ] 4.7 Write failing test: `data-source` renders attribution with interpolated date from message catalog
- [ ] 4.8 Migrate `src/components/data-source.tsx` — use `getTranslations('dataSource')` with ICU `{date}` interpolation

- [ ] Commit: `feat: migrate server components to next-intl translations`

## 5. Migrate metadata to generateMetadata

- [ ] 5.1 Write failing test: layout metadata `title` and `description` come from message catalog
- [ ] 5.2 Convert `src/app/layout.tsx` static `metadata` export to `generateMetadata` async function using `getTranslations('app')`
- [ ] 5.3 Write failing test: `openGraph.locale` is still `es_ES`
- [ ] 5.4 Verify `openGraph.locale` is derived from locale config, not a hardcoded string value

- [ ] Commit: `feat: migrate layout metadata to generateMetadata with next-intl`

## 6. Migrate client components to next-intl

- [ ] 6.1 Write failing test: `search-bar` reads all strings from translations (formLabel, inputLabel, placeholder, button, buttonLoading, error)
- [ ] 6.2 Migrate `src/components/search-bar.tsx` — add `"use client"` (already present), use `useTranslations('search')`
- [ ] 6.3 Write failing test: `result-card` reads status labels, messages, and ARIA labels from translations
- [ ] 6.4 Migrate `src/components/result-card.tsx` — extract `banner` and `message` from `STATUS_CONFIG`, replace with `useTranslations('status')` calls; keep style properties (`bg`, `text`) in component
- [ ] 6.5 Write failing test: `result-list` uses ICU plural format for result count
- [ ] 6.6 Migrate `src/components/result-list.tsx` — use `useTranslations('results')` with ICU plural `{count, plural, one {…} other {…}}`

- [ ] Commit: `feat: migrate client components to next-intl translations`

## 7. Migrate API route error messages

- [ ] 7.1 Write failing test: `/api/cima` error responses use strings from message catalog
- [ ] 7.2 Migrate `src/app/api/cima/route.ts` — import `messages/es-ES.json` directly and reference `api.missingParams`, `api.internalError`, `api.upstreamError` keys

- [ ] Commit: `feat: migrate API route error messages to message catalog`

## 8. Remove all hardcoded strings and update existing tests

- [ ] 8.1 Audit all component files for remaining hardcoded Spanish strings — there should be zero
- [ ] 8.2 Update `src/app/layout.test.tsx` to assert against message catalog values
- [ ] 8.3 Update `src/app/page.test.tsx` to assert against message catalog values
- [ ] 8.4 Update `src/components/result-card.test.tsx` to assert against translated values
- [ ] 8.5 Update `src/components/search-bar.test.tsx` to assert against translated values
- [ ] 8.6 Update `src/components/result-list.test.tsx` to assert against translated values
- [ ] 8.7 Update `src/components/data-source.test.tsx` to assert against translated values
- [ ] 8.8 Update e2e tests (`e2e/smoke.spec.ts`, `e2e/exhaustive/search.spec.ts`) if they assert on hardcoded Spanish strings
- [ ] 8.9 Run full test suite and confirm all tests pass with no coverage decrease

- [ ] Commit: `test: update existing tests for next-intl message catalog`

## 9. Update i18n-lang spec

- [ ] 9.1 Update `openspec/specs/i18n-lang/spec.md` to reflect that `lang` attribute and `openGraph.locale` are now derived from next-intl locale config, and that page metadata is sourced from the message catalog

- [ ] Commit: `docs: update i18n-lang spec for next-intl integration`

## 10. Push and Create PR

- [ ] 10.1 Push branch to remote
- [ ] 10.2 Create pull request via `gh` CLI
