## Why

The AINE blacklist is manually maintained with only 7 entries, missing many NSAIDs available in Spain (celecoxib, ketoprofeno, nimesulida, aceclofenaco, etc.). The AEMPS publishes a complete, updated database (prescripcion.zip) containing all principios activos with ATC codes. A scripted pipeline can derive a complete, always-up-to-date classification from this authoritative source, and introduce a medically necessary distinction between classic AINEs (M01A) and salicilatos (aspirin at cardiac doses), which carry different risk profiles for allergic patients.

## What Changes

- **BREAKING**: Replace the grouped AINE blacklist (`data/aines.ts` — entries with `name`, `cimaNames[]`, `aliases[]`, `family`) with a flat classification map (`data/aine-classification.ts`) keyed by principio activo name, classifying all ~6,700 principios as RED / AMBER / YELLOW / GREEN.
- **BREAKING**: Expand the `AineAnalysis` result type from 3 statuses (RED/YELLOW/GREEN) to 4 (RED/AMBER/YELLOW/GREEN), where AMBER means "contains salicilato — cross-reactivity risk" and YELLOW means "unknown principio — data gap."
- **BREAKING**: Rewrite `aine-matcher.ts` from array-iteration + cimaName-inclusion check to flat lookup with max-level precedence (RED > AMBER > YELLOW > GREEN).
- **BREAKING**: Change family names from colloquial ("Profeno") to ATC-derived ("Propiónico").
- Remove `data/aines.ts`, `data/aines.schema.ts`, and `data/aines.test.ts` (replaced entirely).
- Add `scripts/generate-aine-classification.ts` — a Node script that downloads prescripcion.zip, extracts ATC classifications from DICCIONARIO_ATC.xml + DICCIONARIO_PRINCIPIOS_ACTIVOS.xml + Prescripcion.xml, and generates `data/aine-classification.ts`.
- Add `npm run generate-aines` as an ad-hoc command and a monthly GitHub Action that auto-creates a PR with updated data.
- Update all consumers of the old blacklist (`src/app/api/cima/route.ts`, UI components) to use the new classification map and 4-level status.
- Update tests to cover the new 4-level classification logic.

## Capabilities

### New Capabilities

- `aine-classification-generation`: Scripted pipeline to download AEMPS prescripcion.zip, cross-reference principios activos with ATC codes, classify each principio as RED/AMBER/YELLOW/GREEN by ATC group, and generate `data/aine-classification.ts`. Includes npm script and GitHub Action for periodic updates.

### Modified Capabilities

- `aine-data`: Replacing the grouped blacklist structure with a flat classification map covering all principios activos; adding AMBER and YELLOW as explicit classification levels; removing aliases/display names (title-case normalization of CIMA names instead).
- `aine-matching`: Switching from array-iteration cimaName matching to O(1) lookup by principio activo name; computing status as max-level across all tokens; returning matched entries with their level (RED/AMBER).

## Impact

- **Code**: `data/aines.ts`, `data/aines.schema.ts`, `data/aines.test.ts` deleted. `aine-matcher.ts` rewritten. `data/aine-classification.ts` (generated) and `data/aine-classification.schema.ts` (manual) created. `cimaproxy/route.ts` imports change. UI components that render RED/YELLOW/GREEN need AMBER support.
- **API**: The `aineAnalysis` field in CIMA API responses gains `level` on matched entries and a new `AMBER` status value.
- **Dependencies**: Script needs `node:fs`, `node:child_process`, and `node:https` for zip download/unzip (no new external deps — XML parsing can use native DOMParser in Node 22+ or a lightweight lib).
- **CI**: New GitHub Action for monthly PR generation.
