## Why

When a medication search returns zero results from the CIMA API, the SearchBar silently shows nothing — no message, no feedback. Users are left unsure whether the search failed, is still loading, or genuinely found no matches. This breaks the expected feedback loop and creates confusion, especially for a health-critical tool where clarity matters.

## What Changes

**SearchBar empty state handling**

- From: When `data.resultados` is an empty array, no UI feedback is rendered — the results area stays blank
- To: An `isEmpty` state flag is set, and a dedicated `EmptyResults` component renders a neutral/muted "not found" message with screen reader support (`role="status"`, `aria-live="polite"`)
- Reason: Users need explicit feedback that their query found no matches
- Impact: Non-breaking — adds new UI, no existing behavior changes

**EmptyResults component**

- From: No component exists for empty search state
- To: New `EmptyResults` client component renders a neutral-styled message sourced from i18n key `search.emptyResults`, announced to screen readers
- Reason: Follows the project's component decomposition pattern — each UI concern gets its own component
- Impact: Non-breaking — new addition only

## Capabilities

### New Capabilities

- `empty-results-display`: Displays a neutral/muted "not found" message when a search returns zero results, with screen reader announcement

### Modified Capabilities

- `accessible-search-form`: Adds empty state detection and EmptyResults rendering to the search form, complementing the existing error and loading states

## Impact

- **Frontend components**: `search-bar.tsx` (new state + rendering), new `empty-results.tsx`
- **i18n**: `messages/es-ES.json` gains `search.emptyResults` key
- **Tests**: New test file `empty-results.test.tsx`, updated `search-bar.test.tsx`
- **No API changes**: Empty state is detectable from `data.resultados.length === 0`
