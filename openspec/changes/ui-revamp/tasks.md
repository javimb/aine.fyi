## 1. Color System and Typography Foundation

- [ ] 1.1 Update `src/app/globals.css`: replace all achromatic `:root` tokens with warm slate-teal equivalents (primary, foreground, secondary, muted, border, etc.) per the design doc color table
- [ ] 1.2 Add status color tokens (`--status-red`, `--status-red-bg`, `--status-red-border`, amber, green, yellow variants) to `:root` in `globals.css`
- [ ] 1.3 Map all new status tokens in the `@theme inline` block so Tailwind utilities (`bg-status-red-bg`, `text-status-red`, `border-status-red-border`, etc.) are available
- [ ] 1.4 Write failing test: verify status color CSS custom properties are applied to result card elements
- [ ] 1.5 Commit: `feat: add warm slate-teal color system and status tokens`

## 2. Font Migration

- [ ] 2.1 Replace Geist Sans font import in `src/app/layout.tsx` with Inter via `next/font/google` (latin subset, `--font-sans` variable)
- [ ] 2.2 Update `globals.css` `--font-sans` variable to use the Inter CSS variable, remove `--font-geist-mono` reference if unused
- [ ] 2.3 Verify typography scale (headings `font-weight: 700; letter-spacing: -0.02em`, status banners `font-weight: 700; text-sm; uppercase; tracking-wide`) works with Inter in `globals.css` base styles
- [ ] 2.4 Commit: `feat: replace Geist Sans with Inter typeface`

## 3. shadcn/ui Component Setup

- [ ] 3.1 Add shadcn/ui `Input` component: `npx shadcn@latest add input`
- [ ] 3.2 Verify `src/components/ui/input.tsx` exists and is importable
- [ ] 3.3 Commit: `feat: add shadcn Input component`

## 4. Search Bar — Hero/Compact Modes

- [ ] 4.1 Write failing test: SearchForm renders in hero mode by default (large, centered, with title and subtitle)
- [ ] 4.2 Write failing test: SearchForm renders in compact mode after search (smaller, above results, with query pre-filled)
- [ ] 4.3 Write failing test: SearchForm returns to hero mode when query is cleared and results are empty
- [ ] 4.4 Refactor `src/components/search-form.tsx` to use shadcn `Input` and `Button`, add hero/compact state logic
- [ ] 4.5 Update `src/app/page.tsx` to pass hero/compact state; render title + subtitle in hero mode
- [ ] 4.6 Commit: `feat: add hero/compact search bar with shadcn/ui components`

## 5. Result Card Components

- [ ] 5.1 Create `src/components/result-card.tsx` component: accepts `SearchResult` prop, renders status-driven card with left border, tinted bg, status banner
- [ ] 5.2 Write failing test: RED result card renders with red border, red bg, "🔴 AINE DETECTADO" banner, compound pills, and warning message
- [ ] 5.3 Write failing test: AMBER result card renders with amber border, amber bg, "🟠 SALICILATO DETECTADO" banner, compound pills, and warning message
- [ ] 5.4 Write failing test: GREEN result card renders with green border, green bg, "🟢 LIBRE DE AINE" banner, safe message, no pills
- [ ] 5.5 Write failing test: YELLOW result card renders with yellow border, yellow bg, "🟡 NO PUDIMOS VERIFICAR" banner, and warning message
- [ ] 5.6 Implement `result-card.tsx` with status-driven rendering per the design spec
- [ ] 5.7 Commit: `feat: add status-driven result card component`

## 6. Compound Pills

- [ ] 6.1 Create `src/components/compound-pill.tsx` component: renders a pill badge with compound name and family, `role="listitem"`, `aria-label`
- [ ] 6.2 Write failing test: compound pill renders name and family, has `role="listitem"` and descriptive `aria-label`
- [ ] 6.3 Write failing test: multiple compound pills wrap correctly in a `role="list"` container with `flex-wrap` and `gap`
- [ ] 6.4 Implement `compound-pill.tsx`
- [ ] 6.5 Commit: `feat: add accessible compound pill component`

## 7. Result List

- [ ] 7.1 Create `src/components/result-list.tsx` component: renders a list of result cards with a result count heading
- [ ] 7.2 Write failing test: result list renders N cards for N results, displays "N resultados" (plural) or "1 resultado" (singular)
- [ ] 7.3 Implement `result-list.tsx`
- [ ] 7.4 Integrate `ResultList` into `search-form.tsx` replacing the raw `<ul>` render
- [ ] 7.5 Commit: `feat: add result list component with count heading`

## 8. Homepage Content Sections

- [ ] 8.1 Create `src/components/aine-explainer.tsx`: heading "¿Qué son los AINE?", explanatory text about AINEs and allergy risk
- [ ] 8.2 Create `src/components/disclaimer.tsx`: warning callout box with ⚠️, medical disclaimer text, visually distinct styling
- [ ] 8.3 Create `src/components/data-source.tsx`: attribution line "Datos: AEMPS (CIMA) · Actualizado: YYYY-MM-DD" pulling `lastUpdated` from `data/aine-classification.ts`
- [ ] 8.4 Write failing test: data source component renders with `lastUpdated` date
- [ ] 8.5 Update `src/app/page.tsx` to compose all sections: hero search (or compact search + results), explainer, disclaimer, data source
- [ ] 8.6 Ensure explainer, disclaimer, and data source sections are visible both before and after search
- [ ] 8.7 Commit: `feat: add homepage content — explainer, disclaimer, data source`

## 9. Accessibility and Responsive Polish

- [ ] 9.1 Write failing test: each result card has `role="article"` with `aria-label` including medication name and status
- [ ] 9.2 Write failing test: error messages use `role="alert"` and `aria-live="polite"`
- [ ] 9.3 Write failing test: hero search is full-width on 375px viewport, centered max-w-2xl on 1024px viewport
- [ ] 9.4 Write failing test: compound pill text contrast meets WCAG 2.1 AA (4.5:1 for normal text) on its background
- [ ] 9.5 Implement accessibility attributes across all components (aria roles, labels, live regions)
- [ ] 9.6 Implement responsive layout: mobile-first with `max-w-2xl` centering at `sm:` breakpoint
- [ ] 9.7 Commit: `feat: add accessibility and responsive layout polish`

## 10. Update Existing Tests

- [ ] 10.1 Update `src/components/search-form.test.tsx` to match new component structure (hero/compact modes, shadcn components, ResultList)
- [ ] 10.2 Update `src/app/page.test.tsx` to verify new page sections (explainer, disclaimer, data source)
- [ ] 10.3 Verify all existing tests pass with the new component structure
- [ ] 10.4 Commit: `test: update tests for UI revamp`

## 11. Push and Create PR

- [ ] 11.1 Push the `ui-revamp` branch to remote
- [ ] 11.2 Create a pull request via `gh pr create`
