## MODIFIED Requirements

### Requirement: AINE classification generation script

The project SHALL provide a Node.js TypeScript script at `scripts/generate-aine-classification.ts` that downloads the AEMPS prescripcion.zip, extracts principio activo classifications from the XML data, generates `data/aine-classification.ts` (including a `lastUpdated` export with the current date in `YYYY-MM-DD` format), and updates the `<!-- last-updated: YYYY-MM-DD -->` HTML comment marker and the companion human-readable date string in `README.md`.

#### Scenario: Successful generation from current AEMPS data

- **WHEN** the script is run via `npm run generate-aines`
- **THEN** it SHALL download `https://listadomedicamentos.aemps.gob.es/prescripcion.zip`, extract the zip, parse `DICCIONARIO_PRINCIPIOS_ACTIVOS.xml`, `DICCIONARIO_ATC.xml`, and `Prescripcion.xml`, write a valid `data/aine-classification.ts` file (including `lastUpdated` export), and update the `<!-- last-updated -->` marker and human-readable date in `README.md`

#### Scenario: Download failure

- **WHEN** the AEMPS URL is unreachable or returns a non-200 status
- **THEN** the script SHALL exit with a non-zero code and print an error message to stderr

#### Scenario: Unexpected XML structure

- **WHEN** the XML files do not contain expected elements (e.g., `<principioactivo>`, `<cod_atc>`)
- **THEN** the script SHALL exit with a non-zero code and print a descriptive error

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

## ADDED Requirements

### Requirement: README date marker injection

The generation script SHALL update `README.md` by finding the `<!-- last-updated: YYYY-MM-DD -->` HTML comment marker and replacing it with `<!-- last-updated: <current-date> -->`, and updating the adjacent human-readable date string. If the marker does not exist, the script SHALL insert it on the data freshness line.

#### Scenario: Marker exists in README

- **WHEN** the README contains `<!-- last-updated: 2026-04-01 -->`
- **THEN** the script SHALL replace it with `<!-- last-updated: <current-date> -->` and update the human-readable date

#### Scenario: Marker does not exist in README

- **WHEN** the README does not contain a `<!-- last-updated -->` comment
- **THEN** the script SHALL insert the marker and date on the data freshness line