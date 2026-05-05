## Purpose

TBD

## Requirements

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

### Requirement: Playwright project configuration

The Playwright configuration SHALL define two projects: `smoke` (serial, single worker, 30-second timeout, fast-fail gate) and `exhaustive` (parallel, multiple workers, comprehensive). In CI, both projects SHALL run sequentially in the same job with smoke first as a fast-fail gate.

#### Scenario: Smoke project runs serially

- **WHEN** Playwright is run with the `--project=smoke` flag
- **THEN** tests SHALL run serially with a single worker and a 30-second timeout

#### Scenario: Exhaustive project runs in parallel

- **WHEN** Playwright is run with the `--project=exhaustive` flag
- **THEN** tests SHALL run with multiple workers for parallel execution

#### Scenario: CI runs smoke before exhaustive

- **WHEN** the `e2e` CI job runs
- **THEN** it SHALL execute `npm run test:e2e:smoke` before `npm run test:e2e:exhaustive`, and SHALL NOT run exhaustive E2E if smoke fails

### Requirement: Smoke E2E tests assert AINE status values

The Playwright smoke E2E tests in `e2e/smoke.spec.ts` SHALL assert the actual AINE status value (RED or GREEN) on results, not just visibility. When a medication with AINE is found, the status SHALL display "RED". When a medication without AINE is found, the status SHALL display "GREEN".

#### Scenario: User searches for a medication with AINE and sees RED status

- **WHEN** a user searches for a medication containing an AINE (e.g., ibuprofeno)
- **THEN** the AINE status indicator SHALL display "RED"

#### Scenario: User searches for a medication without AINE and sees GREEN status

- **WHEN** a user searches for a medication without AINE (e.g., paracetamol)
- **THEN** the AINE status indicator SHALL display "GREEN"

### Requirement: Exhaustive E2E test for multiple AINE detection

The exhaustive E2E suite SHALL include a test that searches for a medication whose active ingredients contain multiple AINE substances and verifies that all are detected in the results.

#### Scenario: Medication with multiple AINEs shows all detected AINEs

- **WHEN** a user searches for a medication whose active ingredients match multiple AINE entries (e.g., a medication containing both ibuprofeno and ácido acetilsalicílico)
- **THEN** the result SHALL display a RED status and SHALL list all detected AINE names

### Requirement: Exhaustive E2E tests for API error handling

The exhaustive E2E suite SHALL include tests that use Playwright route interception to simulate API errors and verify error UI rendering in the browser.

#### Scenario: API server error shows error feedback to user

- **WHEN** the CIMA API returns a server error (500) during a search
- **THEN** the application SHALL display error feedback to the user

#### Scenario: API network failure shows error feedback to user

- **WHEN** the CIMA API request fails due to a network error
- **THEN** the application SHALL display error feedback to the user

### Requirement: Smoke Playwright project with single worker and short timeout

The Playwright `smoke` project configuration SHALL explicitly set `workers: 1` and `timeout: 30000` (30 seconds) to ensure fast, serial execution.

#### Scenario: Smoke project runs with a single worker

- **WHEN** Playwright is run with the `--project=smoke` flag
- **THEN** tests SHALL execute using exactly one worker

#### Scenario: Smoke test fails if it exceeds 30 seconds

- **WHEN** a smoke test takes longer than 30 seconds
- **THEN** the test SHALL fail with a timeout error
