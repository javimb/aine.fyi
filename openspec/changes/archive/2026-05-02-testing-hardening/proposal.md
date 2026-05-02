## Why

The constitutional-testing change established the testing foundation, but verification revealed gaps in E2E test coverage and Playwright configuration that undermine the testing guarantees. Specifically: the exhaustive E2E suite lacks a test for multiple AINE detection (a core feature), smoke E2E tests don't assert actual AINE status values (RED/GREEN), there's no E2E test for API error scenarios from the browser, the Playwright smoke project config doesn't enforce single-worker or short timeout as specified, and E2E tests run against the dev server instead of the production build in CI. These gaps mean the CI gate provides weaker coverage than intended.

## What Changes

- Add E2E test for multiple AINE detection in the exhaustive suite
- Add AINE status value assertions (RED/GREEN) to smoke E2E tests
- Add E2E tests for API error scenarios using Playwright route interception
- Configure Playwright smoke project with explicit `workers: 1` and short `timeout`
- Update Playwright config to use production build (`npm run start`) in CI instead of dev server

## Capabilities

### New Capabilities

(None)

### Modified Capabilities

- `e2e-tests`: Add multiple AINE detection test, status value assertions, API error interception tests, and tighten Playwright project config
- `project-setup`: Update pre-commit and Vitest setup requirement to reflect production build usage in CI E2E tests

## Impact

- `e2e/smoke.spec.ts` — status value assertions added
- `e2e/exhaustive/search.spec.ts` — multiple AINE detection test and API error interception tests added
- `playwright.config.ts` — smoke project `workers: 1` and `timeout` added; webServer command adjusted for CI
- `.github/workflows/ci.yml` — add `npm run build` step before E2E in check job (already present), adjust webServer usage
