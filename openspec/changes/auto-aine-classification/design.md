## Context

The app checks medications from the CIMA API against a manually maintained AINE blacklist (`data/aines.ts`) with 7 entries. Each entry groups salt variants under `cimaNames[]`, includes brand `aliases[]`, and a `family` label. The matcher iterates the blacklist array, checking whether any `cimaName` appears in the normalized `pactivos` token list, returning RED/YELLOW/GREEN.

The AEMPS publishes `prescripcion.zip` containing:

- `DICCIONARIO_PRINCIPIOS_ACTIVOS.xml` — ~6,700 principio activo entries (code → name)
- `DICCIONARIO_ATC.xml` — WHO ATC classification hierarchy
- `Prescripcion.xml` — ~30,200 medications bridging principio activo codes to ATC codes

Current system misses ~25+ AINEs available in Spain, has no mechanism for updates, and cannot distinguish salicilatos (aspirin cross-reactivity) from classic AINEs.

## Goals / Non-Goals

**Goals:**

- Complete coverage of all AINE-related principios activos in the Spanish pharmacopeia
- Four-level classification: RED (M01A AINEs), AMBER (salicilatos), YELLOW (unknown), GREEN (safe)
- Automated data generation from AEMPS prescripcion.zip via a Node script
- Periodic updates via both npm script and GitHub Action
- Principios not in the classification map default to YELLOW (unknown), ensuring safety for allergy use

**Non-Goals:**

- Real-time/live CIMA data fetching at runtime (data is baked at build time)
- Smart/brand-name alias resolution (CIMA names are human-readable enough)
- UI redesign for AMBER state (only data layer and API changes in scope)
- Dose-level differentiation for aspirin (always AMBER regardless of dose context)

## Decisions

### D1: Flat classification map vs. grouped blacklist

**Decision**: Replace the grouped array structure with a flat `Record<string, { level: Level; family: string }>` keyed by normalized principio activo name.

**Rationale**: A flat map gives O(1) lookup per pactivos token instead of O(n\*m) array iteration. It also ensures every principio has an explicit classification, removing the "not in list" blind spot. The tradeoff is a larger file (~6,700 entries), but it's generated code — not hand-maintained.

**Alternatives considered**: Keep the grouped structure and auto-generate cimaNames arrays. Rejected because it doesn't guarantee completeness (missing principios would simply be absent with no signal) and the array-scanning matcher is less efficient.

### D2: Four-level status system

**Decision**: RED (M01A* AINE) / AMBER (N02BA*, B01AC06 salicilato) / YELLOW (principio not in map) / GREEN (known safe).

**Rationale**: Medically, a low-dose aspirin prescription (cardiac) is not the same risk profile as ibuprofen. But for an allergy app, cross-reactivity with salicilatos is a real concern that deserves a distinct signal. YELLOW for unknowns ensures we never falsely reassure.

**Precedence**: RED > AMBER > YELLOW > GREEN. A drug containing both ibuprofen (RED) and aspirin (AMBER) presents as RED with both entries in `matchedAines`.

**Alternatives considered**: Keep 3 levels and show aspirin as RED. Rejected because it loses clinically meaningful distinction.

### D3: ATC subgroup → family mapping

**Decision**: Derive family names from ATC subgroups:

| ATC prefix      | Family name |
| --------------- | ----------- |
| M01AA           | Pirazolona  |
| M01AB           | Acético     |
| M01AC           | Oxicam      |
| M01AE           | Propiónico  |
| M01AG           | Fenamato    |
| M01AH           | Coxib       |
| M01AX           | Otros AINE  |
| N02BA / B01AC06 | Salicilato  |

A principio activo may appear in multiple ATC groups (e.g., a combination). The highest-precedence family wins (RED families > AMBER family).

**Alternatives considered**: Keep current names ("Profeno"). Rejected — ATC-derived names are precise, standardized, and self-documenting.

### D4: Default to YELLOW for unknowns

**Decision**: If a pactivos token is not found in the classification map (e.g., a newly approved drug not yet in the AEMPS dump), the overall status defaults to YELLOW if no RED/AMBER was found.

**Rationale**: For an allergy app, false reassurance (GREEN when it shouldn't be) is worse than false caution (YELLOW when the drug is actually safe). YELLOW means "we don't have enough data."

### D5: Generation script approach

**Decision**: Node.js TypeScript script (`scripts/generate-aine-classification.ts`) that:

1. Downloads prescripcion.zip from AEMPS
2. Extracts DICCIONARIO_PRINCIPIOS_ACTIVOS.xml, DICCIONARIO_ATC.xml, and Prescripcion.xml
3. Parses XML to build: principio code → name map, ATC code → prefix map, and principio code → set of ATC codes mapping (from Prescripcion.xml)
4. Classifies each principio by checking if any of its ATC codes start with M01A*, are N02BA*/B01AC06, etc.
5. Generates `data/aine-classification.ts`

For XML parsing: use `fast-xml-parser` (lightweight, no native deps, works in Node).

### D6: GitHub Action scheduling

**Decision**: Monthly cron (`0 0 1 * *`) that runs the generation script, creates a branch, and opens a PR. Also available as `npm run generate-aines` for ad-hoc use.

## Risks / Trade-offs

- **[AEMPS format change]** → Script should validate expected XML structure and fail loudly if tags change. PR review catches anomalies.
- **[~6,700-entry generated file in repo]** → It's data, not logic. Git diffs will show meaningful changes. The file is fully regenerated each time (no partial updates).
- **[Combination drugs with M01A + non-M01A ATC codes]** → A single principio can appear in multiple medications with different ATC codes. The script distinguishes between single-principio and combination medications: for combos, only AINE-related ATC codes (M01A*, N02BA*, B01AC06) are included if the same code also appears when that principio is a sole active ingredient. This prevents false positives (e.g., omeprazol inheriting ibuprofen's M01AE01 code from a combo drug). All ATC codes from single-principio medications are always included.
- **[Principios with no ATC code in Prescripcion.xml]** → These get YELLOW (unknown). These are edge cases — the script should log them for manual review.
- **[fast-xml-parser dependency]** → Lightweight, widely used, ESM-compatible. If it becomes an issue, can be replaced with native DOMParser (available in Node 22+).

## Migration Plan

1. Create the generation script and config, run it to produce the initial `data/aine-classification.ts`
2. Create the new schema and types in `data/aine-classification.schema.ts`
3. Write tests for the new matcher logic (4-level)
4. Rewrite `aine-matcher.ts` to use the flat classification map
5. Delete old files (`aines.ts`, `aines.schema.ts`, `aines.test.ts`)
6. Update `route.ts` and any UI consumers
7. Add GitHub Action
8. Verify all existing tests still pass (with updated assertions)

Rollback: The old files can be restored from git history. The change is atomic — the new matcher won't work without the new data file, so they must swap together.

## Open Questions

- None remaining from exploration. All key decisions are captured above.
