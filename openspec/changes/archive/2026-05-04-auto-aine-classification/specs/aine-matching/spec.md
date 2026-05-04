## MODIFIED Requirements

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

The matching function SHALL normalize `pactivos` before lookup: split by comma, strip accents, uppercase, and trim whitespace on each token. Each normalized token SHALL be used as a key for exact lookup in the classification map.

#### Scenario: Accent stripping in pactivos

- **WHEN** CIMA returns a `pactivos` string containing accented characters
- **THEN** the normalization step SHALL strip accents (e.g., `"ÁCIDO"` → `"ACIDO"`) before looking up in the classification map

#### Scenario: Exact key lookup

- **WHEN** a normalized token like `"IBUPROFENO"` is looked up in the classification map
- **THEN** it SHALL match the key `"IBUPROFENO"` exactly (no substring matching)

### Requirement: Multiple AINE detection in a single medication

The classification function SHALL detect all RED and AMBER entries present in a `pactivos` string, not just the first or highest-precedence match.

#### Scenario: Medication containing multiple AINEs

- **WHEN** a `pactivos` string contains `"IBUPROFENO"` (RED) and `"ACETILSALICILICO ACIDO"` (AMBER)
- **THEN** both corresponding entries SHALL be included in `matchedAines` with their respective levels, and status SHALL be `RED`

## ADDED Requirements

### Requirement: Matched entry includes level

Each entry in the `matchedAines` array SHALL include a `level` field (`"RED"` or `"AMBER"`) in addition to `name` and `family`.

#### Scenario: Matched entry structure

- **WHEN** an AINE is matched in `pactivos`
- **THEN** the `matchedAines` array SHALL contain an object with `name` (string), `family` (string), and `level` (`"RED"` or `"AMBER"`)
