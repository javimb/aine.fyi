<!--
Delta spec for change ci-openspec-validation.
Modifies the quality-pipeline capability: adds an OpenSpec validation job to CI.
-->

## MODIFIED Requirements

### Requirement: GitHub Actions CI workflow

The project SHALL have a GitHub Actions workflow file at `.github/workflows/ci.yml` that runs on pull requests to main and on pushes to main. The workflow SHALL define three parallel jobs: `check`, `e2e`, and `openspec`. All three jobs SHALL be required status checks for branch protection on `main`, enforced via GitHub branch protection rules.

#### Scenario: Pull request opened against main

- **WHEN** a pull request is opened or updated against the main branch
- **THEN** the CI workflow SHALL run the `check`, `e2e`, and `openspec` jobs in parallel

#### Scenario: Push to main

- **WHEN** code is pushed to the main branch
- **THEN** the CI workflow SHALL run the `check`, `e2e`, and `openspec` jobs

#### Scenario: Branch protection blocks merge on failing CI

- **WHEN** the `check`, `e2e`, or `openspec` status check is failing or pending on a pull request
- **THEN** GitHub SHALL prevent the pull request from being merged to `main`

---

## ADDED Requirements

### Requirement: OpenSpec validation job (merge gate)

The CI workflow SHALL include an `openspec` job that validates the repository's OpenSpec specs and in-flight changes in strict mode. The job SHALL install the OpenSpec CLI globally at version `@fission-ai/openspec@1.8.0` and run `openspec validate --all --strict`. This job MUST pass before a pull request can be merged. The job SHALL NOT install project dependencies.

#### Scenario: All OpenSpec artifacts are valid

- **WHEN** all main specs under `openspec/specs/**` and all in-flight changes under `openspec/changes/**` pass strict validation
- **THEN** the `openspec` job SHALL report success and the PR SHALL be eligible for merge

#### Scenario: An OpenSpec artifact is invalid

- **WHEN** `openspec validate --all --strict` reports an ERROR-level issue in any spec or change
- **THEN** the `openspec` job SHALL fail and block the PR from merging

#### Scenario: Only INFO-level issues present

- **WHEN** `openspec validate --all --strict` reports only INFO-level issues (no errors)
- **THEN** the `openspec` job SHALL pass

#### Scenario: Pinned CLI version is installed

- **WHEN** the `openspec` job runs
- **THEN** it SHALL install `@fission-ai/openspec` version `1.8.0` globally

#### Scenario: Job does not install project dependencies

- **WHEN** the `openspec` job runs
- **THEN** it SHALL NOT run `npm ci`
