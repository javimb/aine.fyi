## Context

The "¿Es un AINE?" app currently provides no user feedback when a medication search returns zero results or when the CIMA API call fails. The `SearchBar` component manages state as a loose `(results, error, loading)` triple, and the render logic only shows `ResultList` when `results.length > 0 && !error` — meaning an empty result set renders nothing at all. The API error path shows a one-line error message with no recovery option. Both cases need dedicated UI components and cleaner state management.

The app is a Next.js project using `next-intl` for i18n, Tailwind CSS for styling, and Vitest for testing. The existing status system (RED/AMBER/GREEN/YELLOW) is well-established in `result-card.tsx` and `aine-matcher.ts`.

## Goals / Non-Goals

**Goals:**

- Show a friendly "no results found" message with actionable search tips when CIMA returns zero results
- Show a styled error state with a retry button when the API call fails
- Replace the loose `(results, error, loading)` state in `SearchBar` with a discriminated union that eliminates impossible states
- Maintain existing behavior for successful searches and the YELLOW status case
- Add i18n keys for all new user-facing text
- Write unit tests for both new components and the updated `SearchBar` state logic

**Non-Goals:**

- Modifying the CIMA API route (`/api/cima/route.ts`) — all detection is frontend-side
- Changing how YELLOW-status results are displayed or handled
- Adding fuzzy search or autocomplete suggestions
- Building a global state provider or context for search state

## Decisions

### 1. Discriminated union for search state

**Decision:** Replace `(results: SearchResult[], error: string, loading: boolean)` with:

```ts
type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; results: SearchResult[] }
  | { status: "empty"; query: string }
  | { status: "error"; message: string };
```

**Rationale:** The current triple allows impossible states like `loading === true && error !== ""`. A discriminated union makes state transitions explicit and each render path unambiguous. The `query` field on `empty` enables showing what the user searched for. The `message` field on `error` preserves the specific error text.

**Alternative considered:** Keep the triple and add an `isEmpty` boolean — rejected because it adds another loose flag rather than eliminating impossible states.

### 2. Empty detection on the frontend

**Decision:** Detect `data.resultados` being an empty array in `SearchBar`'s fetch handler, setting state to `{ status: "empty", query }`. No API route changes.

**Rationale:** The API already returns `{ resultados: [] }` for no-match searches. Adding a simple `resultados.length === 0` check in the fetch handler is the minimal change needed. The API route doesn't need to know about empty-state UX.

**Alternative considered:** Have the API return a `{ status: "empty" }` envelope — rejected because it couples the API response format to UI concerns.

### 3. Separate EmptyState and ErrorState components

**Decision:** Two distinct components in `src/components/`:

- `empty-state.tsx` — shows "No encontramos [query]" with a tips card
- `error-state.tsx` — shows error message with a "Reintentar" button

**Rationale:** Empty and error states serve different UX purposes. Empty result is informational (help the user refine their search). Error is operational (help the user recover from a failure). Merging them would require conditional internal branching that obscures intent.

**Alternative considered:** A single `FeedbackState` component with a `variant` prop — rejected because the components share no visual or behavioral template; the variant pattern would just be two components disguised as one.

### 4. ErrorState includes retry

**Decision:** The `ErrorState` component receives an `onRetry` callback and the original query. Clicking "Reintentar" re-submits the search.

**Rationale:** The user already typed their query. Forcing them to re-type after an error is hostile. The `SearchBar` owns the fetch logic and passes `onRetry` down.

### 5. Props interface for new components

**EmptyState props:**

```ts
interface EmptyStateProps {
  query: string;
}
```

**ErrorState props:**

```ts
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}
```

Both components use `useTranslations` for all text, consistent with existing components like `ResultCard` and `StatusBanner`.

### 6. SearchBar render structure

The updated `SearchBar` render will switch on `searchState.status`:

```tsx
switch (searchState.status) {
  case "idle": return <form>...</form>;
  case "loading": return <form>...</form> with disabled button;
  case "success": return <form>...</form> + <ResultList>;
  case "empty": return <form>...</form> + <EmptyState>;
  case "error": return <form>...</form> + <ErrorState>;
}
```

The form is always visible so the user can immediately modify their search. The feedback area below it changes based on state.

### 7. i18n keys

New keys to add under `es-ES.json`:

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

The existing `search.error` key will be replaced by `errorState.title` for the component, but we'll keep `search.error` for the API-level error message string passed into `ErrorState.message`.

## Risks / Trade-offs

- **State migration in SearchBar** → The `results/error/loading` triple is referenced in existing tests. All tests must be updated to use the discriminated union. Mitigation: update tests incrementally alongside the code change.
- **Empty state for single-result endpoints** → The CIMA API also supports `nregistro` and `cn` params (detail view). If those return 404, the current API route returns `{ aineAnalysis: YELLOW_ANALYSIS }` with status 404. This case is NOT in scope — we only handle the `nombre` search returning `resultados: []`. Mitigation: explicitly document this scope boundary.
- **Retry on error** → If the API is down, retrying may loop. Mitigation: the "Reintentar" button is a manual action, not automatic. The user chooses whether to retry.
