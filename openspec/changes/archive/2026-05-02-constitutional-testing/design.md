## Context

The esunaine project is a Next.js application that proxies the CIMA API and enriches medication data with AINE (NSAID) analysis. It currently has 20 unit tests across 2 test files, no E2E tests, no coverage enforcement, no CI pipeline, and no process-level testing mandates. The pre-commit hook runs lint-staged only. Vitest is configured with `passWithNoTests: true`, which silently passes when no tests match — the opposite of TDD discipline. The project is at an early stage (minimal UI, core API logic) making this the ideal time to establish a constitutional testing foundation before complexity grows.

## Goals / Non-Goals

**Goals:**

- Establish a three-ring defense: TDD process (individual), pre-commit gates (local), CI gates (remote)
- Enforce 80% code coverage floor for lines and branches via Vitest thresholds
- Remove `passWithNoTests: true` — test suites must not silently pass
- Add Playwright E2E infrastructure with smoke tests (blocking) and exhaustive tests (post-merge signal)
- Add API-level integration tests via Vitest + Next.js test server
- Configure GitHub Actions CI pipeline (free tier) with build, lint, typecheck, unit tests + coverage gate, and Playwright smoke E2E as merge gates
- Configure GitHub Actions for exhaustive Playwright E2E as a post-merge parallel job that reports but doesn't block merge
- Enshrine TDD as a constitutional rule in OpenSpec config and task ordering

**Non-Goals:**

- Test coverage for third-party libraries (shadcn/ui components, Next.js internals)
- Visual regression testing (e.g., Percy, Chromatic) — out of scope for now
- Performance/load testing
- Adding tests for existing code beyond the data layer — current tests for aine-matcher and cima route are sufficient
- Setting up a staging environment or deployment pipeline (beyond the basic CI gate)

## Decisions

### D1: Vitest for unit + API integration, Playwright for browser E2E

**Choice**: Vitest remains the unit test runner. Playwright is added for browser E2E.

**Rationale**: Vitest is already configured and the team is familiar with it. It handles unit tests and API integration tests (via `next/test/server` or manual `fetch` against a test server) well. Playwright is the industry standard for browser automation E2E in Next.js projects, with first-class support in the ecosystem.

**Alternatives considered**:

- Cypress: Heavier setup, less native Next.js integration, slower for CI parallelism
- Jest: Would require migrating away from Vitest — no benefit for a marginal test runner difference

### D2: Coverage thresholds at 80% lines and branches

**Choice**: 80% floor for both lines and branches using Vitest v8 coverage provider.

**Rationale**: 80% is a pragmatic starting floor — high enough to catch missing tests, low enough to not be bureaucratic. Can be ratcheted up over time. Starting without a floor and adding one later means you never have a baseline to enforce against.

**Alternatives considered**:

- 100%: Unrealistic, leads to testing getters/setters and boilerplate
- 70%: Too permissive, easy to ship untested paths
- No threshold: Defeats the purpose of coverage tooling

### D3: Pre-commit runs ALL unit tests (not just changed files)

**Choice**: Pre-commit hook runs `npx vitest run` on every commit.

**Rationale**: The current suite runs in ~600ms. Even at 10x growth, it's ~6s. This is well within acceptable pre-commit latency. Running all tests catches regressions that related-file heuristics miss. When the suite exceeds ~5s, migrate to a pre-push hook instead.

**Alternatives considered**:

- Only changed-related tests: Complex to configure correctly, easy to miss regressions
- Pre-push instead of pre-commit: Allows broken tests to exist locally — reduces friction but undermines the "tests must pass before commit lands" gate

### D4: GitHub Actions CI with two jobs — Check (blocking) and E2E Exhaustive (non-blocking)

**Choice**: Single workflow file with two jobs:

- `check`: build + lint + typecheck + unit tests + coverage gate + Playwright smoke E2E (blocking, must pass for merge)
- `e2e-exhaustive`: Full Playwright E2E suite (non-blocking, reports results, runs in parallel)

**Rationale**: Free tier GitHub Actions gives 2000 min/month for private repos. A focused check job keeps merge latency low (target < 5 min). The exhaustive E2E runs independently so it doesn't block PRs. Smoke E2E covers the critical path (search → see AINE status) so regressions on the happy path are caught before merge.

**Alternatives considered**:

- Single job: Exhaustive E2E would block merges for too long
- Separate workflow files: Harder to manage, doesn't share setup
- No CI at all: Defeats the constitutional goal

### D5: Smoke E2E covers critical path only

**Choice**: Smoke E2E includes 1-2 tests: user searches a medication → sees AINE status result. Runs serially, fast (< 2 min).

**Rationale**: The critical user journey is simple: search → get result. This is the minimum that must never break. Keeping smoke minimal means merges aren't delayed.

### D6: Exhuastive E2E runs post-merge in parallel

**Choice**: After PR merges to main, the exhaustive E2E suite runs in parallel (Playwright workers). Failures are reported as status checks or notifications but don't block the merge.

**Rationale**: Full E2E coverage is valuable but slow. Making it blocking creates merge latency that discourages small PRs. Post-merge signal catches regressions early enough for fast follow-up fixes.

### D7: TDD enforcement via OpenSpec process, not just tooling

**Choice**: Add TDD mandates to `openspec/config.yaml` context. Every `tasks.md` must list test tasks before implementation tasks. Coverage must not decrease between changes.

**Rationale**: You can't enforce TDD with a pre-commit hook (the hook can't know if you wrote the test before or after the code). But you CAN enforce it structurally: if every task list starts with "write failing test for X", then following the tasks IS following TDD. Coverage thresholds and the "must not decrease" rule provide a backstop.

**Alternatives considered**:

- Pre-commit hook enforcing test-first: Not technically feasible
- CI-only enforcement: Too late, the damage is done
- No process enforcement, coverage only: Coverage can be high with poor test design (testing after the fact)

## Risks / Trade-offs

- **Pre-commit latency will grow**: Running all unit tests on every commit is fast now (~600ms) but will slow as the suite grows → Mitigation: Migrate to pre-push hook when suite exceeds 5s
- **Playwright adds CI complexity**: Browser tests need browser binaries in CI → Mitigation: Use `npx playwright install --with-deps` in CI, Playwright's official GitHub Action handles this well
- **80% coverage threshold may be too aggressive early**: Early in a project with few files, a single untested file can drop coverage below 80% → Mitigation: Start with coverage reporting but no threshold for the first 2 weeks, then enable the threshold once baseline is established
- **Exhaustive E2E as post-merge means regressions can reach main briefly**: A bug caught by exhaustive E2E will exist on main until the fix PR lands → Mitigation: Smoke E2E covers the critical path, exhaustive catches edge cases. This is an acceptable tradeoff for merge velocity
- **TDD process enforcement depends on discipline**: Tooling can enforce coverage, but writing tests before code is a human behavior → Mitigation: OpenSpec task ordering makes TDD the path of least resistance
