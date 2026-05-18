## Architecture

No architectural changes. The change is purely presentational — adding a new client component and a small state addition to SearchBar.

## Component: EmptyResults

New client component at `src/components/empty-results.tsx`:

- Renders a neutral/muted styled message (no status color tint)
- Sources message text from i18n key `search.emptyResults`
- Has `role="status"` and `aria-live="polite"` for screen reader announcement
- Follows the existing component conventions (useTranslations, "use client" directive)

## State management: SearchBar

Add `isEmpty` boolean state to SearchBar (`src/components/search-bar.tsx`):

- Set to `true` when `data.resultados` is an array with `length === 0`
- Set to `false` when a new search starts (alongside `setLoading(true)` and `setError("")`)
- Set to `false` when results are found or an error occurs
- Render `<EmptyResults />` when `isEmpty && !error`

## i18n

Add key `search.emptyResults` to `messages/es-ES.json` with a message like: "No se han encontrado medicamentos con ese nombre. Comprueba que está bien escrito."

## Files touched

- `src/components/empty-results.tsx` (new)
- `src/components/empty-results.test.tsx` (new)
- `src/components/search-bar.tsx` (modify — add isEmpty state, render EmptyResults)
- `src/components/search-bar.test.tsx` (modify — test empty results scenario)
- `messages/es-ES.json` (modify — add search.emptyResults key)
