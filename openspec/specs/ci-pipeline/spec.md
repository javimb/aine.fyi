## Purpose

TBD

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
