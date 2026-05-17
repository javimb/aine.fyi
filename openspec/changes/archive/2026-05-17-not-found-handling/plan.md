# Not-Found Handling Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Add friendly empty-state and error-state feedback to the medication search, replacing SearchBar's loose state triple with a discriminated union.

**Architecture:** Two new client components (`EmptyState`, `ErrorState`) each with their own i18n keys and unit tests, plus a refactor of `SearchBar` to use a `SearchState` discriminated union that renders the appropriate feedback component per state.

**Tech Stack:** Next.js, React (client components), next-intl, Tailwind CSS, Vitest, @testing-library/react

---

## Task 1: i18n Keys

- [ ] **Step 1.1:** Add `emptyState` and `errorState` keys to `messages/es-ES.json`. The `emptyState` section needs `title` (with `{query}` ICU interpolation), `tipHeading`, `tipSpelling`, `tipGeneric`, `tipBrand`. The `errorState` section needs `title` and `retry`. Keep `search.error` for the error message string used by the catch block.
  ```json
  "emptyState": {
    "title": "No encontramos \"{query}\"",
    "tipHeading": "Sugerencias",
    "tipSpelling": "Revisa la ortografía del nombre",
    "tipGeneric": "Prueba con el nombre genérico (principio activo)",
    "tipBrand": "Prueba con el nombre comercial del medicamento"
  },
  "errorState": {
    "title": "Error al consultar",
    "retry": "Reintentar"
  }
  ```
- [ ] **Step 1.2:** Check if the i18n TypeScript config auto-generates types from `messages/es-ES.json`. If not, add the type definitions for `emptyState` and `errorState` keys manually.
- [ ] **Step 1.3:** Run `npx vitest run --reporter=verbose` to confirm existing tests still pass with the new keys.
- [ ] **Step 1.4:** Commit: `chore: add emptyState and errorState i18n keys`

---

## Task 2: EmptyState Component (TDD)

- [ ] **Step 2.1:** Create `src/components/empty-state.test.tsx`. Write failing tests:
  - Renders with the query interpolated in the title (using `emptyState.title` with ICU `{query}`)
  - Renders a tips heading from `emptyState.tipHeading`
  - Renders all three tips: `emptyState.tipSpelling`, `emptyState.tipGeneric`, `emptyState.tipBrand`
  - Has `role="status"` on the outer container
  - Has `aria-live="polite"` on the outer container
  - Has `rounded-lg` and `p-4` classes on the card element
  - All text comes from `useTranslations("emptyState")`

  Use the same `NextIntlClientProvider` wrapper pattern from `search-bar.test.tsx` with `emptyState` messages.

- [ ] **Step 2.2:** Run `npx vitest run src/components/empty-state.test.tsx` — confirm all tests fail.
- [ ] **Step 2.3:** Create `src/components/empty-state.tsx`. Implement the component:
  ```tsx
  "use client";
  import { useTranslations } from "next-intl";
  // Props: { query: string }
  // Render: div with role="status" aria-live="polite" className="rounded-lg bg-muted p-4 mt-4"
  //   - h3 with interpolated title from t("title", { query })
  //   - div with tip heading and ul with three li tips
  // Style: rounded-lg, p-4, bg-muted (neutral card style)
  ```
- [ ] **Step 2.4:** Run `npx vitest run src/components/empty-state.test.tsx` — confirm all tests pass.
- [ ] **Step 2.5:** Run full test suite `npx vitest run` to check no regressions.
- [ ] **Step 2.6:** Commit: `feat: add EmptyState component for no-results feedback`

---

## Task 3: ErrorState Component (TDD)

- [ ] **Step 3.1:** Create `src/components/error-state.test.tsx`. Write failing tests:
  - Renders the error message from the `message` prop
  - Renders a retry button with text from `errorState.retry`
  - Calls `onRetry` callback when the retry button is clicked
  - Has `role="alert"` on the message container
  - Has `aria-live="polite"` on the message container
  - Uses `text-status-red` on the error message text
  - Renders a `WarningIcon` before the error message

  Use `NextIntlClientProvider` with `errorState` messages. Mock `onRetry` with `vi.fn()`.

- [ ] **Step 3.2:** Run `npx vitest run src/components/error-state.test.tsx` — confirm all tests fail.
- [ ] **Step 3.3:** Create `src/components/error-state.tsx`. Implement the component:
  ```tsx
  "use client";
  import { useTranslations } from "next-intl";
  import WarningIcon from "@/components/warning-icon";
  // Props: { message: string; onRetry: () => void }
  // Render: div with role="alert" aria-live="polite" className="rounded-lg p-4 mt-4"
  //   - Error message with WarningIcon + text in text-status-red
  //   - Button with t("retry") that calls onRetry
  ```
- [ ] **Step 3.4:** Run `npx vitest run src/components/error-state.test.tsx` — confirm all tests pass.
- [ ] **Step 3.5:** Run full test suite `npx vitest run` to check no regressions.
- [ ] **Step 3.6:** Commit: `feat: add ErrorState component with retry button`

---

## Task 4: SearchState Refactor in SearchBar (TDD)

- [ ] **Step 4.1:** Define the `SearchState` type in `src/components/search-bar.tsx`:
  ```ts
  type SearchState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; results: SearchResult[] }
    | { status: "empty"; query: string }
    | { status: "error"; message: string };
  ```
- [ ] **Step 4.2:** Refactor `SearchBar` state: replace `const [results, setResults]`, `const [loading, setLoading]`, `const [error, setError]` with `const [searchState, setSearchState] = useState<SearchState>({ status: "idle" })`.
- [ ] **Step 4.3:** Refactor `handleSearch`:
  - On submit: `setSearchState({ status: "loading" })`
  - On success with non-empty `resultados`: `setSearchState({ status: "success", results: data.resultados })`
  - On success with empty `resultados`: `setSearchState({ status: "empty", query })`
  - On API error response (`data.error`): `setSearchState({ status: "error", message: data.error })`
  - On non-JSON or single-result: `setSearchState({ status: "success", results: [data] })`
  - On network error: `setSearchState({ status: "error", message: t("error") })`
- [ ] **Step 4.4:** Refactor the return JSX:
  - Remove the `{error && ...}` block entirely
  - Remove the `{results.length > 0 && !error && ...}` conditional
  - Add a feedback area ref (`feedbackRef`) for scroll-into-view
  - After the form, switch on `searchState.status`:
    - `"success"` → `<div ref={feedbackRef}><ResultList results={searchState.results} /></div>`
    - `"empty"` → `<div ref={feedbackRef}><EmptyState query={searchState.query} /></div>`
    - `"error"` → `<div ref={feedbackRef}><ErrorState message={searchState.message} onRetry={handleRetry} /></div>`
  - Update `aria-busy` to `searchState.status === "loading"`
  - Update button `disabled` to `searchState.status === "loading"`
  - Update button text: `searchState.status === "loading" ? t("buttonLoading") : t("button")`
- [ ] **Step 4.5:** Add `handleRetry` function:
  ```ts
  function handleRetry() {
    if (query.trim())
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
  }
  ```
  This re-uses the existing `query` state and `handleSearch`.
- [ ] **Step 4.6:** Update the `useEffect` for auto-scroll: scroll into view when `searchState.status` is `"success"`, `"empty"`, or `"error"`:
  ```ts
  useEffect(() => {
    if (
      ["success", "empty", "error"].includes(searchState.status) &&
      feedbackRef.current
    ) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchState]);
  ```
- [ ] **Step 4.7:** Add imports for `EmptyState` and `ErrorState`.
- [ ] **Step 4.8:** Run full test suite. Existing `search-bar.test.tsx` tests will break — proceed to Task 5.
- [ ] **Step 4.9:** Commit: `refactor: replace SearchBar state triple with SearchState discriminated union`

---

## Task 5: Update SearchBar Tests

- [ ] **Step 5.1:** Update `src/components/search-bar.test.tsx`:
  - Add `emptyState` and `errorState` translations to the test `messages` object
  - Update any tests that relied on the old `(results, error, loading)` state to work with the new render output (form is always present, no separate error `<p>`)
  - Add new tests:
    - Empty state renders when API returns `{ resultados: [] }` (mock fetch, submit form, assert EmptyState visible)
    - Error state renders on network error (mock fetch to throw, assert ErrorState visible)
    - Error state renders on API error response (mock fetch to return `{ error: "..." }`, assert ErrorState visible)
    - Retry button re-submits search (mock fetch to fail then succeed, click retry, assert loading then success)
    - Auto-scroll fires for empty and error states
  - Use `@testing-library/react` `waitFor` and `screen` for async assertions.
- [ ] **Step 5.2:** Run `npx vitest run src/components/search-bar.test.tsx` — confirm all tests pass.
- [ ] **Step 5.3:** Run full test suite `npx vitest run` — confirm no regressions.
- [ ] **Step 5.4:** Commit: `test: update SearchBar tests for discriminated union state model`

---

## Task 6: Push and Create PR

- [ ] **Step 6.1:** Run `npx vitest run` one final time to confirm full green suite.
- [ ] **Step 6.2:** Run lint/typecheck if applicable (check `package.json` scripts).
- [ ] **Step 6.3:** Push branch to remote: `git push -u origin not-found-handling`
- [ ] **Step 6.4:** Create pull request via `gh pr create` with a summary of the change.
