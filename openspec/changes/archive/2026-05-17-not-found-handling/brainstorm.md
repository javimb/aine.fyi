## Design Summary

Handle the "no results found" and "API error" cases that currently leave the user with no feedback. Replace the loose `(results, error, loading)` state in `SearchBar` with a discriminated union (`idle | loading | success | empty | error`) and add two new components: `EmptyState` (friendly no-results message with search tips) and `ErrorState` (error message with retry button). No API route changes needed — the frontend will detect empty `resultados` arrays.

## Alternatives Considered

### Option A: State-driven rendering in SearchBar (chosen)

- **Approach**: Add a `SearchState` discriminated union in `SearchBar`. Render `EmptyState` or `ErrorState` components based on state. The API route returns structured responses that the frontend distinguishes.
- **Pros**: Clean separation of concerns, each state has its own render path, easy to test, follows React patterns
- **Cons**: Slightly more state management complexity in SearchBar
- **Why chosen**: Simplest approach that properly separates concerns while staying idiomatic React

### Option B: ResultList handles all empty/error rendering

- **Approach**: Pass both results and status to `ResultList`. It renders cards for results or shows empty/error messages internally.
- **Pros**: Centralizes all result display in one component
- **Cons**: `ResultList` takes on too many responsibilities; error/empty states are conceptually different from a list of results
- **Why not chosen**: Violates single responsibility — ResultList shouldn't know about error/empty UX

### Option C: Global state with a StatusProvider

- **Approach**: Lift search state into a React context/provider. Any component can read the current status.
- **Pros**: Flexible for future features (e.g., search history), decouples components
- **Cons**: Over-engineered for current scope; adds complexity without immediate payoff
- **Why not chosen**: Premature abstraction — no other components need search state right now

## Agreed Approach

**Option A** — state-driven rendering in `SearchBar` with a discriminated union and separate `EmptyState`/`ErrorState` components.

### State Model

```ts
type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; results: SearchResult[] }
  | { status: "empty"; query: string }
  | { status: "error"; message: string };
```

Frontend detection logic (no API changes):

- `200` with `resultados.length > 0` → `success`
- `200` with `resultados.length === 0` → `empty`
- Non-2xx or network error → `error`

### EmptyState Component

- Friendly message including the search term (i18n key in `es-ES.json`)
- Tip card with suggestions: check spelling, try generic name, try brand name
- Styled consistently with existing card pattern (rounded corners, padding)

### ErrorState Component

- Error message (using existing `search.error` i18n key)
- "Retry" button that re-submits the last search
- Styled with `text-status-red` and warning icon — visually distinct from empty state
- Separate component, not shared with EmptyState

### Scope

- No API route changes
- No changes to result display when results exist
- No changes to YELLOW status handling (that's a separate concern)

## Key Decisions

1. **Discriminated union over loose state** — eliminates impossible states (e.g., `loading && error`)
2. **Frontend-only empty detection** — no API changes needed
3. **Separate EmptyState and ErrorState components** — different UX concerns deserve different components
4. **ErrorState includes retry** — user can re-attempt without re-typing their query
5. **i18n for all user-facing text** — consistent with existing patterns

## Open Questions

None — all decisions resolved during brainstorming.
