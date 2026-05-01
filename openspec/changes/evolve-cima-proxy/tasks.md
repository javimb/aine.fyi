## 1. Data Model Updates

- [ ] 1.1 Add `cimaNames` field to `data/aines.schema.ts` — extend `aineEntrySchema` with `cimaNames: z.array(z.string()).min(1)`
- [ ] 1.2 Add `cimaNames` values to each AINE entry in `data/aines.ts` with the exact normalized pactivos tokens from CIMA
- [ ] 1.3 Verify the existing 7 AINE entries have correct `cimaNames` by cross-referencing with real CIMA API responses (e.g., look up Ibuprofeno, Aspirina-enabling medications)

## 2. AINE Matching Module

- [ ] 2.1 Create `src/lib/aine-matcher.ts` with a `matchAines(pactivos: string | undefined | null, blacklist: AineBlacklist): AineAnalysis` function
- [ ] 2.2 Implement pactivos normalization: split by comma, strip accents, uppercase, trim each token
- [ ] 2.3 Implement matching logic: compare each normalized token against each blacklist entry's `cimaNames` using exact equality
- [ ] 2.4 Implement status determination: RED if any AINE matched, GREEN if pactivos present and no match, YELLOW if pactivos missing/empty
- [ ] 2.5 Define the `AineAnalysis` return type: `{ status: "RED" | "GREEN" | "YELLOW", matchedAines: Array<{ name: string, family: string }> }`

## 3. CIMA Proxy Route Evolution

- [ ] 3.1 Refactor `/api/cima/route.ts` to accept three query parameters: `nombre`, `nregistro`, `cn` with precedence order `nregistro` > `cn` > `nombre`
- [ ] 3.2 Add CIMA detail endpoint integration: when `nregistro` is provided, call `/medicamento?nregistro=X`; when `cn` is provided, call `/medicamento?cn=X`
- [ ] 3.3 Integrate `matchAines` into all response paths: enrich each medication object with `aineAnalysis`
- [ ] 3.4 Handle error cases with YELLOW status: CIMA errors → 502 with YELLOW `aineAnalysis`, 404 → 404 with YELLOW `aineAnalysis`, missing params → 400

## 4. Testing

- [ ] 4.1 Write unit tests for `aine-matcher.ts`: normalization, exact matching, multiple AINE detection, empty/undefined pactivos, no match → GREEN, missing pactivos → YELLOW
- [ ] 4.2 Write unit tests for the proxy route: param precedence, detail lookups, error handling, enriched response shape
