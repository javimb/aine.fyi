> **For agentic workers:** Follow apply's instructions and don't implement these tasks directly. Instead, use superpowers:subagent-driven-development to implement the plan.md.

## 1. i18n Keys

- [x] 1.1 Add `emptyState` and `errorState` keys to `messages/es-ES.json`
- [x] 1.2 Add TypeScript type definitions for the new i18n keys in the i18n config

## 2. EmptyState Component (TDD)

- [x] 2.1 Write failing tests for `EmptyState` component: renders title with query, renders tips card with all three suggestions, has role="status" and aria-live="polite", uses rounded-lg and p-4 styling
- [x] 2.2 Implement `EmptyState` component in `src/components/empty-state.tsx` to pass all tests
- [x] 2.3 Commit: feat: add EmptyState component for no-results feedback

## 3. ErrorState Component (TDD)

- [x] 3.1 Write failing tests for `ErrorState` component: renders error message from prop, renders retry button with i18n key, calls onRetry on click, has role="alert" and aria-live="polite", uses text-status-red and WarningIcon
- [x] 3.2 Implement `ErrorState` component in `src/components/error-state.tsx` to pass all tests
- [x] 3.3 Commit: feat: add ErrorState component with retry button

## 4. SearchState Type and SearchBar Refactor (TDD)

- [x] 4.1 Define `SearchState` discriminated union type in `src/components/search-bar.tsx` (or a co-located types file)
- [x] 4.2 Write failing tests for SearchBar state transitions: idle → loading, loading → success, loading → success (empty resultados → empty), loading → error, error → retry → loading, scrollIntoView called for empty/error states
- [x] 4.3 Refactor `SearchBar` to use `SearchState` discriminated union replacing `(results, error, loading)` triple
- [x] 4.4 Add empty result detection: `data.resultados?.length === 0` → `{ status: "empty", query }`
- [x] 4.5 Add error detection: non-2xx / network error → `{ status: "error", message }`
- [x] 4.6 Render `EmptyState` when `status === "empty"`, `ErrorState` when `status === "error"`, `ResultList` when `status === "success"`
- [x] 4.7 Add `onRetry` handler that re-submits the search with the current query
- [x] 4.8 Update auto-scroll `useEffect` to cover empty and error states (scroll to the feedback ref)
- [x] 4.9 Remove old error `<p role="alert">` in favor of ErrorState
- [x] 4.10 Commit: refactor: replace SearchBar state triple with SearchState discriminated union

## 5. Update Existing SearchBar Tests

- [x] 5.1 Update `src/components/search-bar.test.tsx` to work with the new `SearchState` type (remove references to `results/error/loading` triple)
- [x] 5.2 Add test messages for `emptyState` and `errorState` to the test provider's messages object
- [x] 5.3 Commit: test: update SearchBar tests for discriminated union state model

## 6. Push and Create PR

- [ ] 6.1 Push branch to remote
- [ ] 6.2 Create pull request via `gh` CLI
