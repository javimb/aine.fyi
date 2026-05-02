## Purpose

AINE matching against CIMA pactivos data — detecting NSAIDs in medication active ingredients via normalized comparison.

## ADDED Requirements

### Requirement: AINE matching against CIMA pactivos

The system SHALL provide a matching function that takes a `pactivos` string (as returned by the CIMA API) and the AINE blacklist, and returns an analysis result with status and matched entries.

#### Scenario: pactivos contains a known AINE

- **WHEN** a `pactivos` string like `"ACETILSALICILICO ACIDO, CLORFENAMINA MALEATO"` is analyzed
- **THEN** the function SHALL return status `RED` and the matched AINE entries (name and family) for each AINE detected

#### Scenario: pactivos contains no known AINE

- **WHEN** a `pactivos` string like `"PARACETAMOL"` is analyzed and no AINE `cimaNames` are found within it
- **THEN** the function SHALL return status `GREEN` and an empty `matchedAines` array

#### Scenario: pactivos is empty or missing

- **WHEN** a medication's `pactivos` field is an empty string or undefined/null
- **THEN** the function SHALL return status `YELLOW` and an empty `matchedAines` array

### Requirement: pactivos normalization for matching

The matching function SHALL normalize `pactivos` before comparison: split by comma, strip accents, uppercase, and trim whitespace on each token. Each normalized token SHALL be compared against the `cimaNames` entries of each AINE in the blacklist using exact equality.

#### Scenario: Word order difference handled by cimaNames

- **WHEN** CIMA returns `"ACETILSALICILICO ACIDO"` and the blacklist has `cimaNames: ["ACETILSALICILICO ACIDO"]`
- **THEN** normalization of both sides SHALL produce matching strings, and the match SHALL be detected

#### Scenario: Accent stripping in pactivos

- **WHEN** CIMA returns a `pactivos` string containing accented characters
- **THEN** the normalization step SHALL strip accents (e.g., `"ÁCIDO"` → `"ACIDO"`) before comparing against `cimaNames`

### Requirement: Multiple AINE detection in a single medication

The matching function SHALL detect all AINEs present in a `pactivos` string, not just the first match.

#### Scenario: Medication containing multiple AINEs

- **WHEN** a `pactivos` string contains `"IBUPROFENO"` and `"ACETILSALICILICO ACIDO"` as separate ingredients
- **THEN** both corresponding AINE entries SHALL be included in `matchedAines` and status SHALL be `RED`
