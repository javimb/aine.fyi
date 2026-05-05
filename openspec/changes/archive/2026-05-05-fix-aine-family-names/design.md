## Context

The `buildFamilyMap` function in `scripts/generate-aine-classification.ts` is responsible for deriving ATC subgroup → family name mappings from the AEMPS `DICCIONARIO_ATC.xml` file. It currently produces an empty map due to two bugs, causing every RED-level principio to get the `"Otros AINE"` fallback family name.

The AEMPS ATC dictionary contains the subgroup codes and descriptions we need, but the parser looks for wrong XML tags and filters by wrong code length:

- **Bug 1**: Parser looks for `<cod_atc>`/`<des_atc>`, but AEMPS uses `<codigoatc>`/`<descatc>`
- **Bug 2**: `buildFamilyMap` filters for `code.length === 4`, but subgroup codes are 5 chars (`M01AB`)
- **Bug 3**: Descriptions include the code prefix (e.g., `"M01AB - Derivados del acido acetico y sustancias relacionadas"`), which needs stripping

The AEMPS data provides these 5-character subgroup entries:

| Code  | Raw AEMPS description                                            |
| ----- | ---------------------------------------------------------------- |
| M01AA | Butilpirazolidinas                                               |
| M01AB | Derivados del acido acetico y sustancias relacionadas            |
| M01AC | Oxicams                                                          |
| M01AE | Derivados del acido propionico                                   |
| M01AG | Fenamatos                                                        |
| M01AH | Coxibs                                                           |
| M01AX | Otros agentes antiinflamatorios y antirreumaticos no esteroideos |

## Goals / Non-Goals

**Goals:**

- Fix `parseAtcDictionary` to correctly read AEMPS XML tag names (`<codigoatc>`, `<descatc>`) while maintaining fallback to alternate tags for forward compatibility
- Fix `buildFamilyMap` to match 5-character subgroup codes and strip the code prefix from descriptions
- Re-run the generation script to produce correct family names in `data/aine-classification.ts`
- Add comprehensive tests for family mapping scenarios

**Non-Goals:**

- Changing the level classification logic (RED/AMBER/YELLOW/GREEN)
- Changing the overall architecture or data flow
- Shortening or translating AEMPS descriptions — we use them as-is after stripping the prefix

## Decisions

### D1: Use AEMPS descriptions verbatim as family names

**Decision**: Strip the `"CODE - "` prefix from AEMPS descriptions and use the remaining text as family names. No renaming, no translation, no abbreviation.

**Rationale**: The user explicitly wants family names derived from AEMPS data, not hard-coded. The descriptions are official Spanish pharmacological terminology. Stripping the prefix (e.g., `"M01AB - Derivados del acido acetico y sustancias relacionadas"` → `"Derivados del acido acetico y sustancias relacionadas"`) is a minimal transformation that removes redundant information.

This means family names will change from the previous short names:

| Code  | Previous   | New (from AEMPS)                                                 |
| ----- | ---------- | ---------------------------------------------------------------- |
| M01AA | Pirazolona | Butilpirazolidinas                                               |
| M01AB | Acético    | Derivados del acido acetico y sustancias relacionadas            |
| M01AC | Oxicam     | Oxicams                                                          |
| M01AE | Propiónico | Derivados del acido propionico                                   |
| M01AG | Fenamato   | Fenamatos                                                        |
| M01AH | Coxib      | Coxibs                                                           |
| M01AX | Otros AINE | Otros agentes antiinflamatorios y antirreumaticos no esteroideos |

**Alternatives considered**: Truncate long descriptions to a short label. Rejected — would be a hard-coded transformation, defeating the purpose of deriving from AEMPS.

### D2: Fallback tag names for forward compatibility

**Decision**: Support both AEMPS tag formats in `parseAtcDictionary`: try `<codigoatc>`/`<descatc>` first, then fall back to `<cod_atc>`/`<des_atc>`/`<descripcion>`/`<nombre>`.

**Rationale**: AEMPS could change their XML format. The original `cod_atc`/`des_atc` tags might have existed in a prior format or in a different dataset. Supporting both makes the parser resilient.

### D3: Strip prefix with regex

**Decision**: Use a regex like `/^[A-Z0-9]+\s*[-–]\s*/` to strip the ATC code prefix from descriptions.

**Rationale**: AEMPS descriptions consistently follow the pattern `"CODE - Description"`. The regex handles both hyphen and en-dash separators, and trims whitespace. If a description lacks the prefix pattern, it's used as-is.

### D4: Keep `"Otros AINE"` as getAtcFamily fallback

**Decision**: The `getAtcFamily` function in `classify-utils.ts` keeps its `"Otros AINE"` fallback for ATC codes that don't match any 5-char subgroup prefix in the family map.

**Rationale**: This is an edge case safety net. If AEMPS adds a new M01A subgroup that the family map doesn't cover yet, it still gets a reasonable family name. It should rarely trigger with correct parsing.

## Risks / Trade-offs

- **[Longer family names in UI]** → The AEMPS descriptions are verbose (e.g., "Derivados del acido acetico y sustancias relacionadas"). If the UI shows family names, it may need layout adjustments. This is acceptable since the user wants AEMPS-sourced data.
- **[AEMPS format changes]** → The parser now handles both known tag formats (old and new). If AEMPS changes format again, the script will fail with clear error messages. PR review catches anomalies.
- **[Description prefix format assumptions]** → The regex-based prefix stripping assumes `"CODE - "` format. If AEMPS changes this pattern, descriptions could include the code prefix. This is low-risk — the format has been stable.
