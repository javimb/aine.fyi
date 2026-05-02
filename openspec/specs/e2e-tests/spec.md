## Purpose

TBD

## Requirements

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
