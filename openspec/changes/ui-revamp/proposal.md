## Why

The current UI is a minimal, achromatic wireframe with no visual identity. Geist Sans feels too friendly for a medical safety tool, the color theme has zero chroma (pure grays everywhere), search results are flat text with no visual hierarchy, and the page lacks informational content about what AINEs are, why they matter, and how the data is sourced. A person with a AINE allergy checking a medication needs immediate clarity and authority — the current design doesn't deliver that.

## What Changes

- Replace Geist Sans with Inter as the primary typeface (superior mobile legibility and accessibility)
- Overhaul the color system: warm slate-teal brand identity with vivid status colors (RED/AMBER/GREEN/YELLOW) and subtle warm tints throughout
- Redesign the homepage with a hero search bar, an "¿Qué son los AINE?" explainer section, a prominent disclaimer, and data source attribution with `lastUpdated` date
- Redesign search results as status-driven cards with colored left-border accents, status banners as card headers, compound pills, and contextual warning messages for RED/AMBER/YELLOW statuses
- Replace raw HTML `<input>` and `<button>` with shadcn/ui components
- Add mobile-first responsive layout throughout
- Ensure WCAG 2.1 AA accessibility for all status colors, contrast ratios, and interactive elements

## Capabilities

### New Capabilities

- `ui-design-system`: Color tokens, typography scale, status color palette, and component styling conventions for the "warm clarity" design direction
- `result-cards`: Status-driven result card components displaying medication search results with RED/AMBER/GREEN/YELLOW visual treatment, compound pills, and contextual warning messages
- `home-page-content`: Homepage sections below search — AINE explainer, disclaimer callout, and data source attribution with lastUpdated date

### Modified Capabilities

- `ui-framework`: Typefaces and color variables are changing — font-family from Geist Sans to Inter, all color tokens from achromatic to warm slate-teal with status chroma
- `accessible-search-form`: Search form UX is changing from inline to hero-sized on landing / compact after search, and from raw HTML to shadcn/ui components — accessibility requirements need updating
- `aemps-attribution`: Attribution is moving from a subtle one-liner to a more prominent section that includes the `lastUpdated` date — requirement scope is expanding

## Impact

- `src/app/globals.css` — color tokens and font variables
- `src/app/layout.tsx` — font import from Geist to Inter
- `src/app/page.tsx` — full restructure with hero search, explainer, disclaimer, attribution
- `src/components/search-form.tsx` — full rewrite with shadcn/ui components, hero/compact states, result cards
- New components under `src/components/` — status cards, compound pills, info sections, disclaimer
- `data/aine-classification.ts` — consumed for `lastUpdated` export
- All existing tests need updating to match new component structure
