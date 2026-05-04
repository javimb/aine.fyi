## 1. Setup

- [x] 1.1 Create feature branch `feat/auto-aine-classification`
- [x] 1.2 Add `fast-xml-parser` as devDependency (`npm install --save-dev fast-xml-parser`)
- [x] 1.3 Add `generate-aines` script to `package.json` (`"generate-aines": "tsx scripts/generate-aine-classification.ts"`)
- [x] 1.4 Install `tsx` as devDependency if not present

## 2. Schema and Types

- [x] 2.1 Create `data/aine-classification.schema.ts` with `Level` type (`"RED" | "AMBER" | "YELLOW" | "GREEN"`), `PrincipleInfo` type (`{ level: Level; family: string }`), `PrincipleClassification` type (`Record<string, PrincipleInfo>`), and Zod schemas for all types
- [x] 2.2 Write tests for the Zod schemas in `data/aine-classification.test.ts` (valid data parses, invalid data rejects, Level enum restricts to 4 values, family can be empty string for GREEN)

## 3. Generation Script

- [x] 3.1 Write `scripts/generate-aine-classification.ts` that downloads prescripcion.zip from AEMPS URL, extracts XML files to temp directory, and cleans up on exit
- [x] 3.2 Implement XML parsing: extract principio code→name map from `DICCIONARIO_PRINCIPIOS_ACTIVOS.xml`
- [x] 3.3 Implement ATC classification: extract ATC code→description map from `DICCIONARIO_ATC.xml`
- [x] 3.4 Implement cross-reference: scan `Prescripcion.xml` to build principio code→Set of ATC codes mapping from all `<composicion_pa>` elements
- [x] 3.5 Implement classification logic: for each principio, determine level (RED if any ATC starts with `M01A`, AMBER if `B01AC06` or starts with `N02BA`, else GREEN) and family (based on ATC subgroup prefix per design mapping)
- [x] 3.6 Implement file generation: write `data/aine-classification.ts` with the classification map, exported types, and Zod validation
- [x] 3.7 Run the script, verify `data/aine-classification.ts` is generated correctly (spot-check known entries: IBUPROFENO→RED/Propiónico, ACETILSALICILICO ACIDO→AMBER/Salicilato, PARACETAMOL→GREEN/"")
- [x] 3.8 Add error handling: fail with non-zero exit on download failure, XML parse errors, or missing expected elements

## 4. Matcher Rewrite

- [x] 4.1 Write failing tests for new 4-level classification matcher in `src/lib/aine-matcher.test.ts` (RED from M01A, AMBER from salicilato, RED takes precedence over AMBER, YELLOW for unknown, GREEN for safe, combined RED+AMBER shows both in matchedAines with levels, exact key lookup not substring)
- [x] 4.2 Rewrite `src/lib/aine-matcher.ts`: replace array-iteration+cimaName matching with flat lookup by normalized pactivos token, compute overall status as max level across tokens, return `matchedAines` with `{ name, family, level }` for RED/AMBER matches only
- [x] 4.3 Update `AineAnalysis` type to include `level` field in matched entries (`"RED" | "AMBER"`)
- [x] 4.4 Make all new tests pass

## 5. Remove Old Files

- [x] 5.1 Delete `data/aines.ts`
- [x] 5.2 Delete `data/aines.schema.ts`
- [x] 5.3 Delete `data/aines.test.ts`
- [x] 5.4 Update all imports across the codebase that reference the old files to use `data/aine-classification` instead

## 6. API and Consumer Updates

- [x] 6.1 Update `src/app/api/cima/route.ts` to import from `data/aine-classification` instead of `data/aines`, pass `principioClassification` to the matcher
- [x] 6.2 Find and update any UI components that consume `AineAnalysis` to handle the new `AMBER` status and `level` field in `matchedAines`
- [x] 6.3 Update `AineAnalysis` type usages across the codebase (the matched entries now include `level`)

## 7. GitHub Action

- [x] 7.1 Create `.github/workflows/update-aines.yml`: monthly cron, checkout, setup Node, run `npm run generate-aines`, create branch, open PR if changes detected
- [x] 7.2 Verify the action workflow syntax is valid

## 8. Final Verification

- [x] 8.1 Run full test suite (`npm test`) and ensure all tests pass
- [x] 8.2 Run linter (`npm run lint`) and fix any issues
- [x] 8.3 Verify coverage has not decreased
- [x] 8.4 Commit and push all changes
