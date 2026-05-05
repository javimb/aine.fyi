## MODIFIED Requirements

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
