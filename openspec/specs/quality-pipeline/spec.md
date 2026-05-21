# Quality Pipeline

## Purpose

GitHub Actions CI pipeline, Test-Driven Development mandate, Vitest unit test configuration with coverage enforcement, Playwright E2E test suites (smoke and exhaustive), and npm scripts — ensuring code quality through automated checks, branch protection, and test-first development practices.

## Requirements

### Requirement: GitHub Actions CI workflow

The project SHALL have a GitHub Actions workflow file at `.github/workflows/ci.yml` that runs on pull requests to main and on pushes to main. The workflow SHALL define two parallel jobs: `check` and `e2e`. Both jobs SHALL be required status checks for branch protection on `main`, enforced via GitHub branch protection rules.

#### Scenario: Pull request opened against main

- **WHEN** a pull request is opened or updated against the main branch
- **THEN** the CI workflow SHALL run both the `check` job and the `e2e` job in parallel

#### Scenario: Push to main

- **WHEN** code is pushed to the main branch
- **THEN** the CI workflow SHALL run both the `check` job and the `e2e` job

#### Scenario: Branch protection blocks merge on failing CI

- **WHEN** either the `check` or `e2e` status check is failing or pending on a pull request
- **THEN** GitHub SHALL prevent the pull request from being merged to `main`

### Requirement: Check job (merge gate)

The CI workflow SHALL include a `check` job that runs: Next.js build, ESLint, TypeScript typecheck (`tsc --noEmit`), and Vitest unit tests with coverage (enforcing 80% threshold). This job MUST pass before a pull request can be merged. This job SHALL NOT run E2E tests.

#### Scenario: All check steps pass

- **WHEN** all steps in the check job succeed
- **THEN** the check job SHALL report success and the PR SHALL be eligible for merge

#### Scenario: Coverage below threshold

- **WHEN** the Vitest coverage step reports line or branch coverage below 80%
- **THEN** the check job SHALL fail and block the PR from merging

#### Scenario: Build or typecheck fails

- **WHEN** `next build` or `tsc --noEmit` fails
- **THEN** the check job SHALL fail and block the PR from merging

### Requirement: E2E job (merge gate)

The CI workflow SHALL include an `e2e` job that runs: Next.js build, Playwright browser installation, smoke E2E tests, then exhaustive E2E tests sequentially. This job MUST pass before a pull request can be merged. The `e2e` job SHALL NOT have `continue-on-error` enabled.

#### Scenario: All E2E steps pass

- **WHEN** all steps in the `e2e` job succeed
- **THEN** the `e2e` job SHALL report success and the PR SHALL be eligible for merge

#### Scenario: Smoke E2E test fails

- **WHEN** any Playwright smoke E2E test fails
- **THEN** the `e2e` job SHALL fail and block the PR from merging, and exhaustive E2E tests SHALL NOT run

#### Scenario: Exhaustive E2E test fails

- **WHEN** any Playwright exhaustive E2E test fails
- **THEN** the `e2e` job SHALL fail and block the PR from merging

#### Scenario: E2E job runs on pull requests

- **WHEN** a pull request is opened or updated against the main branch
- **THEN** the `e2e` job SHALL run (not restricted to main branch only)

### Requirement: Smoke E2E runs before exhaustive E2E in CI

In the `e2e` job, smoke E2E tests SHALL run before exhaustive E2E tests. If smoke tests fail, exhaustive E2E tests SHALL NOT run (fast-fail behavior).

#### Scenario: Smoke tests pass, then exhaustive tests run

- **WHEN** the smoke E2E tests complete successfully
- **THEN** the exhaustive E2E tests SHALL run

#### Scenario: Smoke tests fail, exhaustive tests skipped

- **WHEN** any smoke E2E test fails
- **THEN** the exhaustive E2E tests SHALL NOT run and the `e2e` job SHALL fail immediately

### Requirement: CI uses Node.js 22 and caches dependencies

The CI workflow SHALL use Node.js 22 (matching `.nvmrc`), install dependencies via `npm ci`, cache `node_modules`, and install Playwright browsers with `npx playwright install --with-deps` only for jobs that run E2E tests.

#### Scenario: Node version in CI

- **WHEN** the CI workflow runs
- **THEN** it SHALL use Node.js version 22 as specified in `.nvmrc`

#### Scenario: Dependency caching

- **WHEN** the CI workflow installs dependencies
- **THEN** it SHALL cache `node_modules` to speed up subsequent runs

### Requirement: TDD mandate in OpenSpec configuration

The `openspec/config.yaml` context SHALL include the following testing rules: TDD is mandatory (write failing test before implementation), every tasks.md must include test tasks before implementation tasks, pre-commit gates must pass before committing, and coverage must not decrease between changes.

#### Scenario: OpenSpec config contains TDD rules

- **WHEN** the `openspec/config.yaml` file is read
- **THEN** it SHALL contain context lines mandating TDD, test-first task ordering, pre-commit gate enforcement, and coverage non-regression

#### Scenario: Change proposal references TDD rules

- **WHEN** a new OpenSpec change is created
- **THEN** the process context SHALL reflect the TDD mandate for all generated artifacts

### Requirement: Test-first task ordering in tasks.md

Every OpenSpec change `tasks.md` SHALL list test tasks (writing failing tests) before corresponding implementation tasks. No implementation task SHALL appear without a preceding test task that validates it.

#### Scenario: Tasks with test-first ordering

- **WHEN** a tasks.md is generated for a change
- **THEN** for each implementation task, there SHALL be a preceding test task that defines the expected behavior the implementation must satisfy

#### Scenario: Implementation task without preceding test

- **WHEN** a tasks.md contains an implementation task without a preceding test task for the same behavior
- **THEN** the tasks.md SHALL be considered incomplete

### Requirement: Coverage non-regression enforcement

The project SHALL enforce that code coverage does not decrease between changes. If a change causes coverage to drop below the established threshold, the CI check job SHALL fail.

#### Scenario: Change maintains or increases coverage

- **WHEN** a change is submitted and the coverage is at or above the 80% threshold
- **THEN** the CI check job SHALL pass the coverage step

#### Scenario: Change decreases coverage below threshold

- **WHEN** a change is submitted that reduces coverage below 80% for lines or branches
- **THEN** the CI check job SHALL fail on the coverage step

### Requirement: Vitest configuration

The project SHALL configure Vitest using the v8 provider with `text` and `lcov` reporters, and enforce a minimum threshold of 80% for lines and 80% for branches. The `passWithNoTests` option SHALL NOT be present in the configuration.

#### Scenario: Running tests with coverage

- **WHEN** `npx vitest run --coverage` is executed
- **THEN** Vitest SHALL generate coverage reports in both text (terminal) and lcov (file) formats

#### Scenario: Coverage below threshold fails the run

- **WHEN** code coverage for lines or branches falls below 80%
- **THEN** the Vitest run SHALL exit with a non-zero status code

#### Scenario: Coverage at or above threshold passes

- **WHEN** code coverage for lines and branches is at or above 80%
- **THEN** the Vitest run SHALL exit with status code 0

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
- **AND** the card SHALL have a red tinted background

#### Scenario: User searches for a medication without AINE shows GREEN result card

- **WHEN** a user searches for a medication without AINE (e.g., paracetamol)
- **THEN** a result card SHALL be displayed with `role="article"`
- **AND** the card SHALL display a status banner with the text from i18n key `status.GREEN.banner`
- **AND** the card SHALL have a green tinted background

#### Scenario: Search input has accessible label

- **WHEN** a user loads the application
- **THEN** the search input SHALL have an appropriate accessible label identifying it as a medication search field

#### Scenario: AINE status values are asserted

- **WHEN** a user searches for a medication containing an AINE (e.g., ibuprofeno)
- **THEN** the AINE status indicator SHALL display "RED"

- **WHEN** a user searches for a medication without AINE (e.g., paracetamol)
- **THEN** the AINE status indicator SHALL display "GREEN"

### Requirement: Playwright exhaustive E2E tests

The project SHALL include Playwright exhaustive E2E tests in an `e2e/exhaustive/` directory that cover all user-facing scenarios including: empty search, invalid input, error handling, multiple AINE detection, AMBER/YELLOW status rendering, result count, search states, and edge cases. Tests SHALL use the new component selectors. Test assertions for text content SHALL reference i18n keys from `messages/es-ES.json` rather than hardcoding literal strings.

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

#### Scenario: Medication with multiple AINEs shows all detected AINEs

- **WHEN** a user searches for a medication whose active ingredients match multiple AINE entries (e.g., a medication containing both ibuprofeno and ácido acetilsalicílico)
- **THEN** the result SHALL display a RED status and SHALL list all detected AINE names

#### Scenario: API server error shows error feedback to user

- **WHEN** the CIMA API returns a server error (500) during a search
- **THEN** the application SHALL display error feedback to the user

#### Scenario: API network failure shows error feedback to user

- **WHEN** the CIMA API request fails due to a network error
- **THEN** the application SHALL display error feedback to the user

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