## Purpose

Display active ingredient pills for medication search results — rendering all principios activos as status-colored or neutral CompoundPill elements with title-case normalization.

## Requirements

### Requirement: Title-case normalization for display

The system SHALL provide a `toTitleCase` function that converts UPPERCASE or mixed-case strings to title case for display. It SHALL capitalize the first letter of each word, lowercase the rest, and keep Spanish minor words (de, del, en, con, para, por, e, y) in lowercase when not the first word of the string.

#### Scenario: Simple single-word title case

- **WHEN** `toTitleCase` is called with `"IBUPROFENO"`
- **THEN** it SHALL return `"Ibuprofeno"`

#### Scenario: Multi-word title case

- **WHEN** `toTitleCase` is called with `"DICLOFENACO SODICO"`
- **THEN** it SHALL return `"Diclofenaco Sodico"`

#### Scenario: Spanish minor words preserved lowercase

- **WHEN** `toTitleCase` is called with `"HIDROXIDO DE ALUMINIO"`
- **THEN** it SHALL return `"Hidroxido de Aluminio"`

#### Scenario: Minor word as first word is capitalized

- **WHEN** `toTitleCase` is called with `"DE MEXICO"`
- **THEN** it SHALL return `"De Mexico"`

#### Scenario: Already title-cased string is idempotent

- **WHEN** `toTitleCase` is called with `"Ibuprofeno"`
- **THEN** it SHALL return `"Ibuprofeno"`

### Requirement: Active ingredient pills display all principios activos

The result card SHALL display all principios activos from the `pactivos` field as individual pills in a unified section labeled "Principios activos:". Each token (split by comma from `pactivos`) SHALL be correlated against `matchedAines` using normalized matching. Tokens that match a RED or AMBER entry SHALL render as a status-colored CompoundPill. Tokens that do not match any RED/AMBER entry (GREEN or unknown) SHALL render as a neutral CompoundPill.

#### Scenario: RED result shows RED pill for matched active ingredient

- **WHEN** a result has `pactivos: "IBUPROFENO"` and `matchedAines: [{name: "IBUPROFENO", family: "Derivados del acido propionico", level: "RED"}]`
- **THEN** the card SHALL display a "Principios activos:" label
- **AND** SHALL render a RED-styled CompoundPill with title-cased name `"Ibuprofeno"` and title-cased family `"Derivados del Acido Propionico"`

#### Scenario: GREEN result shows only neutral pills

- **WHEN** a result has `pactivos: "PARACETAMOL"` and `matchedAines: []` and status `"GREEN"`
- **THEN** the card SHALL display a "Principios activos:" label
- **AND** SHALL render a single NEUTRAL-styled CompoundPill with title-cased name `"Paracetamol"` and no family text

#### Scenario: Mixed result shows both RED and neutral pills

- **WHEN** a result has `pactivos: "IBUPROFENO, PARACETAMOL"` and `matchedAines: [{name: "IBUPROFENO", family: "Derivados del acido propionico", level: "RED"}]`
- **THEN** the card SHALL display "Ibuprofeno" as a RED pill and "Paracetamol" as a NEUTRAL pill in the same row

#### Scenario: YELLOW result with unknown active ingredient shows neutral pill

- **WHEN** a result has `pactivos: "UNKNOWN_COMPOUND"` and `matchedAines: []` and status `"YELLOW"`
- **THEN** the card SHALL render "Unknown Compound" as a NEUTRAL pill

### Requirement: CompoundPill supports NEUTRAL level

The CompoundPill component SHALL accept a `level` prop with values `"RED"`, `"AMBER"`, or `"NEUTRAL"`. When `level` is `"NEUTRAL"`, the pill SHALL render with muted background and text styling, SHALL NOT display a family name or dot separator, and SHALL use `role="listitem"` with `aria-label` containing only the name.

#### Scenario: Neutral pill renders without family

- **WHEN** a CompoundPill is rendered with `name="Paracetamol"`, `family=""`, and `level="NEUTRAL"`
- **THEN** it SHALL display only `"Paracetamol"` with muted styling
- **AND** SHALL have `role="listitem"` and `aria-label="Paracetamol"`

#### Scenario: RED pill still shows family

- **WHEN** a CompoundPill is rendered with `name="Ibuprofeno"`, `family="Derivados del acido propionico"`, and `level="RED"`
- **THEN** it SHALL display `"Ibuprofeno · Derivados del Acido Propionico"` with RED styling
- **AND** SHALL have `aria-label="Ibuprofeno, Derivados del Acido Propionico"`
