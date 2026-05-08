## MODIFIED Requirements

### Requirement: Playwright smoke E2E tests

The project SHALL include Playwright smoke E2E tests in an `e2e/smoke.spec.ts` file that verify the critical user path: the homepage renders with all sections, searching for a medication shows status-driven result cards, and status indicators are correctly displayed. Tests SHALL use semantic selectors (role, text, aria-label) and the new component structure (result cards with `role="article"`, status banners, shadcn Input/Button) instead of the old `data-testid` attributes on raw HTML elements. Test assertions for text content SHALL reference i18n keys from `messages/es-ES.json` rather than hardcoding literal strings, so that content changes do not cause test drift.

#### Scenario: Homepage renders with all content sections

- **WHEN** a user navigates to the application
- **THEN** the page SHALL display the title from i18n key `app.title`
- **AND** the page SHALL display the explainer section heading from i18n key `explainer.heading`
- **AND** the page SHALL display the medical disclaimer callout
- **AND** the page SHALL display the data source attribution including "AEMPS" and the lastUpdated date

#### Scenario: User searches for a medication with AINE shows RED result card

- **WHEN** a user searches for a medication containing an AINE (e.g., ibuprofeno)
- **THEN** a result card SHALL be displayed with `role="article"`
- **AND** the card SHALL display a status banner with the text from i18n key `status.RED.banner`
- **AND** the card SHALL have a red left border and red-tinted background

#### Scenario: User searches for a medication without AINE shows GREEN result card

- **WHEN** a user searches for a medication without AINE (e.g., paracetamol)
- **THEN** a result card SHALL be displayed with `role="article"`
- **AND** the card SHALL display a status banner with the text from i18n key `status.GREEN.banner`
- **AND** the card SHALL have a green left border and green-tinted background

### Requirement: Playwright exhaustive E2E tests

The project SHALL include Playwright exhaustive E2E tests in an `e2e/exhaustive/` directory that cover all user-facing scenarios including: empty search, invalid input, error handling, multiple AINE detection, AMBER/YELLOW status rendering, result count, hero/compact search states, and edge cases. Tests SHALL use the new component selectors. Test assertions for text content SHALL reference i18n keys from `messages/es-ES.json` rather than hardcoding literal strings.

#### Scenario: AMBER status result card renders correctly

- **WHEN** a search returns a medication with AMBER status (salicilato detected, via route mock)
- **THEN** the result card SHALL display a status banner with the text from i18n key `status.AMBER.banner`
- **AND** compound pills SHALL be displayed for matched salicilato compounds
- **AND** the warning message SHALL advise consulting a pharmacist

#### Scenario: YELLOW status result card renders correctly

- **WHEN** a search returns a medication with YELLOW status (uncertain, via route mock)
- **THEN** the result card SHALL display a status banner with the text from i18n key `status.YELLOW.banner`
- **AND** a warning message SHALL advise consulting a pharmacist

#### Scenario: GREEN status result card shows no compound pills

- **WHEN** a search returns a medication with GREEN status (no AINE, via route mock)
- **THEN** the result card SHALL display the message from i18n key `status.GREEN.message`
- **AND** no compound pills SHALL be rendered

#### Scenario: Result count heading shows correct count

- **WHEN** a search returns N results
- **THEN** the result list SHALL display the result count heading from i18n key `results.count` with the appropriate plural form
