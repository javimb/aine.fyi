## MODIFIED Requirements

### Requirement: GitHub Actions CI workflow

The project SHALL have a GitHub Actions workflow file at `.github/workflows/ci.yml` that runs on pull requests to main and on pushes to main. The `check` job SHALL be a required status check for branch protection on `main`, enforced via GitHub branch protection rules.

#### Scenario: Pull request opened against main

- **WHEN** a pull request is opened or updated against the main branch
- **THEN** the CI workflow SHALL run the check job

#### Scenario: Push to main

- **WHEN** code is pushed to the main branch
- **THEN** the CI workflow SHALL run both the check job and the exhaustive E2E job

#### Scenario: Branch protection blocks merge on failing CI

- **WHEN** the `check` status check is failing or pending on a pull request
- **THEN** GitHub SHALL prevent the pull request from being merged to `main`
