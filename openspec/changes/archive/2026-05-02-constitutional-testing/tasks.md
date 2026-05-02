## 1. Vitest Coverage Configuration

- [x] 1.1 Write test for data/aines.ts validating Zod schema parse and structural assertions (all 7 entries present, all required fields filled)
- [x] 1.2 Remove `passWithNoTests: true` from vitest.config.ts and add coverage configuration (v8 provider, text + lcov reporters, 80% lines and branches thresholds)
- [x] 1.3 Add `test:coverage` script to package.json (`vitest run --coverage`)
- [x] 1.4 Verify `npm run test:coverage` passes with thresholds enforced

## 2. Pre-commit Gate Enhancement

- [x] 2.1 Write test verifying that no `passWithNoTests` option exists in vitest.config.ts (regression guard)
- [x] 2.2 Update `.husky/pre-commit` to run `npx vitest run` and `npx tsc --noEmit` in addition to `npx lint-staged`
- [x] 2.3 Verify pre-commit hook blocks commits when tests fail or typecheck fails

## 3. Playwright Setup

- [x] 3.1 Write a failing test scaffold for a Playwright smoke test that navigates to the app and verifies the page loads
- [x] 3.2 Install Playwright (`npm install -D @playwright/test`) and add `test:e2e`, `test:e2e:smoke`, `test:e2e:exhaustive` scripts to package.json
- [x] 3.3 Create `playwright.config.ts` with `smoke` (single worker, serial) and `exhaustive` (multi-worker, parallel) projects, webServer pointing to Next.js dev server
- [x] 3.4 Run `npx playwright install` to download browser binaries
- [x] 3.5 Create `e2e/smoke.spec.ts` with the critical path test (search medication → see AINE status)
- [x] 3.6 Create `e2e/exhaustive/` directory and write exhaustive E2E test scenarios (empty search, invalid input, error handling, multiple AINE detection)
- [x] 3.7 Verify `npm run test:e2e:smoke` and `npm run test:e2e:exhaustive` both pass

## 4. GitHub Actions CI Pipeline

- [x] 4.1 Create `.github/workflows/ci.yml` with a `check` job: checkout, setup Node 22, `npm ci`, `next build`, `npm run lint`, `npx tsc --noEmit`, `npm run test:coverage`, Playwright smoke E2E
- [x] 4.2 Add `e2e-exhaustive` job to `ci.yml`: runs on push to main only, executes Playwright exhaustive E2E with parallel workers, reports results as non-blocking
- [x] 4.3 Add dependency caching for `node_modules` and Playwright browsers to both CI jobs
- [x] 4.4 Add Playwright browser installation step (`npx playwright install --with-deps`) to CI jobs that run E2E tests
- [x] 4.5 Verify CI workflow runs correctly on a test PR (all steps pass)

## 5. OpenSpec Process Configuration

- [x] 5.1 Update `openspec/config.yaml` context to include TDD mandate: "TDD is mandatory: write failing test before implementation", "Every tasks.md must include test tasks before impl tasks", "Pre-commit gates must pass", "Coverage must not decrease between changes"
- [x] 5.2 Verify the updated config is reflected when creating a new OpenSpec change

## 6. API Integration Test Infrastructure

- [x] 6.1 Write a failing test for a new API integration test helper that creates a Next.js test server instance
- [x] 6.2 Implement the test helper utility for spinning up the Next.js app in test mode with mocked external fetch
- [x] 6.3 Write integration tests for `/api/cima` using the test server (covering search by nombre, detail by nregistro, detail by cn, error handling) — these complement the existing route tests
- [x] 6.4 Verify all integration tests pass with `npm run test:coverage` and coverage thresholds are met
