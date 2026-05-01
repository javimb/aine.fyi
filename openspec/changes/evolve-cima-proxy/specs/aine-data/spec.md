## MODIFIED Requirements

### Requirement: AINE blacklist data structure

The project SHALL define a typed TypeScript data structure representing AINE (NSAID) entries in `data/aines.ts`. Each entry SHALL include: `name` (canonical Spanish name), `cimaNames` (array of normalized strings matching CIMA's `pactivos` format), `aliases` (alternative names including brand names), and `family` (pharmacological family category).

#### Scenario: AINE entry contains required fields

- **WHEN** an AINE entry is defined in the blacklist
- **THEN** it SHALL contain at minimum a `name`, a `cimaNames` array, an `aliases` array, and a `family` string

#### Scenario: AINE entry has at least one cimaName

- **WHEN** an AINE entry is defined
- **THEN** its `cimaNames` array SHALL contain at least one string representing the exact normalized active ingredient name as returned by the CIMA API

#### Scenario: cimaNames match CIMA pactivos format

- **WHEN** a `cimaNames` value is compared against a CIMA `pactivos` token
- **THEN** it SHALL be an exact match after both sides are uppercased, accents stripped, and whitespace trimmed (e.g., `"ACETILSALICILICO ACIDO"`)
