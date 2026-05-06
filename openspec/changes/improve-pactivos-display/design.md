## Context

Result cards currently display `pactivos` (principios activos / active ingredients) as a raw comma-separated UPPERCASE string with no label. Only RED/AMBER matched AINEs get visual treatment as compound pills. GREEN and unknown active ingredients are invisible in the card. The all-caps format is harder to read and doesn't match the casing conventions of the rest of the UI (medication names, banners, etc. are mixed case).

The component flow is:

1. CIMA API returns `pactivos` as a comma-separated string (often ALL CAPS, sometimes mixed)
2. `aine-matcher.ts` normalizes tokens (UPPERCASE + strip accents) for classification lookup
3. `result-card.tsx` displays `pactivos` as raw text and `matchedAines` as pills
4. Matching between the raw string tokens and matched entries must be done at render time

## Goals / Non-Goals

**Goals:**

- Replace the raw `pactivos` text with a labeled pills section showing all active ingredients
- Apply title-case to all displayed names (both principio names and family names)
- Merge RED/AMBER and neutral pills into a single visual section
- Export `normalizePactivos` from `aine-matcher.ts` for token-to-matched-entry correlation

**Non-Goals:**

- Accent restoration for displayed names (title-case is sufficient; full accent recovery would require a dictionary from the XML source data, which is a separate concern)
- Changes to the `aine-matcher.ts` matching logic or classification data
- Changes to the API route or data pipeline
- Changes to search functionality or result ordering

## Decisions

### 1. Extend CompoundPill with NEUTRAL level (vs. separate component)

**Decision:** Add `"NEUTRAL"` as a third level to `CompoundPill` alongside `"RED"` and `"AMBER"`.

**Rationale:** The visual structure is identical (rounded pill, text content) — only styling differs. A `level` prop is the existing pattern. Adding a new value is simpler than a parallel component. When `level` is `"NEUTRAL"`, the pill hides the family dot-separator and uses muted styling.

**Alternative considered:** Separate `NeutralPill` component. Rejected because it would duplicate the layout/shaping logic and compositional pattern for minimal gain.

### 2. Title-case utility at render time

**Decision:** Create a `toTitleCase(str: string): string` utility that capitalizes the first letter of each word, lowercases the rest, and preserves Spanish minor words (de, del, en, con, para, por, e, y) in lowercase when not the first word.

**Rationale:** Render-time normalization is the simplest approach that doesn't require data pipeline changes. It handles the majority of cases well (e.g. `"IBUPROFENO"` → `"Ibuprofeno"`, `"DICLOFENACO SODICO"` → `"Diclofenaco Sodico"`). The accent-stripping happens in the matcher for lookup; here we only transform the display string.

**Alternative considered:** Building a display-name dictionary from the XML source. Rejected for this scope — it would require regenerating the classification data with an additional field and is disproportionate to the gain for this change.

### 3. Token-to-matched-entry correlation

**Decision:** Export `normalizePactivos` from `aine-matcher.ts`. The result card component splits `pactivos` into tokens, normalizes each token, and checks if a `matchedAines` entry has the same normalized `name`. If found, render as RED/AMBER pill using the matched entry's data. If not found, render as NEUTRAL pill with the original (title-cased) token.

**Rationale:** `matchedAines[].name` is already the normalized form (UPPERCASE, accent-stripped). By normalizing tokens the same way, we get exact string comparison for correlation. No new data structures needed.

### 4. Label for the pills section

**Decision:** Add a fixed "Principios activos:" label above the pills section, replacing the anonymous `<p>` tag.

**Rationale:** Makes the section's purpose immediately clear. This is a UX improvement over the current unlabeled display.

## Risks / Trade-offs

- **[Missing accents in display]** Title-casing `"ACIDO ACETILSALICILICO"` produces `"Acido Acetilsalicilico"` without the original accents (should be `"Ácido Acetilsalicílico"`). This is acceptable for now — the data source is inconsistent about accents and a full dictionary solution is deferred. → _Mitigation: future change can add a display-name dictionary from the XML source data._

- **[matchedAines name casing]** `matchedAines[].name` is UPPERCASE. When rendered through CompoundPill, it must also be title-cased. This means the title-case function needs to be applied in CompoundPill as well, not just in the result card. → _Mitigation: apply `toTitleCase` inside CompoundPill rendering, and also to the family name._

- **[Token correlation edge case]** If CIMA returns duplicate tokens in `pactivos` (unlikely but possible), correlation with `matchedAines` by normalized name could match the wrong entry. → _Mitigation: match by normalized name and consume the match, so each matchedAine entry is used at most once._
