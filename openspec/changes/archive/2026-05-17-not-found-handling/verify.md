# Verification Report: not-found-handling

## Summary

| Dimension    | Status                          |
| ------------ | ------------------------------- |
| Completeness | 21/21 implementation tasks done |
| Correctness  | 3/3 specs covered               |
| Coherence    | Design decisions followed       |

## Completeness

All implementation tasks (1–5) are complete. Tasks 6.1 (push) and 6.2 (PR) are deployment steps, not implementation.

**Files created/modified:**

- `messages/es-ES.json` — added `emptyState` and `errorState` keys
- `src/components/empty-state.tsx` — new EmptyState component
- `src/components/empty-state.test.tsx` — 7 tests
- `src/components/error-state.tsx` — new ErrorState component
- `src/components/error-state.test.tsx` — 7 tests
- `src/components/search-bar.tsx` — refactored to SearchState discriminated union
- `src/components/search-bar.test.tsx` — updated + 5 new state transition tests
- `src/i18n/messages.test.ts` — updated namespaces list
- `src/i18n/request.test.ts` — updated namespaces list

## Correctness

### accessible-search-form spec

- ✅ Search bar is single-mode with auto-scroll to results — form always renders, `feedbackRef` scrolls for success/empty/error
- ✅ Auto-scroll to empty state after search — `useEffect` covers `"empty"` status
- ✅ Auto-scroll to error state after failed search — `useEffect` covers `"error"` status
- ✅ Error/loading states are accessible — `aria-busy` on form, `role="alert"` + `aria-live="polite"` on ErrorState, `role="status"` + `aria-live="polite"` on EmptyState
- ✅ SearchState discriminated union — `idle | loading | success | empty | error` defined in `search-bar.tsx:24-29`

### search-empty-state spec

- ✅ EmptyState displays no-results message with query interpolated — `empty-state.tsx:18` uses `t("title", { query })`
- ✅ EmptyState displays search tips card — `empty-state.tsx:20-25` renders heading and 3 tips
- ✅ EmptyState styled consistently — `rounded-lg`, `p-4`, `bg-muted` classes
- ✅ EmptyState accessible — `role="status"`, `aria-live="polite"` on outer div
- ✅ SearchBar detects empty result set — `search-bar.tsx:56-59` checks `data.resultados.length === 0`

### search-error-state spec

- ✅ ErrorState displays error message from prop — `error-state.tsx:16` renders `{message}`
- ✅ ErrorState provides retry button — `error-state.tsx:20` renders `<button onClick={onRetry}>`
- ✅ ErrorState visually distinct — `text-status-red` and `WarningIcon` used
- ✅ ErrorState accessible — `role="alert"`, `aria-live="polite"` on container div
- ✅ SearchBar transitions to error on failure — `search-bar.tsx:62` and `search-bar.tsx:67`
- ✅ Retry re-submits same query — `handleRetry` in `search-bar.tsx:43-45`

## Coherence

**Design decisions followed:**

- ✅ Discriminated union over loose state triple (Decision 1)
- ✅ Frontend-only empty detection (Decision 2)
- ✅ Separate EmptyState and ErrorState components (Decision 3)
- ✅ ErrorState includes retry (Decision 4)
- ✅ Props interfaces match design (Decision 5)
- ✅ SearchBar render structure follows Decision 6
- ✅ i18n keys match Decision 7

**Code pattern consistency:**

- ✅ Uses `useTranslations` pattern consistent with existing components
- ✅ Uses `NextIntlClientProvider` in tests consistent with existing tests
- ✅ Uses shadcn `Input` and `Button` components
- ✅ Follows `"use client"` directive pattern

## Issues

### CRITICAL

None.

### WARNING

None.

### SUGGESTION

The `search-bar.test.tsx` retry test produces `IntlError: MISSING_MESSAGE` warnings for the `status` namespace from ResultCard. This is pre-existing (ResultCard uses `useTranslations("status")` but the test provider doesn't include it). Not blocking, but could be silenced by adding the `status` namespace to the test messages.

## Final Assessment

All checks passed. Ready for archive.
