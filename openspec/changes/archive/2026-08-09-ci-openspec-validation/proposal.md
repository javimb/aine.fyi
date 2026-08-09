## Why

OpenSpec artifacts (main specs and in-flight changes) are the contract that drives development in this repository, but nothing currently enforces their validity. An invalid change can be opened and merged silently, letting broken deltas or malformed specs reach `main`. CI already gates the code via the `check` and `e2e` jobs, yet the specs themselves are never validated. Adding an `openspec validate --all --strict` step as a required merge gate closes that gap: it catches malformed changes and specs on every PR, at near-zero CI cost, and keeps the spec-driven workflow trustworthy.

## What Changes

**CI pipeline**

- From: `.github/workflows/ci.yml` defines two parallel jobs — `check` and `e2e` — both required for merge.
- To: a third parallel `openspec` job is added that installs the pinned OpenSpec CLI (`@fission-ai/openspec@1.8.0`) globally and runs `openspec validate --all --strict --json`.
- Reason: enforce the validity of specs and in-flight changes at the merge gate, mirroring how developers run the CLI locally.
- Impact: non-breaking; the new job must be added as a required status check on `main` in GitHub branch protection.

## Capabilities

### New Capabilities

<!-- No new capability introduced; this change extends the existing quality-pipeline capability. -->

### Modified Capabilities

- `quality-pipeline`: The "GitHub Actions CI workflow" requirement changes from two parallel jobs (`check`, `e2e`) to three (`check`, `e2e`, `openspec`), with the new `openspec` job validating specs and changes in strict mode and being required for merge.

## Impact

- `.github/workflows/ci.yml`: new `openspec` job (checkout → setup Node 22 → global CLI install pinned to 1.8.0 → `openspec validate --all --strict --json`).
- GitHub branch protection: `openspec` added as a required status check on `main` (manual UI update).
- No application code, dependencies, or API changes. The change's own spec delta will be validated by the new job once merged, so its artifacts must be valid.
