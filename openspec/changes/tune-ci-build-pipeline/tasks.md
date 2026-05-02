## 1. Restructure CI workflow

- [x] 1.1 Remove the `e2e-exhaustive` job from `.github/workflows/ci.yml`
- [x] 1.2 Remove build and Playwright steps from the `check` job in `.github/workflows/ci.yml` (keep: npm ci, build, lint, tsc --noEmit, vitest coverage)
- [x] 1.3 Add a new `e2e` job to `.github/workflows/ci.yml` that runs on both push to main and pull requests to main (no `if` condition)
- [x] 1.4 Configure the `e2e` job with steps: npm ci, build, restore Playwright browsers cache, install Playwright browsers, run smoke E2E (`npm run test:e2e:smoke`), then run exhaustive E2E (`npm run test:e2e:exhaustive`) — using shell `&&` so exhaustive only runs if smoke passes
- [x] 1.5 Remove `continue-on-error` from the `e2e` job

## 2. Verify CI configuration

- [ ] 2.1 Push the branch, open a draft PR, and confirm both `check` and `e2e` jobs run in parallel on the PR
- [ ] 2.2 Confirm the `e2e` job runs smoke E2E first and only runs exhaustive E2E if smoke passes
- [ ] 2.3 Confirm both `check` and `e2e` must pass before merge (update GitHub branch protection rules to require `e2e` as a required status check)
