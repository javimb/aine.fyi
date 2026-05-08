## MODIFIED Requirements

### Requirement: Active ingredient pills display all principios activos

The result card SHALL display all principios activos from the `pactivos` field as individual pills in a unified section. The pills section container SHALL have `role="list"` and `aria-label` sourced from i18n key `status.activeIngredientsLabel` for screen reader accessibility. Each token (split by comma from `pactivos`) SHALL be correlated against `matchedAines` using normalized matching. Tokens that match a RED or AMBER entry SHALL render as a status-colored CompoundPill. Tokens that do not match any RED/AMBER entry (GREEN or unknown) SHALL render as a neutral CompoundPill. A visible label for the pills section SHALL NOT appear.

#### Scenario: RED result shows RED pill for matched active ingredient

- **WHEN** a result has `pactivos: "IBUPROFENO"` and `matchedAines: [{name: "IBUPROFENO", family: "Derivados del acido propionico", level: "RED"}]`
- **THEN** the pills section SHALL have `aria-label` from i18n key `status.activeIngredientsLabel`
- **AND** SHALL render a RED-styled CompoundPill with title-cased name `"Ibuprofeno"` and title-cased family `"Derivados del Acido Propionico"`

#### Scenario: GREEN result shows only neutral pills

- **WHEN** a result has `pactivos: "PARACETAMOL"` and `matchedAines: []` and status `"GREEN"`
- **THEN** the pills section SHALL have `aria-label` from i18n key `status.activeIngredientsLabel`
- **AND** SHALL render a single NEUTRAL-styled CompoundPill with title-cased name `"Paracetamol"` and no family text

#### Scenario: Mixed result shows both RED and neutral pills

- **WHEN** a result has `pactivos: "IBUPROFENO, PARACETAMOL"` and `matchedAines: [{name: "IBUPROFENO", family: "Derivados del acido propionico", level: "RED"}]`
- **THEN** "Ibuprofeno" as a RED pill and "Paracetamol" as a NEUTRAL pill SHALL render in the same row

#### Scenario: YELLOW result with unknown active ingredient shows neutral pill

- **WHEN** a result has `pactivos: "UNKNOWN_COMPOUND"` and `matchedAines: []` and status `"YELLOW"`
- **THEN** the card SHALL render "Unknown Compound" as a NEUTRAL pill
