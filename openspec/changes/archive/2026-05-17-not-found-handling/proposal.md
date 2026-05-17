## Why

When a medication search returns zero results or the CIMA API fails, the user sees nothing — no feedback, no recovery options. SearchBar's loose `(results, error, loading)` state silently hides both the empty-result case and leaves error handling as a one-liner. This creates a confusing experience where users don't know if their search worked, if they misspelled a drug name, or if something is broken. Addressing this now improves the core user experience for the two most common failure modes in the app.

## What Changes

**SearchBar state model**

- From: loose `(results: SearchResult[], error: string, loading: boolean)` triple that allows impossible states like `loading && error`
- To: discriminated union `SearchState` (`idle | loading | success | empty | error`) that makes each state exclusive and explicit
- Reason: eliminates impossible states; enables dedicated render paths for empty and error

**Empty result handling**

- From: `resultados.length === 0` renders nothing — no UI feedback at all
- To: displays an `EmptyState` component with the search term and a tips card suggesting spelling check, generic name, or brand name
- Reason: the user needs to know their search returned nothing and how to refine it

**API error handling**

- From: a single `<p>` with `role="alert"` showing the error message, no recovery path
- To: a dedicated `ErrorState` component with the error message and a "Reintentar" button that re-submits the last query
- Reason: errors need both information and a way to recover without re-typing

**State render logic in SearchBar**

- From: conditional rendering with `results.length > 0 && !error`
- To: switch on `searchState.status` with explicit cases for idle, loading, success, empty, and error
- Impact: non-breaking; form remains always visible, feedback area changes per state

## Capabilities

### New Capabilities

- `search-empty-state`: The EmptyState component and its i18n keys — shows "No encontramos [query]" with a tips card when a search returns zero results
- `search-error-state`: The ErrorState component and its i18n keys — shows an error message with a retry button when an API call fails

### Modified Capabilities

- `accessible-search-form`: SearchBar's state management is changing from a loose triple to a discriminated union, which changes the accessible error/loading state requirements and adds accessible empty-state rendering

## Impact

- **Components modified**: `SearchBar` (`src/components/search-bar.tsx`) — state model refactor and render logic update
- **New components**: `EmptyState` (`src/components/empty-state.tsx`), `ErrorState` (`src/components/error-state.tsx`)
- **i18n**: New keys `emptyState.*` and `errorState.*` in `messages/es-ES.json`; `search.error` key retained for backwards compatibility
- **Tests**: `search-bar.test.tsx` needs updates for the new state model; new tests for `empty-state.test.tsx` and `error-state.test.tsx`
- **No API changes**: The CIMA route (`/api/cima/route.ts`) is not modified
