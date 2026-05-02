## Why

The current CI pipeline runs all checks (build, lint, typecheck, unit tests, Playwright setup, smoke E2E) in a single sequential job, with exhaustive E2E tests running only on `main` pushes with `continue-on-error: true`. This means exhaustive E2E failures never block a merge and are only visible after code lands. Running everything serially also wastes time — lint and typecheck wait behind the build and E2E steps. Splitting into parallel jobs and promoting exhaustive E2E to a required PR gate gives faster feedback and stronger merge confidence.

## What Changes

- Split the single `check` job into two parallel jobs: `check` (build, lint, typecheck, unit tests) and `e2e` (build, Playwright install, smoke E2E → exhaustive E2E sequentially)
- Remove the `e2e-exhaustive` job's `if: github.ref == 'refs/heads/main'` gate so exhaustive E2E runs on PRs
- Remove `continue-on-error: true` from the exhaustive E2E job so failures block merges
- Run smoke E2E before exhaustive E2E in the `e2e` job as a fast-fail gate (smoke first, exhaustive after)
- Both `check` and `e2e` must pass before a PR can merge

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `ci-pipeline`: Split single `check` job into two parallel jobs (`check` + `e2e`); both are required PR gates; exhaustive E2E must pass before merge; remove post-merge-only and continue-on-error behavior from exhaustive E2E
- `e2e-tests`: Smoke and exhaustive E2E run sequentially in the same CI job (smoke as fast-fail gate before exhaustive)

## Impact

- `.github/workflows/ci.yml` — full restructure from 2 jobs to 2 parallel jobs with different step composition
- `playwright.config.ts` — no changes needed (projects and scripts already exist)
- `package.json` — no changes needed (scripts already exist)
- GitHub branch protection rules — `e2e` job must be added as a required status check alongside `check`
