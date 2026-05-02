## Context

The constitutional-testing change established a three-ring testing defense (TDD process, pre-commit gates, CI gates). Verification revealed that while the infrastructure is solid, several test scenarios are incomplete and configuration details diverge from the spec. The Playwright smoke project runs serially but doesn't enforce `workers: 1` or a short timeout. Smoke E2E tests check that AINE status elements exist but don't assert the actual values (RED/GREEN). The exhaustive suite has no test for detecting multiple AINEs in a single medication, which is a core feature edge case. No E2E test exercises API error paths from the browser. In CI, E2E tests run against `npm run dev` rather than the production build.

## Goals / Non-Goals

**Goals:**

- Fill E2E test coverage gaps: multiple AINE detection, status value assertions, API error interception
- Align Playwright config with spec: `workers: 1` and short timeout for smoke, `fullyParallel: true` remains for exhaustive
- Use production build for E2E tests in CI (via `npm run start` instead of `npm run dev`)
- Maintain or increase code coverage thresholds (80% lines/branches)

**Non-Goals:**

- Visual regression testing (Percy, Chromatic)
- Performance or load testing
- Adding new unit tests (existing coverage is above threshold)
- Changing the CI pipeline structure (the two-job architecture is correct)

## Decisions

### D1: Use Playwright `route` interception for API error E2E tests

**Choice**: Use `page.route()` to intercept and mock API responses in exhaustive E2E tests.

**Rationale**: Playwright's `route()` lets tests simulate server errors, timeouts, and network failures without modifying the application code. This is the standard Playwright approach for testing error states.

**Alternatives considered**:

- Modifying the app to accept a "test mode" flag: Adds unnecessary complexity to production code
- Skipping E2E error tests and relying on unit/integration tests only: Leaves E2E coverage gap for error UI

### D2: Production build for CI E2E tests

**Choice**: In CI, use `npm run build` + `npm run start` for the Playwright webServer instead of `npm run dev`.

**Rationale**: CI should test what actually gets deployed. The dev server has different behavior (hot reload, different compilation) than the production build. Testing against the production build catches build-time issues that wouldn't surface with dev server.

**Alternatives considered**:

- Keep dev server in CI: Faster startup but doesn't test production behavior
- Run both dev and prod E2E suites: Too slow for the CI check job, would double E2E time

### D3: Smoke project config: `workers: 1`, `timeout: 30000`

**Choice**: Explicitly set `workers: 1` and `timeout: 30000` on the smoke Playwright project.

**Rationale**: The spec requires the smoke project to run serially with a single worker and be fast. Currently `fullyParallel: false` serializes tests but doesn't limit to one worker. An explicit 30s timeout per test ensures smoke stays fast and fails clearly on hangs.

**Alternatives considered**:

- Keep only `fullyParallel: false`: Doesn't guarantee single worker, slower in CI
- Shorter timeout (15s): Too aggressive for network-dependent tests

## Risks / Trade-offs

- **Production build in CI adds startup time**: `npm run build` + `npm run start` takes longer than `npm run dev` to get the server ready → Mitigation: Build step already exists in CI check job; reuse it. Playwright `webServer` handles the startup wait.
- **Route interception tests are brittle if API paths change**: Mocking API URLs creates coupling → Mitigation: Use broad URL patterns (e.g., `/api/cima*`) rather than exact URLs with query params
- **Adding timeout to smoke project may cause flaky failures in slow CI**: 30s might not be enough under high CI load → Mitigation: 30s is generous for smoke tests; monitor and adjust if needed
