## 1. Smoke E2E Status Assertions

- [ ] 1.1 Write failing test in `e2e/smoke.spec.ts` that asserts AINE status shows "RED" when searching for ibuprofeno
- [ ] 1.2 Write failing test in `e2e/smoke.spec.ts` that asserts AINE status shows "GREEN" when searching for paracetamol
- [ ] 1.3 Update the application UI (if needed) so that AINE status elements expose their value in a testable way (data attribute or text content) and make the tests pass
- [ ] 1.4 Verify `npm run test:e2e:smoke` passes

## 2. Exhaustive E2E Multiple AINE Detection

- [ ] 1.5 Write failing test in `e2e/exhaustive/search.spec.ts` for multiple AINE detection: search a medication whose active ingredients match multiple AINE entries and verify all are listed
- [ ] 2.1 Implement any needed UI changes to display all detected AINE names in the result, making the test pass
- [ ] 2.2 Verify `npm run test:e2e:exhaustive` passes

## 3. Exhaustive E2E API Error Interception

- [ ] 3.1 Write failing test in `e2e/exhaustive/search.spec.ts` that uses `page.route()` to intercept `/api/cima*` and return a 500 response, then verify error feedback is shown
- [ ] 3.2 Write failing test in `e2e/exhaustive/search.spec.ts` that uses `page.route()` to simulate a network failure (abort the request) and verify error feedback is shown
- [ ] 3.3 Add error UI to the application (if not already present) so that API errors display user-facing feedback, making the tests pass
- [ ] 3.4 Verify `npm run test:e2e:exhaustive` passes

## 4. Playwright Configuration Hardening

- [ ] 4.1 Add `workers: 1` and `timeout: 30000` to the smoke project in `playwright.config.ts`
- [ ] 4.2 Update Playwright `webServer` config to use `npm run start` when `CI` environment variable is set, falling back to `npm run dev` locally
- [ ] 4.3 Add `npm run build` step before E2E in `.github/workflows/ci.yml` check job (ensure the build artifact is reused, not rebuilt)
- [ ] 4.4 Verify `npm run test:e2e:smoke` and `npm run test:e2e:exhaustive` pass locally
- [ ] 4.5 Verify CI workflow passes on a test PR
