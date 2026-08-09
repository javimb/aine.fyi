> **For agentic workers:** Follow apply's instructions and don't implement these tasks directly. Instead, use superpowers:subagent-driven-development to implement the plan.md.

## 1. Failing tests for CIMA 204 → 404 (TDD RED)

- [x] 1.1 Add unit test in `src/app/api/cima/route.test.ts`: CIMA returns 204 No Content for detail lookup by `nregistro` → `/api/cima` returns 404 with `aineAnalysis.status` `"YELLOW"` and empty `matchedAines`
- [x] 1.2 Add unit test in `src/app/api/cima/route.test.ts`: CIMA returns 204 No Content for detail lookup by `cn` → `/api/cima` returns 404 with `aineAnalysis.status` `"YELLOW"`
- [x] 1.3 Add integration test in `src/app/api/cima/integration.test.ts`: CIMA returns 204 No Content for detail lookup by `nregistro` → `/api/cima` returns 404 with YELLOW analysis
- [x] 1.4 Run `npm run test` and confirm the new tests fail (currently 502, expected 404)

## 2. Implement 204 handling in the proxy route (TDD GREEN)

- [x] 2.1 Modify `handleDetail` in `src/app/api/cima/route.ts` to check `response.status === 204` and return the same 404 + `aineAnalysis: YELLOW` response used for CIMA 404, before attempting `response.json()`
- [x] 2.2 Run `npm run test` and confirm the new tests pass and no existing tests regress

## 3. Commit: fix

- [x] 3.1 Commit: `fix(api): treat CIMA 204 No Content as not-found for detail lookups`

## 4. Documentation note

- [x] 4.1 Add one-line note to `docs/cima-api.md` (section 4, item 3): CIMA returns 204 No Content (not 404) for unknown `nregistro`/`cn` lookups; the proxy normalizes it to a 404 not-found response
- [x] 4.2 Run `npm run lint` and confirm no new violations

## 5. Commit: docs

- [x] 5.1 Commit: `docs(api): note CIMA 204 No Content behavior in cima-api.md`

## 6. Push and Create PR

- [ ] 6.1 Push branch to remote
- [ ] 6.2 Create pull request via `gh` CLI
