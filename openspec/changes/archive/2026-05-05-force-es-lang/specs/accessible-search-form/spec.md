## ADDED Requirements

### Requirement: Search form has an accessible name

The `<form>` element containing the search input and button SHALL have an `aria-label` attribute with a Spanish-language description (e.g., "Buscar medicamento") so that screen readers can identify the form's purpose.

#### Scenario: Screen reader identifies the form

- **WHEN** a screen reader user navigates to the search form
- **THEN** the form SHALL be announced with its accessible name "Buscar medicamento"

#### Scenario: Form renders with aria-label

- **WHEN** the search form is rendered
- **THEN** the `<form>` element SHALL have `aria-label="Buscar medicamento"`

### Requirement: Search input has an accessible label

The search `<input>` element SHALL have an `aria-label` attribute with a Spanish-language label (e.g., "Nombre del medicamento") so that screen readers can identify the input's purpose even without a visible `<label>`.

#### Scenario: Screen reader identifies the input

- **WHEN** a screen reader user focuses on the search input
- **THEN** the input SHALL be announced with its accessible name "Nombre del medicamento"

#### Scenario: Input renders with aria-label

- **WHEN** the search form is rendered
- **THEN** the search `<input>` element SHALL have `aria-label="Nombre del medicamento"`
