## Why

Result cards display `pactivos` (principios activos) as a raw comma-separated UPPERCASE string with no label. This makes it hard to distinguish from the medication name and doesn't match the visual quality of the rest of the card. Non-AINE active ingredients are invisible — only RED/AMBER compounds get pills. The ALL CAPS casing is loud and unnecessary for human readers.

## What Changes

- Remove the raw `<p>{pactivos}</p>` display from result cards
- Add a "Principios activos:" label above the pills section
- Show ALL principios activos as pills in a single unified section — RED/AMBER pills keep their current styling, non-AINE (GREEN/unknown) tokens get a new neutral pill style
- Extend `CompoundPill` to support a `"NEUTRAL"` level that renders as a muted badge without the family separator
- Apply title-case rendering to all active ingredient names and family names at display time
- Export `normalizePactivos` from `aine-matcher.ts` so the card component can match raw tokens to `matchedAines` entries

## Capabilities

### New Capabilities

- `active-ingredient-pills`: Unified pills section that displays all principios activos — RED/AMBER as status-colored compound pills, GREEN/unknown as neutral pills. Includes title-case normalization at render time.

### Modified Capabilities

- `result-cards`: Remove raw `pactivos` text display; replace with labeled pills section using the new active-ingredient-pills capability
- `aine-matching`: Export `normalizePactivos` for use by the card component to correlate raw tokens with matched entries

## Impact

- `src/components/result-card.tsx` — major refactor: removes `<p>` for `pactivos`, adds label, renders pills for all tokens
- `src/components/compound-pill.tsx` — extended with `NEUTRAL` level and title-case
- `src/lib/aine-matcher.ts` — export `normalizePactivos`
- `src/components/result-card.test.tsx` — update tests for new layout
- `src/components/compound-pill.test.tsx` — add NEUTRAL level tests
- `src/lib/aine-matcher.test.ts` — no logic changes, but tests that check `matchedAines[].name` casing may need review
- `openspec/specs/result-cards/spec.md` — update to reflect new card structure
- `openspec/specs/aine-matching/spec.md` — add note about exported normalization
