## Context

The CI pipeline currently uses a single `check` job that runs build, lint, typecheck, unit tests, Playwright install, and smoke E2E sequentially. A separate `e2e-exhaustive` job runs only on `main` pushes with `continue-on-error: true`, meaning exhaustive E2E failures never block a merge. This results in slow PR feedback (serial execution), no PR gate for exhaustive E2E, and redundant builds (CI builds twice + Vercel builds once = 3 builds per merge).

## Goals / Non-Goals

**Goals:**

- Run exhaustive E2E as a required PR gate so bugs are caught before merge
- Parallelize CI into two jobs for faster wall-time feedback
- Run smoke E2E before exhaustive E2E as a fast-fail gate within the `e2e` job
- Eliminate `continue-on-error` and `main`-only gate on exhaustive E2E

**Non-Goals:**

- Optimizing or minimizing Vercel's build step (separate future change)
- Adding new test cases or Playwright projects
- Changing branch protection rules (that's a GitHub UI action, not code)
- Modifying the Playwright configuration

## Decisions

### Two parallel jobs instead of one

**Decision**: Split CI into `check` (build, lint, typecheck, unit tests) and `e2e` (build, Playwright install, smoke → exhaustive E2E) running in parallel.

**Rationale**: Lint, typecheck, and unit tests are fast (~1-2 min). E2E tests are slower (~3-5 min). Running them in parallel cuts wall time. Both must pass before merge.

**Alternatives considered**:

- Three jobs (check, smoke-e2e, exhaustive-e2e): Rejected because it adds a third `npm ci` + build, wasting CI minutes and cache contention.
- Keep single job but reorder steps: Rejected because tests still wait on each other serially.

### Build in both jobs

**Decision**: Both `check` and `e2e` run `npm ci` + `npm run build` independently.

**Rationale**: The `check` job needs the build to verify it compiles. The `e2e` job needs the build because Playwright starts the app via `npm run start`. Removing build from `check` would mean build breakage is only caught by the `e2e` job, which runs later. Accepting the duplicate build for faster failure signal.

**Trade-off**: Two builds per CI run instead of one, but GitHub Actions caches `node_modules` so `npm ci` is fast. The build step itself is the real cost (~30-60s), which is worth paying for parallel signal.

### Smoke before exhaustive in same job

**Decision**: Run `npm run test:e2e:smoke` then `npm run test:e2e:exhaustive` sequentially in the `e2e` job.

**Rationale**: If the app doesn't even load, there's no point running 7 exhaustive tests. Smoke fails fast. Keeping them as separate Playwright projects (not merged) preserves the ability to run them independently locally.

### Both jobs as required PR gates

**Decision**: Both `check` and `e2e` must be required status checks for merging to `main`.

**Rationale**: The whole point is that exhaustive E2E blocks merges. This requires updating branch protection rules in GitHub (manual step, not in code).

## Risks / Trade-offs

- **CI minutes increase**: Two parallel jobs each run `npm ci` + `build`, doubling those steps. Mitigated by caching; net wall-time still decreases.
- **GitHub branch protection**: Must be updated manually in GitHub settings to require the `e2e` job. Not automatable in this repo's workflow file alone.
- **Flaky E2E blocking PRs**: Exhaustive E2E is now a hard gate. Any flakiness directly blocks merges. Mitigated by Playwright's CI retries (currently 2).
- **No deduplication of build artifacts**: Each job builds independently. Could be optimized later with artifact sharing, but adds complexity.
