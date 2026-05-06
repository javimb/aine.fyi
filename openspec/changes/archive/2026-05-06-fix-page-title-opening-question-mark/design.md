## Context

The page `<title>` in `src/app/layout.tsx` reads `"Es un AINE?"` — missing the Spanish opening question mark (¿). The visible `<h1>` in `src/app/page.tsx` correctly reads `"¿Es un AINE?"`. This inconsistency means browser tabs, search engine results, and Open Graph share previews display grammatically incorrect Spanish.

## Goals / Non-Goals

**Goals:**

- Fix the `<title>` metadata to use correct Spanish punctuation ("¿Es un AINE?")
- Ensure the title is consistent with the visible `<h1>` heading

**Non-Goals:**

- Adding i18n infrastructure or localization beyond this fix
- Changing any other metadata fields

## Decisions

- **Direct string fix**: Change `metadata.title` from `"Es un AINE?"` to `"¿Es un AINE?"` in `layout.tsx`. No templating or i18n library needed for a single static string in a Spanish-only app.

## Risks / Trade-offs

- None. This is a one-character fix with no behavioral side effects.
