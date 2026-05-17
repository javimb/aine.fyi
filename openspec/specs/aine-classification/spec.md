# AINE Classification

## Purpose

AINE classification pipeline — automated script to download AEMPS data, generate the principio activo classification map, validate it with Zod, and match CIMA pactivos against it to determine 4-level AINE status (RED > AMBER > YELLOW > GREEN).

## Requirements

### Requirement: AINE classification generation script

The project SHALL provide a Node.js TypeScript script at `scripts/generate-aine-classification.ts` that downloads the AEMPS prescripcion.zip, extracts principio activo classifications from the XML data, generates `data/aine-classification.ts` (including a `lastUpdated` export with the current date in `YYYY-MM-DD` format), and updates the `<!-- last-updated: YYYY-MM-DD -->` HTML comment marker and the companion human-readable date string in `README.md`.

The script SHALL parse `DICCIONARIO_ATC.xml` using the XML tag names `<codigoatc>` and `<descatc>`, with fallback to `<cod_atc>`, `<des_atc>`, `<descripcion>`, and `<nombre>` for forward compatibility. The script SHALL extract 5-character ATC subgroup codes (e.g., `M01AB`, `M01AE`) to build the family map, not 4-character codes.

#### Scenario: Successful generation from current AEMPS data

- **WHEN** the script is run via `npm run generate-aines`
- **THEN** it SHALL download `https://listadomedicamentos.aemps.gob.es/prescripcion.zip`, extract the zip, parse `DICCIONARIO_PRINCIPIOS_ACTIVOS.xml`, `DICCIONARIO_ATC.xml`, and `Prescripcion.xml`, write a valid `data/aine-classification.ts` file (including `lastUpdated` export), and update the `<!-- last-updated -->` marker and human-readable date in `README.md`

#### Scenario: Family names derived from AEMPS ATC dictionary

- **WHEN** the script processes `DICCIONARIO_ATC.xml` and finds entries with 5-character codes starting with `M01A`
- **THEN** it SHALL build a family map from these entries, stripping the code prefix from each description, and use it to assign family names to RED and AMBER-level principios

#### Scenario: ATC dictionary XML uses correct tag names

- **WHEN** `DICCIONARIO_ATC.xml` uses `<codigoatc>` and `<descatc>` tags
- **THEN** the script SHALL correctly parse the code and description from these tags

#### Scenario: ATC dictionary XML uses alternate tag names

- **WHEN** `DICCIONARIO_ATC.xml` uses `<cod_atc>` and `<des_atc>` tags instead
- **THEN** the script SHALL correctly parse the code and description from these fallback tags

#### Scenario: Download failure

- **WHEN** the AEMPS URL is unreachable or returns a non-200 status
- **THEN** the script SHALL exit with a non-zero code and print an error message to stderr

#### Scenario: Unexpected XML structure

- **WHEN** the XML files do not contain expected elements (e.g., `<principioactivo>`, `<codigoatc>`)
- **THEN** the script SHALL exit with a non-zero code and print a descriptive error

### Requirement: XML parsing with fast-xml-parser

The script SHALL use `fast-xml-parser` for XML parsing. This dependency SHALL be added as a devDependency.

#### Scenario: Parsing DICCIONARIO_PRINCIPIOS_ACTIVOS.xml

- **WHEN** the script reads the extracted XML file
- **THEN** it SHALL parse it using `fast-xml-parser` and extract `principioactivo` and `codigoprincipioactivo` values

### Requirement: ATC-to-level classification rules

The script SHALL classify each principio activo based on its ATC codes using the following rules, evaluated in precedence order (highest wins):

1. Any ATC code starts with `M01A` → level `RED`
2. Any ATC code is `B01AC06` or starts with `N02BA` → level `AMBER`
3. Otherwise → level `GREEN`

#### Scenario: Principio with M01A ATC code classified as RED

- **WHEN** a principio activo appears in any medication with an ATC code starting with `M01A`
- **THEN** its level SHALL be `RED`

#### Scenario: Principio with salicilato ATC code classified as AMBER

- **WHEN** a principio activo appears in any medication with ATC code `B01AC06` or starting with `N02BA`
- **THEN** its level SHALL be `AMBER`

#### Scenario: Principio with both M01A and N02BA ATC codes

- **WHEN** a principio activo has ATC codes matching both RED and AMBER rules
- **THEN** its level SHALL be `RED` (RED takes precedence over AMBER)

#### Scenario: Principio with no AINE-related ATC codes

- **WHEN** a principio activo has no ATC codes starting with `M01A`, `N02BA`, or equal to `B01AC06`
- **THEN** its level SHALL be `GREEN`

### Requirement: ATC subgroup to family mapping

The script SHALL derive family names from the AEMPS `DICCIONARIO_ATC.xml` file. It SHALL parse the ATC dictionary using the correct XML tag names (`<codigoatc>` and `<descatc>`) with fallback to `<cod_atc>` and `<des_atc>`/`<descripcion>`/`<nombre>` for forward compatibility. The script SHALL extract 5-character ATC subgroup codes that start with `M01A` and the code `N02BA`, and use their descriptions as family names after stripping the ATC code prefix.

The prefix stripping SHALL match the pattern `/^[A-Z0-9]+\s*[-–]\s*/` and remove the matched portion from the beginning of each description. If a description does not match the prefix pattern, it SHALL be used as-is.

RED and AMBER-level principios SHALL have a family name derived from the AEMPS ATC dictionary. GREEN-level principios SHALL have an empty string `""` as family. The `getAtcFamily` function SHALL return `"Otros AINE"` as a fallback when an ATC code does not match any subgroup prefix in the family map.

The expected family names derived from the current AEMPS dataset are:

| ATC prefix | Family name                                                      |
| ---------- | ---------------------------------------------------------------- |
| M01AA      | Butilpirazolidinas                                               |
| M01AB      | Derivados del acido acetico y sustancias relacionadas            |
| M01AC      | Oxicams                                                          |
| M01AE      | Derivados del acido propionico                                   |
| M01AG      | Fenamatos                                                        |
| M01AH      | Coxibs                                                           |
| M01AX      | Otros agentes antiinflamatorios y antirreumaticos no esteroideos |
| N02BA      | (derived from AEMPS, used for salicilato-level AMBER entries)    |

> **Note**: Approximately 24% of principios in the AEMPS data have no ATC code in Prescripcion.xml and are classified as YELLOW (unknown). This is expected — these represent principios without pharmacological ATC classification in the AEMPS dataset. The YELLOW percentage should be monitored across updates; if it grows significantly, investigate whether the XML parsing or ATC mapping has regressed.

#### Scenario: Principio with M01AE01 ATC code gets Propiónico family from AEMPS

- **WHEN** a principio activo is classified as RED with ATC code `M01AE01` (Ibuprofeno)
- **THEN** its family SHALL be `"Derivados del acido propionico"` (derived from the AEMPS description for subgroup M01AE)

#### Scenario: Principio with M01AB01 ATC code gets Acético family from AEMPS

- **WHEN** a principio activo is classified as RED with ATC code `M01AB01` (Diclofenaco)
- **THEN** its family SHALL be `"Derivados del acido acetico y sustancias relacionadas"` (derived from the AEMPS description for subgroup M01AB)

#### Scenario: Principio with M01AC ATC code gets Oxicams family from AEMPS

- **WHEN** a principio activo is classified as RED with ATC code `M01AC01` (Piroxicam)
- **THEN** its family SHALL be `"Oxicams"` (derived from the AEMPS description for subgroup M01AC)

#### Scenario: GREEN principio has empty family

- **WHEN** a principio activo is classified as GREEN
- **THEN** its family SHALL be `""`

#### Scenario: AMBER principio with N02BA code gets family from AEMPS

- **WHEN** a principio activo is classified as AMBER with ATC code starting with `N02BA`
- **THEN** its family SHALL be derived from the AEMPS description for subgroup N02BA

#### Scenario: Unrecognized M01A subgroup falls back to Otros AINE

- **WHEN** a principio activo is classified as RED with an ATC code starting with `M01A` that does not match any 5-character subgroup prefix in the family map
- **THEN** its family SHALL be `"Otros AINE"`

#### Scenario: AEMPS description with code prefix has prefix stripped

- **WHEN** the AEMPS ATC dictionary contains `<descatc>M01AB - Derivados del acido acetico y sustancias relacionadas</descatc>`
- **THEN** the family name SHALL be `"Derivados del acido acetico y sustancias relacionadas"` with the `"M01AB - "` prefix removed

#### Scenario: AEMPS description without code prefix is used as-is

- **WHEN** the AEMPS ATC dictionary contains a description that does not start with an ATC code prefix pattern
- **THEN** the description SHALL be used as the family name without modification

### Requirement: Cross-referencing principio codes to ATC codes

The script SHALL build the mapping from principio activo code to ATC codes by scanning all `<composicion_pa>` elements in `Prescripcion.xml`, collecting `<cod_principio_activo>` and its parent medication's `<cod_atc>` value. A principio activo's classification SHALL be derived from the union of all ATC codes found across all medications containing that principio.

#### Scenario: Principio appearing in multiple medications with different ATCs

- **WHEN** principio activo code 160 (Ibuprofeno) appears in medications with ATC codes `M01AE01` and potentially others
- **THEN** all unique ATC codes across those medications SHALL be considered for classification, and the highest-precedence level SHALL be used

### Requirement: Generated file format

The generated `data/aine-classification.ts` SHALL export a `principioClassification` constant of type `Record<string, PrincipleInfo>`, where keys are uppercase principio activo names (matching CIMA `pactivos` format) and values are `{ level: Level; family: string }`. The file SHALL also export the `Level` type (`"RED" | "AMBER" | "YELLOW" | "GREEN"`), the `PrincipleInfo` type, and a `lastUpdated` string constant containing the generation date in `YYYY-MM-DD` format. It SHALL include a Zod schema for validation.

#### Scenario: Generated file is valid TypeScript

- **WHEN** the script completes successfully
- **THEN** `data/aine-classification.ts` SHALL be importable TypeScript with full type inference, and SHALL pass Zod validation

#### Scenario: Key format matches CIMA pactivos

- **WHEN** the CIMA API returns `pactivos: "IBUPROFENO"`
- **THEN** the key `"IBUPROFENO"` SHALL exist in the classification map

#### Scenario: lastUpdated is present in generated file

- **WHEN** the script completes successfully
- **THEN** `data/aine-classification.ts` SHALL export `lastUpdated` as a string matching the pattern `YYYY-MM-DD`

### Requirement: Principio name normalization

The script SHALL use principio activo names exactly as they appear in `DICCIONARIO_PRINCIPIOS_ACTIVOS.xml` (already uppercase, no accent stripping). These names match the CIMA `pactivos` format and SHALL be used as the map keys without modification.

#### Scenario: Name matches CIMA format

- **WHEN** DICCIONARIO_PRINCIPIOS_ACTIVOS.xml contains `<principioactivo>IBUPROFENO</principioactivo>`
- **THEN** the key in the classification map SHALL be `"IBUPROFENO"`

### Requirement: npm script for generation

The project SHALL provide an `npm run generate-aines` script that executes the generation script.

#### Scenario: Running npm run generate-aines

- **WHEN** a developer runs `npm run generate-aines`
- **THEN** the generation script SHALL execute and produce an updated `data/aine-classification.ts`

### Requirement: GitHub Action for monthly updates

The project SHALL include a GitHub Action workflow (`.github/workflows/update-aines.yml`) that runs the generation script monthly, creates a new branch, and opens a pull request with any changes to `data/aine-classification.ts`.

#### Scenario: Monthly scheduled run

- **WHEN** the schedule triggers (first day of each month)
- **THEN** the workflow SHALL run `npm run generate-aines`, commit any changes to a new branch, and open a PR

#### Scenario: No changes to classification data

- **WHEN** the generation script produces identical output to the current file
- **THEN** no PR SHALL be created

### Requirement: README date marker injection

The generation script SHALL update `README.md` by finding the `<!-- last-updated: YYYY-MM-DD -->` HTML comment marker and replacing it with `<!-- last-updated: <current-date> -->`, and updating the adjacent human-readable date string. If the marker does not exist, the script SHALL insert it on the data freshness line.

#### Scenario: Marker exists in README

- **WHEN** the README contains `<!-- last-updated: 2026-04-01 -->`
- **THEN** the script SHALL replace it with `<!-- last-updated: <current-date> -->` and update the human-readable date

#### Scenario: Marker does not exist in README

- **WHEN** the README does not contain a `<!-- last-updated -->` comment
- **THEN** the script SHALL insert the marker and date on the data freshness line

### Requirement: AINE classification data structure

The project SHALL define a typed TypeScript data structure in `data/aine-classification.ts` representing a flat classification map. The map SHALL be keyed by principio activo name (uppercase, matching CIMA `pactivos` format) with values of type `PrincipleInfo`: `{ level: Level; family: string }`. The `Level` type SHALL be `"RED" | "AMBER" | "YELLOW" | "GREEN"`. The file SHALL be auto-generated by the `generate-aine-classification` script and SHALL NOT be manually edited. A Zod validation schema SHALL be defined in `data/aine-classification.schema.ts`. The file SHALL also export a `lastUpdated` constant of type `string` containing the date the data was generated in `YYYY-MM-DD` format.

#### Scenario: Classification entry contains required fields

- **WHEN** a principio activo is looked up in the classification map
- **THEN** it SHALL contain a `level` field with value `"RED"`, `"AMBER"`, `"YELLOW"`, or `"GREEN"` and a `family` string

#### Scenario: Every principio activo name matches CIMA pactivos format

- **WHEN** a key in the classification map is compared against a CIMA `pactivos` token
- **THEN** it SHALL be an exact match after both sides are uppercased, accents stripped, and whitespace trimmed (e.g., `"ACETILSALICILICO ACIDO"`)

#### Scenario: Classification map is exportable

- **WHEN** the classification map is imported in another module
- **THEN** all entries SHALL be available as a typed `Record<string, PrincipleInfo>` with full TypeScript type inference

#### Scenario: Classification map passes Zod validation

- **WHEN** the Zod schema is applied to the generated data
- **THEN** it SHALL parse successfully and return typed data

#### Scenario: lastUpdated export contains generation date

- **WHEN** the `lastUpdated` export is imported
- **THEN** it SHALL be a string in `YYYY-MM-DD` format representing the date the script was run

### Requirement: YELLOW status for unknown principios

When a `pactivos` token does not exist as a key in the classification map, the matcher SHALL treat it as YELLOW (unknown risk). If all tokens are either unmapped or GREEN, the overall status SHALL be YELLOW.

#### Scenario: Unknown principio activo in pactivos

- **WHEN** `pactivos` contains a token not present in the classification map and no RED or AMBER match is found
- **THEN** the overall status SHALL be `YELLOW` and the unknown token SHALL NOT appear in `matchedAines`

#### Scenario: Unknown alongside a RED match

- **WHEN** `pactivos` contains both a RED-classified token and an unknown token
- **THEN** the overall status SHALL be `RED` and only the RED token SHALL appear in `matchedAines`

### Requirement: AINE matching against CIMA pactivos

The system SHALL provide a classification function that takes a `pactivos` string (as returned by the CIMA API) and the classification map, and returns an analysis result with a 4-level status and matched entries.

The function SHALL normalize `pactivos` by splitting on commas, stripping accents, uppercasing, and trimming whitespace. For each normalized token, it SHALL perform an O(1) lookup in the classification map. The overall status SHALL be the maximum level across all tokens: RED > AMBER > YELLOW > GREEN.

#### Scenario: pactivos contains a RED-classified AINE

- **WHEN** a `pactivos` string like `"IBUPROFENO, PARACETAMOL"` is analyzed
- **THEN** the function SHALL return status `RED` and the matched entry for `"IBUPROFENO"` with `level: "RED"` and `family: "Propiónico"`

#### Scenario: pactivos contains an AMBER-classified salicilato

- **WHEN** a `pactivos` string like `"ACETILSALICILICO ACIDO"` is analyzed
- **THEN** the function SHALL return status `AMBER` and the matched entry for `"ACETILSALICILICO ACIDO"` with `level: "AMBER"` and `family: "Salicilato"`

#### Scenario: pactivos contains both RED and AMBER entries

- **WHEN** a `pactivos` string contains `"IBUPROFENO"` (RED) and `"ACETILSALICILICO ACIDO"` (AMBER)
- **THEN** the overall status SHALL be `RED` and both entries SHALL appear in `matchedAines` with their respective levels

#### Scenario: pactivos contains no classified AINE or salicilato

- **WHEN** a `pactivos` string like `"PARACETAMOL"` is analyzed and all tokens are GREEN
- **THEN** the function SHALL return status `GREEN` and an empty `matchedAines` array

#### Scenario: pactivos contains an unknown principio

- **WHEN** a `pactivos` token is not found in the classification map and no RED/AMBER match found
- **THEN** the overall status SHALL be `YELLOW` and the unknown token SHALL NOT appear in `matchedAines`

#### Scenario: pactivos is empty or missing

- **WHEN** a medication's `pactivos` field is an empty string or undefined/null
- **THEN** the function SHALL return status `YELLOW` and an empty `matchedAines` array

### Requirement: pactivos normalization for matching

The matching function SHALL normalize `pactivos` before lookup: split by comma, strip accents, uppercase, and trim whitespace on each token. Each normalized token SHALL be used as a key for exact lookup in the classification map. The `normalizePactivos` function SHALL be exported from the module for use by other components that need to correlate raw token strings with matched entries.

#### Scenario: Accent stripping in pactivos

- **WHEN** CIMA returns a `pactivos` string containing accented characters
- **THEN** the normalization step SHALL strip accents (e.g., `"ÁCIDO"` → `"ACIDO"`) before looking up in the classification map

#### Scenario: Exact key lookup

- **WHEN** a normalized token like `"IBUPROFENO"` is looked up in the classification map
- **THEN** it SHALL match the key `"IBUPROFENO"` exactly (no substring matching)

#### Scenario: Export of normalizePactivos

- **WHEN** another module imports from `aine-matcher.ts`
- **THEN** the `normalizePactivos` function SHALL be available as a named export

### Requirement: Multiple AINE detection in a single medication

The classification function SHALL detect all RED and AMBER entries present in a `pactivos` string, not just the first or highest-precedence match.

#### Scenario: Medication containing multiple AINEs

- **WHEN** a `pactivos` string contains `"IBUPROFENO"` (RED) and `"ACETILSALICILICO ACIDO"` (AMBER)
- **THEN** both corresponding entries SHALL be included in `matchedAines` with their respective levels, and status SHALL be `RED`

### Requirement: Matched entry includes level

Each entry in the `matchedAines` array SHALL include a `level` field (`"RED"` or `"AMBER"`) in addition to `name` and `family`.

#### Scenario: Matched entry structure

- **WHEN** an AINE is matched in `pactivos`
- **THEN** the `matchedAines` array SHALL contain an object with `name` (string), `family` (string), and `level` (`"RED"` or `"AMBER"`)
