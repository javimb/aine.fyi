## Why

The project has no constitutional testing foundation. The 20 existing tests are good but circumstantial — they were written ad-hoc, not enforced by process or tooling. The pre-commit hook runs lint-staged only (no tests, no typecheck). Vitest is configured with `passWithNoTests: true` (the opposite of TDD). There are no E2E tests, no coverage thresholds, no CI pipeline, and no process-level enforcement of TDD. Every new feature added without these guarantees accumulates risk. Now is the time to establish testing as a constitutional requirement before the codebase grows.

## What Changes

- **BREAKING**: Remove `passWithNoTests: true` from Vitest config — test suites must not silently pass when they shouldn't
- Add Vitest coverage configuration with 80% floor for lines and branches (v8 provider, lcov + text reporters)
- Add Playwright for browser-level E2E testing (smoke tests + exhaustive suite)
- Add API-level integration test infrastructure using Vitest + Next.js test utilities
- Update pre-commit hook to run unit tests (`vitest run`) and typecheck (`tsc --noEmit`) in addition to lint-staged
- Add GitHub Actions CI workflow: build, lint, typecheck, unit tests with coverage gate (must pass for merge), Playwright smoke E2E (must pass for merge)
- Add GitHub Actions CI workflow: exhaustive Playwright E2E suite (parallel, post-merge signal, non-blocking)
- Add unit tests for `data/aines.ts` (Zod runtime validation + explicit structural assertions)
- Update OpenSpec `config.yaml` to mandate TDD as a process rule
- Add `test` script entries to `package.json` for all test modes

## Capabilities

### New Capabilities

- `testing-foundation`: Vitest coverage thresholds, Playwright setup, test script infrastructure, and configuration files
- `ci-pipeline`: GitHub Actions workflows for continuous integration (check gate + exhaustive E2E)
- `e2e-tests`: Browser-level Playwright E2E tests (smoke and exhaustive) and API integration tests
- `tdd-process`: OpenSpec process-level TDD enforcement (config rules, task ordering)

### Modified Capabilities

- `project-setup`: Vitest requirement changes from "allow zero tests" to "enforce coverage floor and no passWithNoTests"
