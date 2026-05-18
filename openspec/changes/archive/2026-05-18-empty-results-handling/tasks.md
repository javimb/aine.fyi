> **For agentic workers:** Follow apply's instructions and don't implement these tasks directly. Instead, use superpowers:subagent-driven-development to implement the plan.md.

## 1. Add i18n key for empty results

- [x] 1.1 Add `search.emptyResults` key to `messages/es-ES.json` with Spanish-language plain text message (no emoji)
- [x] 1.2 Commit: feat(i18n): add search.emptyResults message key

## 2. EmptyResults component (TDD)

- [x] 2.1 Write failing tests for EmptyResults component: renders neutral/muted message from i18n key `search.emptyResults`, has `role="status"` and `aria-live="polite"`, does not use status color styling
- [x] 2.2 Implement EmptyResults component at `src/components/empty-results.tsx` to pass tests
- [x] 2.3 Commit: feat: add EmptyResults component with accessible empty state

## 3. SearchBar empty state integration (TDD)

- [x] 3.1 Write failing tests for SearchBar empty state: sets `isEmpty` to `true` when API returns empty `resultados`, renders EmptyResults when `isEmpty && !error`, suppresses EmptyResults when error is present, resets `isEmpty` on new search and on results found
- [x] 3.2 Add `isEmpty` state to SearchBar, detect empty `resultados` array in fetch handler, render `<EmptyResults />` conditionally
- [x] 3.3 Commit: feat(search): integrate EmptyResults into SearchBar with isEmpty state

## 4. Push and Create PR

- [x] 4.1 Push branch to remote
- [x] 4.2 Create pull request via gh CLI
