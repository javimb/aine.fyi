## ADDED Requirements

### Requirement: Playwright smoke E2E tests

The project SHALL include Playwright smoke E2E tests in an `e2e/smoke.spec.ts` file that verify the critical user path: searching for a medication and seeing the AINE analysis result.

#### Scenario: User searches for a medication with AINE

- **WHEN** a user navigates to the application and searches for a medication containing an AINE (e.g., ibuprofeno)
- **THEN** the result SHALL display a RED status indicating AINE presence

#### Scenario: User searches for a medication without AINE

- **WHEN** a user navigates to the application and searches for a medication without AINE (e.g., paracetamol)
- **THEN** the result SHALL display a GREEN status indicating no AINE detected

### Requirement: Playwright exhaustive E2E tests

The project SHALL include Playwright exhaustive E2E tests in an `e2e/exhaustive/` directory that cover all user-facing scenarios including: empty search, invalid input, error handling, multiple AINE detection, and edge cases.

#### Scenario: Exhaustive E2E suite covers error states

- **WHEN** the exhaustive E2E suite is run
- **THEN** it SHALL include tests for API error responses and invalid user input

#### Scenario: Exhaustive E2E suite covers multiple AINE detection

- **WHEN** the exhaustive E2E suite is run
- **THEN** it SHALL include tests for medications containing multiple AINEs and verifying all are detected

### Requirement: Playwright project configuration

The Playwright configuration SHALL define two projects: `smoke` (serial, single worker, fast) and `exhaustive` (parallel, multiple workers, comprehensive).

#### Scenario: Smoke project runs serially

- **WHEN** Playwright is run with the `--project=smoke` flag
- **THEN** tests SHALL run serially with a single worker and a short timeout

#### Scenario: Exhaustive project runs in parallel

- **WHEN** Playwright is run with the `--project=exhaustive` flag
- **THEN** tests SHALL run with multiple workers for parallel execution
