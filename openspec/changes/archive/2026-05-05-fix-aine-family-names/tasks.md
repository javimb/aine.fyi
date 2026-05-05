## 1. Fix XML tag parsing in parseAtcDictionary

- [x] 1.1 Write a failing test for `parseAtcDictionary` that confirms it parses `<codigoatc>` and `<descatc>` tags from AEMPS XML
- [x] 1.2 Write a failing test for `parseAtcDictionary` that confirms it falls back to `<cod_atc>`, `<des_atc>`, `<descripcion>`, `<nombre>` tags
- [x] 1.3 Fix `parseAtcDictionary` in `scripts/generate-aine-classification.ts` to read `<codigoatc>` first then fallback to `<cod_atc>`, and read `<descatc>` first then fallback to `<des_atc>`/`<descripcion>`/`<nombre>`
- [x] 1.4 Verify all `parseAtcDictionary` tests pass

## 2. Fix buildFamilyMap code length filter and prefix stripping

- [x] 2.1 Write a failing test for `buildFamilyMap` that confirms 5-character M01A codes (e.g., `M01AB`) are included and 4-character codes (e.g., `M01A`) are not
- [x] 2.2 Write a failing test for `buildFamilyMap` that confirms the ATC code prefix is stripped from descriptions (e.g., `"M01AB - Derivados del acido acetico..."` → `"Derivados del acido acetico..."`)
- [x] 2.3 Write a failing test for `buildFamilyMap` that confirms descriptions without a prefix pattern are used as-is
- [x] 2.4 Write a failing test confirming N02BA is included in the family map
- [x] 2.5 Fix `buildFamilyMap` to use `code.length === 5` instead of `code.length === 4`, and strip prefix from descriptions using the regex `/^[A-Z0-9]+\s*[-–]\s*/`
- [x] 2.6 Verify all `buildFamilyMap` tests pass

## 3. Add comprehensive test coverage for getAtcFamily and family mapping

- [x] 3.1 Write a test for `getAtcFamily` confirming each AEMPS-derived family name is returned for its ATC prefix (M01AA, M01AB, M01AC, M01AE, M01AG, M01AH, M01AX)
- [x] 3.2 Write a test for `getAtcFamily` confirming AMBER-level N02BA returns the AEMPS-derived salicilato family name
- [x] 3.3 Write a test for `getAtcFamily` confirming the `"Otros AINE"` fallback for unrecognized M01A subgroups
- [x] 3.4 Write a test for `classifyPrincipio` confirming GREEN-level principios have empty family
- [x] 3.5 Verify all tests pass

- [x] 3.6 Commit: fix: parse AEMPS ATC dictionary correctly for family names

## 4. Re-run generation script and validate output

- [x] 4.1 Run `npm run generate-aines` and verify no errors
- [x] 4.2 Inspect `data/aine-classification.ts` to confirm family names are AEMPS-derived (e.g., IBUPROFENO has family `"Derivados del acido propionico"`, DICLOFENACO has `"Derivados del acido acetico y sustancias relacionadas"`, PIROXICAM has `"Oxicams"`, etc.)
- [x] 4.3 Verify no RED or AMBER entries have empty family or `"Otros AINE"` unless they genuinely fall into the M01AX subtree

- [x] 4.4 Commit: chore: regenerate aine-classification with correct family names

## 5. Push and Create PR

- [x] 5.1 Push branch to remote
- [x] 5.2 Create pull request via gh CLI
