## Purpose

AINE classification generation — automated script to download AEMPS data and generate the principio activo classification map.

## Requirements

### Requirement: AINE classification generation script

The project SHALL provide a Node.js TypeScript script at `scripts/generate-aine-classification.ts` that downloads the AEMPS prescripcion.zip, extracts principio activo classifications from the XML data, and generates `data/aine-classification.ts`.

#### Scenario: Successful generation from current AEMPS data

- **WHEN** the script is run via `npm run generate-aines`
- **THEN** it SHALL download `https://listadomedicamentos.aemps.gob.es/prescripcion.zip`, extract the zip, parse `DICCIONARIO_PRINCIPIOS_ACTIVOS.xml`, `DICCIONARIO_ATC.xml`, and `Prescripcion.xml`, and write a valid `data/aine-classification.ts` file

#### Scenario: Download failure

- **WHEN** the AEMPS URL is unreachable or returns a non-200 status
- **THEN** the script SHALL exit with a non-zero code and print an error message to stderr

#### Scenario: Unexpected XML structure

- **WHEN** the XML files do not contain expected elements (e.g., `<principioactivo>`, `<cod_atc>`)
- **THEN** the script SHALL exit with a non-zero code and print a descriptive error

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

The script SHALL assign a `family` string to each principio based on the ATC subgroup with the highest precedence level:

| ATC prefix      | Family     |
| --------------- | ---------- |
| M01AA           | Pirazolona |
| M01AB           | Acético    |
| M01AC           | Oxicam     |
| M01AE           | Propiónico |
| M01AG           | Fenamato   |
| M01AH           | Coxib      |
| M01AX           | Otros AINE |
| N02BA / B01AC06 | Salicilato |

GREEN-level principios SHALL have an empty string `""` as family.

> **Note**: Approximately 24% of principios in the AEMPS data have no ATC code in Prescripcion.xml and are classified as YELLOW (unknown). This is expected — these represent principios without pharmacological ATC classification in the AEMPS dataset. The YELLOW percentage should be monitored across updates; if it grows significantly, investigate whether the XML parsing or ATC mapping has regressed.

#### Scenario: Principio mapped to family

- **WHEN** a principio activo is classified as RED with ATC code `M01AE01` (Ibuprofeno)
- **THEN** its family SHALL be `Propiónico`

#### Scenario: GREEN principio has empty family

- **WHEN** a principio activo is classified as GREEN
- **THEN** its family SHALL be `""`

### Requirement: Cross-referencing principio codes to ATC codes

The script SHALL build the mapping from principio activo code to ATC codes by scanning all `<composicion_pa>` elements in `Prescripcion.xml`, collecting `<cod_principio_activo>` and its parent medication's `<cod_atc>` value. A principio activo's classification SHALL be derived from the union of all ATC codes found across all medications containing that principio.

#### Scenario: Principio appearing in multiple medications with different ATCs

- **WHEN** principio activo code 160 (Ibuprofeno) appears in medications with ATC codes `M01AE01` and potentially others
- **THEN** all unique ATC codes across those medications SHALL be considered for classification, and the highest-precedence level SHALL be used

### Requirement: Generated file format

The generated `data/aine-classification.ts` SHALL export a `principioClassification` constant of type `Record<string, PrincipleInfo>`, where keys are uppercase principio activo names (matching CIMA `pactivos` format) and values are `{ level: Level; family: string }`. The file SHALL also export the `Level` type (`"RED" | "AMBER" | "YELLOW" | "GREEN"`) and `PrincipleInfo` type. It SHALL include a Zod schema for validation.

#### Scenario: Generated file is valid TypeScript

- **WHEN** the script completes successfully
- **THEN** `data/aine-classification.ts` SHALL be importable TypeScript with full type inference, and SHALL pass Zod validation

#### Scenario: Key format matches CIMA pactivos

- **WHEN** the CIMA API returns `pactivos: "IBUPROFENO"`
- **THEN** the key `"IBUPROFENO"` SHALL exist in the classification map

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

### Requirement: XML parsing with fast-xml-parser

The script SHALL use `fast-xml-parser` for XML parsing. This dependency SHALL be added as a devDependency.

#### Scenario: Parsing DICCIONARIO_PRINCIPIOS_ACTIVOS.xml

- **WHEN** the script reads the extracted XML file
- **THEN** it SHALL parse it using `fast-xml-parser` and extract `principioactivo` and `codigoprincipioactivo` values
