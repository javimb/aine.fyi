## MODIFIED Requirements

### Requirement: Playwright smoke E2E tests

The project SHALL include Playwright smoke E2E tests in an `e2e/smoke.spec.ts` file that verify the critical user path: the homepage renders with all sections, searching for a medication shows status-driven result cards, and status indicators are correctly displayed. Tests SHALL use semantic selectors (role, text, aria-label) and the new component structure (result cards with `role="article"`, status banners, shadcn Input/Button) instead of the old `data-testid` attributes on raw HTML elements.

#### Scenario: Homepage renders with all content sections

- **WHEN** a user navigates to the application
- **THEN** the page SHALL display the title "¿Es un AINE?"
- **AND** the page SHALL display the explainer section heading "¿Qué son los AINE?"
- **AND** the page SHALL display the medical disclaimer callout
- **AND** the page SHALL display the data source attribution including "AEMPS" and the lastUpdated date

#### Scenario: User searches for a medication with AINE shows RED result card

- **WHEN** a user searches for a medication containing an AINE (e.g., ibuprofeno)
- **THEN** a result card SHALL be displayed with `role="article"`
- **AND** the card SHALL display a "🔴 AINE DETECTADO" status banner
- **AND** the card SHALL have a red left border and red-tinted background

#### Scenario: User searches for a medication without AINE shows GREEN result card

- **WHEN** a user searches for a medication without AINE (e.g., paracetamol)
- **THEN** a result card SHALL be displayed with `role="article"`
- **AND** the card SHALL display a "🟢 LIBRE DE AINE" status banner
- **AND** the card SHALL have a green left border and green-tinted background

#### Scenario: Search input has accessible label

- **WHEN** a user loads the application
- **THEN** the search input SHALL have an appropriate accessible label identifying it as a medication search field

### Requirement: Playwright exhaustive E2E tests

The project SHALL include Playwright exhaustive E2E tests in an `e2e/exhaustive/` directory that cover all user-facing scenarios including: empty search, invalid input, error handling, multiple AINE detection, AMBER/YELLOW status rendering, result count, hero/compact search states, and edge cases. Tests SHALL use the new component selectors.

#### Scenario: AMBER status result card renders correctly

- **WHEN** a search returns a medication with AMBER status (salicilato detected, via route mock)
- **THEN** the result card SHALL display a "🟠 SALICILATO DETECTADO" status banner
- **AND** compound pills SHALL be displayed for matched salicilato compounds
- **AND** the warning message SHALL advise consulting a pharmacist

#### Scenario: YELLOW status result card renders correctly

- **WHEN** a search returns a medication with YELLOW status (uncertain, via route mock)
- **THEN** the result card SHALL display a "🟡 NO PUDIMOS VERIFICAR" status banner
- **AND** a warning message SHALL advise consulting a pharmacist

#### Scenario: GREEN status result card shows no compound pills

- **WHEN** a search returns a medication with GREEN status (no AINE, via route mock)
- **THEN** the result card SHALL display "No se han detectado compuestos AINE."
- **AND** no compound pills SHALL be rendered

#### Scenario: Result count heading shows correct count

- **WHEN** a search returns N results
- **THEN** the result list SHALL display "N resultados" (plural) or "1 resultado" (singular)

#### Scenario: Search remains full-size after search with auto-scroll

- **WHEN** a user submits a search and results appear
- **THEN** the search bar SHALL remain at full size (`h-12`)
- **AND** the page SHALL smoothly auto-scroll to the results section
- **AND** the search query SHALL remain in the input field

#### Scenario: Exhaustive E2E suite covers error states

- **WHEN** the exhaustive E2E suite is run
- **THEN** it SHALL include tests for API error responses and invalid user input using updated component selectors

#### Scenario: Exhaustive E2E suite covers multiple AINE detection

- **WHEN** the exhaustive E2E suite is run
- **THEN** it SHALL include tests for medications containing multiple AINEs and verifying all compound pills are displayed

#### Scenario: Error feedback uses accessible role

- **WHEN** an API error occurs during search
- **THEN** the error message SHALL use `role="alert"` for screen reader accessibility
