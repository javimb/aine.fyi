## ADDED Requirements

### Requirement: GitHub Actions CI workflow

The project SHALL have a GitHub Actions workflow file at `.github/workflows/ci.yml` that runs on pull requests to main and on pushes to main.

#### Scenario: Pull request opened against main

- **WHEN** a pull request is opened or updated against the main branch
- **THEN** the CI workflow SHALL run the check job

#### Scenario: Push to main

- **WHEN** code is pushed to the main branch
- **THEN** the CI workflow SHALL run both the check job and the exhaustive E2E job

### Requirement: Check job (merge gate)

The CI workflow SHALL include a `check` job that runs: Next.js build, ESLint, TypeScript typecheck (`tsc --noEmit`), Vitest unit tests with coverage (enforcing 80% threshold), and Playwright smoke E2E tests. This job MUST pass before a pull request can be merged.

#### Scenario: All checks pass

- **WHEN** all steps in the check job succeed
- **THEN** the check job SHALL report success and the PR SHALL be eligible for merge

#### Scenario: Coverage below threshold

- **WHEN** the Vitest coverage step reports line or branch coverage below 80%
- **THEN** the check job SHALL fail and block the PR from merging

#### Scenario: Smoke E2E test fails

- **WHEN** any Playwright smoke E2E test fails
- **THEN** the check job SHALL fail and block the PR from merging

#### Scenario: Build or typecheck fails

- **WHEN** `next build` or `tsc --noEmit` fails
- **THEN** the check job SHALL fail and block the PR from merging

### Requirement: Exhaustive E2E job (post-merge signal)

The CI workflow SHALL include an `e2e-exhaustive` job that runs the full Playwright E2E suite with parallel workers. This job SHALL run on pushes to main but SHALL NOT be a required status check for PR merges.

#### Scenario: Exhaustive E2E succeeds

- **WHEN** all exhaustive E2E tests pass
- **THEN** the job SHALL report success as a non-blocking signal

#### Scenario: Exhaustive E2E fails

- **WHEN** one or more exhaustive E2E tests fail
- **THEN** the job SHALL report failure but SHALL NOT block merging of PRs

#### Scenario: Exhaustive E2E runs in parallel

- **WHEN** the exhaustive E2E job runs
- **THEN** Playwright SHALL use multiple workers to parallelize test execution

### Requirement: CI uses Node.js 22 and caches dependencies

The CI workflow SHALL use Node.js 22 (matching `.nvmrc`), install dependencies via `npm ci`, cache `node_modules`, and install Playwright browsers with `npx playwright install --with-deps` only for jobs that run E2E tests.

#### Scenario: Node version in CI

- **WHEN** the CI workflow runs
- **THEN** it SHALL use Node.js version 22 as specified in `.nvmrc`

#### Scenario: Dependency caching

- **WHEN** the CI workflow installs dependencies
- **THEN** it SHALL cache `node_modules` to speed up subsequent runs
