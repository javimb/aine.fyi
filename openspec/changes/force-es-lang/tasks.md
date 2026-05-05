## 1. Language and Locale

- [x] 1.1 Write failing test: layout renders `<html lang="es-ES">`
- [x] 1.2 Change `<html lang="en">` to `<html lang="es-ES">` in `src/app/layout.tsx`
- [x] 1.3 Write failing test: metadata includes `openGraph.locale: "es_ES"`
- [x] 1.4 Add `openGraph: { locale: "es_ES" }` to metadata export in `src/app/layout.tsx`
- [ ] 1.5 Commit: `fix: set html lang to es-ES and add og:locale metadata`

## 2. AEMPS Attribution

- [x] 2.1 Write failing test: page displays "Datos proporcionados por la AEMPS"
- [x] 2.2 Add AEMPS attribution text to `src/app/page.tsx` as secondary-styled subtext below main content
- [ ] 2.3 Commit: `feat: add visible AEMPS attribution`

## 3. Accessible Search Form

- [x] 3.1 Write failing test: search form has `aria-label="Buscar medicamento"`
- [x] 3.2 Write failing test: search input has `aria-label="Nombre del medicamento"`
- [x] 3.3 Add `aria-label="Buscar medicamento"` to the `<form>` in `src/components/search-form.tsx`
- [x] 3.4 Add `aria-label="Nombre del medicamento"` to the search `<input>` in `src/components/search-form.tsx`
- [ ] 3.5 Commit: `feat: add Spanish aria-labels to search form`

## 4. E2E Coverage

- [x] 4.1 Add e2e test: page has `<html lang="es-ES">`
- [x] 4.2 Add e2e test: AEMPS attribution is visible
- [x] 4.3 Add e2e test: search input has aria-label
- [ ] 4.4 Commit: `test: add e2e tests for lang, attribution, and accessibility`

## 5. Push and Create PR

- [ ] 5.1 Push branch to remote
- [ ] 5.2 Create pull request via gh CLI
