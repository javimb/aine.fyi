## Context

The app "¿Es un AINE?" serves Spanish-language content sourced exclusively from AEMPS (Agencia Española de Medicamentos y Productos Sanitarios) via the CIMA API. The UI, error messages, and data are all in Spanish, yet the HTML root currently declares `lang="en"`. There is no visible attribution to AEMPS despite the app depending entirely on their public API, and the search form lacks accessible labels for screen readers.

Current state:
- `<html lang="en">` in `src/app/layout.tsx`
- No `og:locale` metadata
- No AEMPS attribution in the UI
- Search `<input>` has only `placeholder`, no `<label>` or `aria-label`
- No `<form>` accessible name
- No tests for any of these

## Goals / Non-Goals

**Goals:**
- Declare correct Spanish (Spain) locale at the HTML and metadata level
- Provide visible AEMPS attribution on the page
- Make the search form accessible to screen readers using Spanish labels
- Cover all changes with tests (unit + e2e)

**Non-Goals:**
- Adding i18n/internationalization infrastructure (react-intl, next-intl, etc.)
- Translating the app to other languages
- Adding a legal disclaimer (future change)
- Changing font subsets (already covers Spanish characters)
- Changing the CIMA proxy implementation

## Decisions

### D1: Use `es-ES` rather than `es` for lang attribute

`es-ES` is more specific and correct since the data source (AEMPS) is Spain-specific, and the vocabulary uses Spain Spanish conventions. If the app ever broadened to Latin American drug databases, this could be revisited.

### D2: AEMPS attribution as a small footer or subtext line

Rather than a full separate section, the attribution will be a single line ("Datos proporcionados por la AEMPS") placed below the main content, styled as subtle secondary text. This matches the app's minimal aesthetic while fulfilling the attribution need.

### D3: aria-labels over visible label elements

The search form's UX is intentionally minimal (a single input + button). Adding a visible `<label>` would clutter this. Using `aria-label` on both the `<form>` and `<input>` preserves the visual design while making it fully accessible to screen readers. The `<button>` already has visible text ("Buscar"/"Buscando...") so no additional label is needed there.

### D4: og:locale via Next.js metadata export

Next.js supports the `openGraph` object in `Metadata` exports. We'll add `openGraph.locale: "es_ES"` alongside the existing `title` and `description`. No additional library needed.

## Risks / Trade-offs

- **Risk: Hardcoded Spanish strings** → Acceptable for now since i18n is out of scope. If i18n is added later, strings will need extraction.
- **Risk: AEMPS attribution link expectations** → The attribution will be text-only initially (no hyperlink to AEMPS). A link could be added in a future change if desired.
- **Risk: og:locale alone may not affect SEO significantly** → True, but combined with `lang="es-ES"` and Spanish content, it provides consistent signals. Worth doing regardless.