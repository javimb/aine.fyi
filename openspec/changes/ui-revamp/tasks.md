## 1. Color System and Typography Foundation

- [x] 1.1 Update `src/app/globals.css`: replace all achromatic `:root` tokens with warm slate-teal equivalents (primary, foreground, secondary, muted, border, etc.) per the design doc color table
- [x] 1.2 Add status color tokens (`--status-red`, `--status-red-bg`, `--status-red-border`, amber, green, yellow variants) to `:root` in `globals.css`
- [x] 1.3 Map all new status tokens in the `@theme inline` block so Tailwind utilities (`bg-status-red-bg`, `text-status-red`, `border-status-red-border`, etc.) are available
- [x] 1.4 Write failing test: verify status color CSS custom properties are applied to result card elements
- [x] 1.5 Commit: `feat: add warm slate-teal color system and status tokens`

## 2. Font Migration

- [x] 2.1 Replace Geist Sans font import in `src/app/layout.tsx` with Inter via `next/font/google` (latin subset, `--font-sans` variable)
- [x] 2.2 Update `globals.css` `--font-sans` variable to use the Inter CSS variable, remove `--font-geist-mono` reference if unused
- [x] 2.3 Verify typography scale (headings `font-weight: 700; letter-spacing: -0.02em`, status banners `font-weight: 700; text-sm; uppercase; tracking-wide`) works with Inter in `globals.css` base styles
- [x] 2.4 Commit: `feat: replace Geist Sans with Inter typeface`

## 3. shadcn/ui Component Setup

- [x] 3.1 Add shadcn/ui `Input` component: `npx shadcn@latest add input`
- [x] 3.2 Verify `src/components/ui/input.tsx` exists and is importable
- [x] 3.3 Commit: `feat: add shadcn Input component`

## 4. Search Bar — Hero/Compact Modes

- [x] 4.1 Write failing test: SearchForm renders in hero mode by default (large, centered, with title and subtitle)
- [x] 4.2 Write failing test: SearchForm renders in compact mode after search (smaller, above results, with query pre-filled)
- [x] 4.3 Write failing test: SearchForm returns to hero mode when query is cleared and results are empty
- [x] 4.4 Refactor `src/components/search-form.tsx` to use shadcn `Input` and `Button`, add hero/compact state logic
- [x] 4.5 Update `src/app/page.tsx` to pass hero/compact state; render title + subtitle in hero mode
- [x] 4.6 Commit: `feat: add hero/compact search bar with shadcn/ui components`

## 5. Result Card Components

- [x] 5.1 Create `src/components/result-card.tsx` component: accepts `SearchResult` prop, renders status-driven card with left border, tinted bg, status banner
- [x] 5.2 Write failing test: RED result card renders with red border, red bg, "🔴 AINE DETECTADO" banner, compound pills, and warning message
- [x] 5.3 Write failing test: AMBER result card renders with amber border, amber bg, "🟠 SALICILATO DETECTADO" banner, compound pills, and warning message
- [x] 5.4 Write failing test: GREEN result card renders with green border, green bg, "🟢 LIBRE DE AINE" banner, safe message, no pills
- [x] 5.5 Write failing test: YELLOW result card renders with yellow border, yellow bg, "🟡 NO PUDIMOS VERIFICAR" banner, and warning message
- [x] 5.6 Implement `result-card.tsx` with status-driven rendering per the design spec
- [x] 5.7 Commit: `feat: add status-driven result card component`

## 6. Compound Pills

- [x] 6.1 Create `src/components/compound-pill.tsx` component: renders a pill badge with compound name and family, `role="listitem"`, `aria-label`
- [x] 6.2 Write failing test: compound pill renders name and family, has `role="listitem"` and descriptive `aria-label`
- [x] 6.3 Write failing test: multiple compound pills wrap correctly in a `role="list"` container with `flex-wrap` and `gap`
- [x] 6.4 Implement `compound-pill.tsx`
- [x] 6.5 Commit: `feat: add accessible compound pill component`

## 7. Result List

- [x] 7.1 Create `src/components/result-list.tsx` component: renders a list of result cards with a result count heading
- [x] 7.2 Write failing test: result list renders N cards for N results, displays "N resultados" (plural) or "1 resultado" (singular)
- [x] 7.3 Implement `result-list.tsx`
- [x] 7.4 Integrate `ResultList` into `search-form.tsx` replacing the raw `<ul>` render
- [x] 7.5 Commit: `feat: add result list component with count heading`

## 8. Homepage Content Sections

- [x] 8.1 Create `src/components/aine-explainer.tsx`: heading "¿Qué son los AINE?", explanatory text about AINEs and allergy risk
- [x] 8.2 Create `src/components/disclaimer.tsx`: warning callout box with ⚠️, medical disclaimer text, visually distinct styling
- [x] 8.3 Create `src/components/data-source.tsx`: attribution line "Datos: AEMPS (CIMA) · Actualizado: YYYY-MM-DD" pulling `lastUpdated` from `data/aine-classification.ts`
- [x] 8.4 Write failing test: data source component renders with `lastUpdated` date
- [x] 8.5 Update `src/app/page.tsx` to compose all sections: hero search (or compact search + results), explainer, disclaimer, data source
- [x] 8.6 Ensure explainer, disclaimer, and data source sections are visible both before and after search
- [x] 8.7 Commit: `feat: add homepage content — explainer, disclaimer, data source`

## 9. Accessibility and Responsive Polish

- [x] 9.1 Write failing test: each result card has `role="article"` with `aria-label` including medication name and status
- [x] 9.2 Write failing test: error messages use `role="alert"` and `aria-live="polite"`
- [x] 9.3 Write failing test: hero search is full-width on 375px viewport, centered max-w-2xl on 1024px viewport
- [x] 9.4 Write failing test: compound pill text contrast meets WCAG 2.1 AA (4.5:1 for normal text) on its background
- [x] 9.5 Implement accessibility attributes across all components (aria roles, labels, live regions)
- [x] 9.6 Implement responsive layout: mobile-first with `max-w-2xl` centering at `sm:` breakpoint
- [x] 9.7 Commit: `feat: add accessibility and responsive layout polish`

## 10. Update Existing Unit Tests

- [x] 10.1 Update `src/components/search-form.test.tsx` to match new component structure (hero/compact modes, shadcn components, ResultList)
- [x] 10.2 Update `src/app/page.test.tsx` to verify new page sections (explainer, disclaimer, data source)
- [x] 10.3 Verify all existing tests pass with the new component structure
- [x] 10.4 Commit: `test: update unit tests for UI revamp`

## 11. Update E2E Tests

- [x] 11.1 Update `e2e/smoke.spec.ts` — update selectors from old `data-testid` structure to new component selectors (result cards with `role="article"`, status banners, shadcn Input/Button)
- [x] 11.2 Update `e2e/smoke.spec.ts` — change AEMPS attribution test from old "Datos proporcionados por la AEMPS" text to new "Datos: AEMPS (CIMA) · Actualizado:" format
- [x] 11.3 Add e2e smoke test: explainer section "¿Qué son los AINE?" is visible on landing page
- [x] 11.4 Add e2e smoke test: medical disclaimer callout is visible on landing page
- [x] 11.5 Add e2e smoke test: data source attribution with lastUpdated date is visible
- [x] 11.6 Update `e2e/exhaustive/search.spec.ts` — update all selectors from old `data-testid="search-results" li` and `data-testid="aine-status"` to new result card and status banner selectors
- [x] 11.7 Add e2e exhaustive test: AMBER status result renders with salicilato banner, compound pills, and warning message (using route mock)
- [x] 11.8 Add e2e exhaustive test: YELLOW status result renders with "NO PUDIMOS VERIFICAR" banner and warning message (using route mock)
- [x] 11.9 Add e2e exhaustive test: GREEN status result renders with "LIBRE DE AINE" banner and safe message, no compound pills (using route mock)
- [x] 11.10 Add e2e exhaustive test: result count heading shows "N resultados" (plural) or "1 resultado" (singular)
- [x] 11.11 Add e2e exhaustive test: search input switches from hero mode to compact mode after search
- [x] 11.12 Verify all e2e tests pass: `npm run test:e2e:smoke` and `npm run test:e2e:exhaustive`
- [x] 11.13 Commit: `test: update e2e tests for UI revamp`

## 12. Layout Refinements — Hero Centering and Compact Alignment

- [ ] 12.1 Refactor `src/app/page.tsx`: move title and subtitle INSIDE the hero section so they are part of the vertically-centered hero layout (`min-h-dvh flex flex-col items-center justify-center`), and pass them as children/props to SearchForm or render them within the same centered container
- [ ] 12.2 Refactor `src/components/search-form.tsx`: in hero mode, render the full-viewport centered layout (`min-h-dvh flex flex-col items-center justify-center`) with title, subtitle, and search bar grouped together; in compact mode, render only the search bar with `max-w-2xl mx-auto` centering
- [ ] 12.3 Fix compact/post-search layout: ensure the search bar, result list, and all remaining sections (explainer, disclaimer, data source) are horizontally centered within `max-w-2xl mx-auto` both in `search-form.tsx` and `page.tsx`
- [ ] 12.4 Write failing e2e test: hero section fills viewport height and search bar + title are vertically centered on initial load
- [ ] 12.5 Write failing e2e test: after search, compact search bar and result cards are horizontally centered with `max-w-2xl`
- [ ] 12.6 Write failing e2e test: clearing search with no results restores the hero centered layout
- [ ] 12.7 Verify all unit and e2e tests pass
- [ ] 12.8 Commit: `fix: hero centering and compact layout alignment`

## 13. Push and Create PR

- [x] 13.1 Push the `ui-revamp` branch to remote
- [x] 13.2 Create a pull request via `gh pr create`
