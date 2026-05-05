## Why

The webapp serves Spanish-language content sourced exclusively from AEMPS (Agencia Española de Medicamentos y Productos Sanitarios), yet the HTML root declares `lang="en"`. This misleads screen readers, search engines, and browser accessibility features into treating the content as English — causing mispronunciation of Spanish text, incorrect spell-check behavior, and wrong SEO locale signals. Additionally, there is no visible attribution to AEMPS despite the app depending entirely on their public CIMA API, and the search form lacks accessible labels.

## What Changes

- Change `<html lang="en">` to `<html lang="es-ES">` in the root layout — Spain-specific locale since data comes from Spain's AEMPS
- Add `og:locale` metadata (`es_ES`) to the root layout metadata export
- Add a visible AEMPS attribution line (e.g., "Datos proporcionados por la AEMPS") to the page
- Add `aria-label` to the search input and form for screen reader accessibility (in Spanish)
- Add/update tests to cover all of the above

## Capabilities

### New Capabilities

- `i18n-lang`: Correct language declaration (`lang="es-ES"`) and locale metadata (`og:locale`) for the HTML document, ensuring browsers, screen readers, and search engines correctly interpret the page as Spanish (Spain)
- `aemps-attribution`: Visible attribution to AEMPS as the data source, displayed in the UI
- `accessible-search-form`: Accessible search form with Spanish-language aria-labels on input and form elements

### Modified Capabilities

## Impact

- `src/app/layout.tsx` — html lang attribute and metadata export
- `src/components/search-form.tsx` — aria-labels on form and input
- `src/app/page.tsx` or a new component — AEMPS attribution line
- `src/app/layout.test.tsx` — new assertions for lang attribute and og:locale
- `e2e/smoke.spec.ts` — assertion for lang attribute, attribution visibility, aria-labels
- Unit tests in `search-form.test.tsx` (if exists) or new test file
