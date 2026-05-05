## Context

The app is a single-page Next.js 16 application (App Router) with Tailwind CSS v4, shadcn/ui (base-nova style), and TypeScript. It queries the AEMPS CIMA API and classifies medications by AINE risk level (RED/AMBER/GREEN/YELLOW). Currently:

- The page at `src/app/page.tsx` is a minimal centered column with an `<h1>`, a `<SearchForm />`, and a one-line attribution
- The search form at `src/components/search-form.tsx` uses raw HTML `<input>` and `<button>` with inline Tailwind classes
- Results are rendered as bare `<li>` elements with colored `font-bold` text for status
- The color system is entirely achromatic (oklch with chroma=0) except for `--destructive`
- Typography uses Geist Sans (round, friendly), loaded via `next/font/google`
- The `lastUpdated` export exists in `data/aine-classification.ts` but is not surfaced in the UI

The primary user is someone with a AINE allergy checking whether a medication is safe. The UX must convey authority and clarity, not friendliness.

## Goals / Non-Goals

**Goals:**

- Establish a "warm clarity" visual identity: Inter typeface, warm slate-teal brand color, vivid status colors
- Make the search bar the hero element of the landing page, transitioning to compact after search
- Present result status as the primary visual signal — status-driven cards with left-border accents, colored backgrounds, and clear warning messages
- Add informational content explaining what AINEs are and why they matter for allergy sufferers
- Display a prominent disclaimer and data source attribution with the `lastUpdated` date
- Achieve WCAG 2.1 AA compliance for all color contrasts and interactive elements
- Design mobile-first, with responsive scaling to desktop

**Non-Goals:**

- Dark mode (can be addressed in a future change)
- Multi-language support (i18n is a separate capability)
- Changing the CIMA API proxy or AINE matching logic
- Changing the data generation pipeline

## Decisions

### 1. Typeface: Inter (replacing Geist Sans)

**Choice**: Inter via `next/font/google`
**Rationale**: Inter has superior hinting and screen rendering at small sizes, a large x-height for readability, and is one of the most accessible web fonts available. It reads as authoritative without being cold. DM Sans was considered (warmer) but Inter wins on mobile legibility.
**Alternative considered**: DM Sans — warmer personality but weaker small-size rendering and less comprehensive weight coverage.

### 2. Color system: Warm slate-teal identity + vivid status palette

**Choice**: Achromatic grays with a subtle teal tint (hue 255 in oklch) for brand surfaces, with dedicated status tokens that carry real chroma.

| Token                    | Value                   | Purpose                                       |
| ------------------------ | ----------------------- | --------------------------------------------- |
| `--primary`              | `oklch(0.35 0.07 255)`  | Deep slate-teal for headings, primary actions |
| `--primary-foreground`   | `oklch(0.98 0 0)`       | Near-white on primary                         |
| `--status-red`           | `oklch(0.55 0.24 25)`   | AINE detected — vivid warning                 |
| `--status-red-bg`        | `oklch(0.97 0.03 25)`   | Light red card background                     |
| `--status-red-border`    | `oklch(0.55 0.24 25)`   | Red left-border accent                        |
| `--status-amber`         | `oklch(0.65 0.14 75)`   | Salicilato detected — ochre                   |
| `--status-amber-bg`      | `oklch(0.97 0.02 75)`   | Light amber card background                   |
| `--status-amber-border`  | `oklch(0.65 0.14 75)`   | Amber left-border accent                      |
| `--status-green`         | `oklch(0.55 0.15 150)`  | Safe — clear green                            |
| `--status-green-bg`      | `oklch(0.96 0.02 150)`  | Light green card background                   |
| `--status-green-border`  | `oklch(0.55 0.15 150)`  | Green left-border accent                      |
| `--status-yellow`        | `oklch(0.80 0.15 90)`   | Uncertain — warm yellow                       |
| `--status-yellow-bg`     | `oklch(0.97 0.02 90)`   | Light yellow card background                  |
| `--status-yellow-border` | `oklch(0.80 0.15 90)`   | Yellow left-border accent                     |
| `--background`           | `oklch(0.99 0.002 255)` | Very subtle warm-white page bg                |
| `--card`                 | `oklch(1 0 0)`          | Pure white card bg                            |
| `--muted`                | `oklch(0.96 0.005 255)` | Warm gray for secondary elements              |
| `--border`               | `oklch(0.90 0.01 255)`  | Warm gray borders                             |

**Rationale**: The slate-teal hue gives the app identity without being distracting. Status colors are the only place with significant chroma — they must pop because they're the whole reason someone uses this app. All status text-on-bg combinations meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).

### 3. Search UX: Hero-to-compact transition

**Choice**: The search bar starts as a large, centered hero element on the landing page. The hero section (title + subtitle + search bar) occupies the full viewport height with `min-h-dvh` and is centered both horizontally (via `max-w-2xl mx-auto`) and vertically. After a search is submitted, the page transitions from the full-viewport hero to a top-aligned, scrollable layout: the search bar becomes compact, and both it and the result list are horizontally centered within `max-w-2xl mx-auto`. The title and subtitle are hidden in compact mode — only the search bar and results are shown, keeping context while results are visible.
**Alternative considered**: Always-compact search — rejected because the landing page has no other content competing for attention and a hero search communicates simplicity and focus.

### 4. Result cards: Status-driven with left-border accents

**Choice**: Each result is a `<div>` card with:

- A status banner header (🔴 AINE DETECTADO / 🟠 SALICILATO DETECTADO / 🟢 LIBRE DE AINE / 🟡 NO PUDIMOS VERIFICAR)
- A thick left border (4px) in the status color
- A subtle tinted background (`status-*-bg`)
- The medication name and composition (`pactivos`)
- Compound pills for RED/AMBER results showing each matched AINE name and family
- A contextual warning message for RED, AMBER, and YELLOW statuses

**Alternative considered**: Full-width colored backgrounds — rejected because they can feel overwhelming on mobile and reduce readability for longer result lists. Left-border + tinted bg is calmer but still status-clear.

### 5. Component architecture: Decompose SearchForm into focused components

**Choice**: Break the monolithic `SearchForm` into:

- `SearchBar` — the input + button, hero/compact variants
- `ResultList` — container for result cards
- `ResultCard` — individual status-driven card
- `CompoundPill` — pill badge for matched AINE compounds
- `StatusBanner` — the colored status header within cards
- `AineExplainer` — "¿Qué son los AINE?" section
- `Disclaimer` — medical disclaimer callout
- `DataSource` — attribution with `lastUpdated` date

**Rationale**: The current `SearchForm` handles search, results rendering, and status display in one 112-line file. Decomposition makes each piece testable and reusable.

### 6. Warning messages per status

| Status | Message                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------- |
| RED    | "Evita este medicamento si tienes alergia a AINE. Consulta con tu farmacéutico."                     |
| AMBER  | "Los salicilatos pueden provocar reacción cruzada con alergia a AINE. Consulta con tu farmacéutico." |
| YELLOW | "No pudimos verificar los componentes de este medicamento. Consulta con tu farmacéutico."            |
| GREEN  | No warning message — show "No se han detectado compuestos AINE."                                     |

### 7. Homepage content structure

**Choice**: The landing page (idle state, no search yet) shows a hero section that fills the viewport (`min-h-dvh`) with title, subtitle, and search bar vertically and horizontally centered:

1. Hero section: Title "¿Es un AINE?" + subtitle "Comprueba si un medicamento contiene algún AINE" + hero search bar — fully centered in viewport with `min-h-dvh` `flex flex-col items-center justify-center`

After search, the page transitions to a scrollable content layout. All sections are horizontally centered within `max-w-2xl mx-auto`:

1. Compact search bar + result cards
2. Explainer section: "¿Qué son los AINE?" — brief paragraph explaining AINEs are non-steroidal anti-inflammatories (ibuprofen, aspirin, naproxen, etc.), one of the most commonly prescribed and OTC drug groups, and that a single dose can cause a severe reaction in allergic individuals
3. Disclaimer section: Warning callout stating this is an informational tool, not a substitute for professional medical advice, and recommending verifying the physical medication leaflet
4. Data source line: "Datos: AEMPS (CIMA)" with the `lastUpdated` date

## Risks / Trade-offs

- **Status color accessibility**: All status color combinations must meet WCAG 2.1 AA. → Mitigation: Use oklch values verified for 4.5:1 contrast ratio against their respective backgrounds. Status banners use large/bold text (3:1 sufficient for large text). Pill text-on-pill-bg verified separately.
- **Mobile keyboard shifts content**: Hero search bar centered vertically may jump when virtual keyboard opens. → Mitigation: Use `min-h-dvh` with `svh` units or position hero search in the upper third rather than true center.
- **Font loading flash**: Inter via `next/font/google` uses `font-display: swap`, so there will be a brief FOUT. → Mitigation: Acceptable for this app's size; Next.js optimizes font loading.
- **Result card height variability**: RED cards with compound pills are significantly taller than GREEN cards. → Mitigation: This is desired behavior — RED results SHOULD take more visual space.
- **Compound pills overflow on mobile**: Multiple pills may wrap awkwardly on very small screens. → Mitigation: Use `flex-wrap` with `gap` and ensure each pill has consistent min-width for readability.

## Open Questions

- Dark mode is explicitly out of scope for this change but the color token structure should support it in the future (all status tokens will be defined in `:root` with a `.dark` counterpart ready to fill in later).
