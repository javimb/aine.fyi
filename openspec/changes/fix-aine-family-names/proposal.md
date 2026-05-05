## Why

The AINE classification script's `buildFamilyMap` function fails to extract ATC subgroup descriptions from `DICCIONARIO_ATC.xml` due to two bugs: (1) it looks for XML tags `<cod_atc>`/`<des_atc>` but the AEMPS file uses `<codigoatc>`/`<descatc>`, and (2) it filters for `code.length === 4` when subgroup codes are 5 characters (`M01AB`, `M01AE`, etc.). As a result, the family map is always empty, and every RED-level principio gets the fallback family `"Otros AINE"` instead of its correct pharmacological family (Acético, Propiónico, Oxicam, etc.).

## What Changes

- Fix `parseAtcDictionary` in `scripts/generate-aine-classification.ts` to read XML tags `<codigoatc>` and `<descatc>` (with fallback to `cod_atc`/`des_atc` for forward compatibility)
- Fix `buildFamilyMap` to match 5-character subgroup codes instead of 4-character codes
- Strip the ATC code prefix from descriptions (e.g., `"M01AB - Derivados del acido acetico y sustancias relacionadas"` → `"Derivados del acido acetico y sustancias relacionadas"`)
- Update `classify-utils.test.ts` to cover all family mapping scenarios with the new AEMPS-derived family names
- Re-run the generation script and validate that family names are correct (no longer all "Otros AINE")

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `aine-classification-generation`: Family names must now be derived from AEMPS ATC dictionary descriptions rather than falling back to "Otros AINE"

## Impact

- `scripts/generate-aine-classification.ts` — XML parsing and family map building
- `scripts/classify-utils.ts` — `getAtcFamily` fallback still exists but should rarely trigger
- `scripts/classify-utils.test.ts` — test assertions updated for AEMPS-derived family names
- `data/aine-classification.ts` — regenerated with correct families
