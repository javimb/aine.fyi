## Design Summary

Handle the case where the CIMA API search returns zero results (`resultados: []`). Currently the SearchBar silently shows nothing — no message, no feedback. The change adds a dedicated `EmptyResults` component that displays a neutral/muted "not found" message, distinct from the YELLOW uncertain status. The empty state is announced to screen readers via `role="status"` and `aria-live="polite"`.

## Alternatives Considered

### Option A: Client-side detection in SearchBar

- **Approach**: Detect empty `resultados` array in the fetch handler, set a new state flag, and render the message directly in SearchBar without a separate component.
- **Pros**: Minimal change, no new files, no API changes
- **Cons**: SearchBar grows with another state variable and rendering logic; less testable in isolation
- **Why not chosen**: Doesn't follow the project's component decomposition pattern (each UI concern gets its own component)

### Option B: Dedicated EmptyResults component

- **Approach**: Client-side detection of empty resultados in SearchBar, extract a new `EmptyResults` component that handles the neutral styling, i18n message, and ARIA. No API changes.
- **Pros**: Clean component boundary, follows existing pattern (ResultList, ResultCard), easy to test independently, reusable
- **Cons**: One more component file to maintain
- **Why chosen**: Best fit for the project's architecture

### Option C: Server-side empty state in API route

- **Approach**: Have the `/api/cima` route return a specific `emptyResults: true` field when `resultados` is empty. Frontend reads this flag and shows the message.
- **Pros**: API contract is explicit about empty state
- **Cons**: Unnecessary API change for a purely presentational concern; adds coupling between API shape and UI messaging; the empty state is already detectable from `resultados.length === 0`
- **Why not chosen**: Over-engineering for a UI-only concern

## Agreed Approach

Option B — Dedicated EmptyResults component. The SearchBar gains an `isEmpty` boolean state that is set to `true` when `data.resultados` is an array with `length === 0`. The `EmptyResults` component renders a neutral/muted message with screen reader support. No API route changes.

## Key Decisions

1. **"Not found" is distinct from YELLOW**: The empty results state uses neutral/muted styling, not YELLOW tint. YELLOW means "uncertain/incomplete data" (a medication exists but we can't classify it), while "not found" means no medication matched the query — different situations, different visual treatment.
2. **Scope is search-by-name only**: The direct medication lookup by nregistro/cn is out of scope. The existing YELLOW_ANALYSIS handling for 404s in the detail endpoint is adequate.
3. **Screen reader announcement**: The empty state uses `role="status"` and `aria-live="polite"`, consistent with the existing error state pattern but using `status` instead of `alert` (since this is informational, not an error).
4. **No API changes**: The empty state is detectable from `data.resultados.length === 0` — no need to modify the API contract.

## Open Questions

None — all key decisions resolved during brainstorming.
