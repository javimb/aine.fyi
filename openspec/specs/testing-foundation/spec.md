## Purpose

TBD

## Requirements

### Requirement: Vitest coverage configuration

The project SHALL configure Vitest coverage using the v8 provider with `text` and `lcov` reporters, and enforce a minimum threshold of 80% for lines and 80% for branches.

#### Scenario: Running tests with coverage

- **WHEN** `npx vitest run --coverage` is executed
- **THEN** Vitest SHALL generate coverage reports in both text (terminal) and lcov (file) formats

#### Scenario: Coverage below threshold fails the run

- **WHEN** code coverage for lines or branches falls below 80%
- **THEN** the Vitest run SHALL exit with a non-zero status code

#### Scenario: Coverage at or above threshold passes

- **WHEN** code coverage for lines and branches is at or above 80%
- **THEN** the Vitest run SHALL exit with status code 0

### Requirement: Remove passWithNoTests configuration

The project SHALL NOT use `passWithNoTests: true` in Vitest configuration. A test run with no matching test files SHALL fail.

#### Scenario: Running tests when no test files exist

- **WHEN** `npx vitest run` is executed and no test files are found
- **THEN** the run SHALL fail with a non-zero exit code

#### Scenario: Running tests when test files exist

- **WHEN** `npx vitest run` is executed and test files are present and passing
- **THEN** the run SHALL succeed

### Requirement: Playwright configuration

The project SHALL have Playwright installed and configured with a `playwright.config.ts` at the project root, configured to test against the Next.js development server on localhost.

#### Scenario: Running Playwright smoke tests

- **WHEN** `npx playwright test --project=smoke` is executed
- **THEN** Playwright SHALL run only the smoke test project against the Next.js dev server

#### Scenario: Running Playwright exhaustive tests

- **WHEN** `npx playwright test --project=exhaustive` is executed
- **THEN** Playwright SHALL run the exhaustive test project with parallel workers

### Requirement: Test script entries in package.json

The project SHALL define the following npm scripts in `package.json`:

- `test`: runs `vitest run`
- `test:coverage`: runs `vitest run --coverage`
- `test:e2e`: runs `playwright test`
- `test:e2e:smoke`: runs `playwright test --project=smoke`
- `test:e2e:exhaustive`: runs `playwright test --project=exhaustive`

#### Scenario: Running unit tests via npm script

- **WHEN** `npm test` is executed
- **THEN** Vitest SHALL run all unit tests once and exit

#### Scenario: Running coverage report via npm script

- **WHEN** `npm run test:coverage` is executed
- **THEN** Vitest SHALL run all unit tests with coverage and enforce thresholds

#### Scenario: Running E2E tests via npm script

- **WHEN** `npm run test:e2e` is executed
- **THEN** Playwright SHALL run all E2E test projects
