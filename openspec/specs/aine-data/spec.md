## ADDED Requirements

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

#### Scenario: AINE blacklist is exportable

- **WHEN** the blacklist is imported in another module
- **THEN** all entries SHALL be available as a typed array with full TypeScript type inference

### Requirement: AINE Zod validation schema

The project SHALL define a Zod schema in `data/aines.schema.ts` that validates the structure and types of AINE entries at runtime.

#### Scenario: Validating a correct AINE entry

- **WHEN** an AINE entry conforming to the schema is validated
- **THEN** the Zod schema SHALL parse successfully and return typed data

#### Scenario: Validating an invalid AINE entry

- **WHEN** an AINE entry with missing or malformed fields is validated
- **THEN** the Zod schema SHALL reject it with descriptive error messages

### Requirement: Initial AINE entries

The blacklist SHALL include the following AINE entries at minimum: Ibuprofeno, Ácido Acetilsalicílico (Aspirina), Naproxeno, Diclofenaco, Dexketoprofeno, Indometacina, Piroxicam.

#### Scenario: Minimum AINE entries are present

- **WHEN** the AINE blacklist is loaded
- **THEN** it SHALL contain at least the seven NSAIDs listed above with their canonical names
