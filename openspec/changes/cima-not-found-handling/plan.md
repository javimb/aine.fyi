# CIMA Not-Found Handling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/api/cima` proxy treat CIMA's 204 No Content response as not-found (404 + YELLOW analysis) instead of a 502 server error, so the existing frontend fallback (retry with `nombre` → empty-results UI) works for unknown CN/nregistro lookups.

**Architecture:** One behavior change in `handleDetail()` in `src/app/api/cima/route.ts`: before parsing the response body, treat `response.status === 204` the same as 404 (return `{ aineAnalysis: YELLOW_ANALYSIS }` with status 404). Search path, 5xx → 502, and 400 handling are untouched. Tests first (unit + integration), then the fix, then a docs note in `docs/cima-api.md`.

**Tech Stack:** Next.js 16 App Router route handler, Vitest (unit: `route.test.ts`; integration: `integration.test.ts` via `createTestServer`), TypeScript.

**Reference artifacts (read before starting):**

- Spec delta: `openspec/changes/cima-not-found-handling/specs/cima-proxy/spec.md` (scenario "Medication not found in CIMA (204 No Content)")
- Design: `openspec/changes/cima-not-found-handling/design.md`
- Tasks: `openspec/changes/cima-not-found-handling/tasks.md`

**Key fact (verified live):** CIMA `/medicamento` returns **204 No Content with an empty body** for unknown `nregistro`/`cn`. `response.ok` is `true` for 204, so today `response.json()` throws → generic `catch` → 502. The fix must check `status === 204` **before** `response.json()`.

---

### Task 1: Unit tests for 204 → 404 (nregistro and cn)

**Files:**

- Modify: `src/app/api/cima/route.test.ts` (add two tests after the existing "returns 404 with YELLOW analysis when CIMA returns 404 for detail lookup" test, ~line 140)

- [ ] **Step 1: Write the failing unit tests**

Add to `src/app/api/cima/route.test.ts` (after the existing 404 detail-lookup test):

```ts
it("returns 404 with YELLOW analysis when CIMA returns 204 for detail lookup by nregistro", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 204,
    json: () => Promise.reject(new SyntaxError("Unexpected end of JSON input")),
  });

  const { GET } = await import("@/app/api/cima/route");
  const request = createRequest({ nregistro: "99999" });
  const response = await GET(request);

  expect(response.status).toBe(404);
  const body = await response.json();
  expect(body.aineAnalysis.status).toBe("YELLOW");
});

it("returns 404 with YELLOW analysis when CIMA returns 204 for detail lookup by cn", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 204,
    json: () => Promise.reject(new SyntaxError("Unexpected end of JSON input")),
  });

  const { GET } = await import("@/app/api/cima/route");
  const request = createRequest({ cn: "99999" });
  const response = await GET(request);

  expect(response.status).toBe(404);
  const body = await response.json();
  expect(body.aineAnalysis.status).toBe("YELLOW");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- src/app/api/cima/route.test.ts`
Expected: the two new tests FAIL — today the 204 passes `!response.ok` (ok is true), `response.json()` rejects, the catch returns 502, so `expect(response.status).toBe(404)` fails.

### Task 2: Integration test for 204 → 404

**Files:**

- Modify: `src/app/api/cima/integration.test.ts` (add one test after the existing "returns 404 with YELLOW analysis when CIMA returns 404 for detail lookup" test, ~line 115)

- [ ] **Step 1: Write the failing integration test**

Add to `src/app/api/cima/integration.test.ts`:

```ts
it("returns 404 with YELLOW analysis when CIMA returns 204 for detail lookup", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 204,
    json: () => Promise.reject(new SyntaxError("Unexpected end of JSON input")),
  });

  const response = await server.fetch("/api/cima?nregistro=99999");
  expect(response.status).toBe(404);
  const body = await response.json();
  expect(body.aineAnalysis.status).toBe("YELLOW");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- src/app/api/cima/integration.test.ts`
Expected: the new test FAILS with `expected 404 to be 502` (current behavior returns 502).

- [ ] **Step 3: Commit the failing tests**

```bash
git add src/app/api/cima/route.test.ts src/app/api/cima/integration.test.ts
git commit -m "test(api): add failing tests for CIMA 204 not-found handling"
```

### Task 3: Implement 204 → 404 in handleDetail (TDD GREEN)

**Files:**

- Modify: `src/app/api/cima/route.ts:56-67` (`handleDetail`, the `if (!response.ok)` block)

- [ ] **Step 1: Modify `handleDetail`**

In `src/app/api/cima/route.ts`, change the error-handling block from:

```ts
if (!response.ok) {
  if (response.status === 404) {
    return NextResponse.json(
      { aineAnalysis: YELLOW_ANALYSIS },
      { status: 404 },
    );
  }
  return NextResponse.json({ aineAnalysis: YELLOW_ANALYSIS }, { status: 502 });
}
```

to:

```ts
if (!response.ok || response.status === 204) {
  if (response.status === 404 || response.status === 204) {
    return NextResponse.json(
      { aineAnalysis: YELLOW_ANALYSIS },
      { status: 404 },
    );
  }
  return NextResponse.json({ aineAnalysis: YELLOW_ANALYSIS }, { status: 502 });
}
```

The 204 check runs before `response.json()`, so the empty body is never parsed. Do NOT touch `handleSearch` or `fetchDetail`.

- [ ] **Step 2: Run the full test suite**

Run: `npm run test`
Expected: all tests PASS, including the 3 new ones and the existing 502/404/400 cases. Coverage must not decrease (new tests exercise `handleDetail`'s 204 branch).

- [ ] **Step 3: Commit the fix**

```bash
git add src/app/api/cima/route.ts
git commit -m "fix(api): treat CIMA 204 No Content as not-found for detail lookups"
```

### Task 4: Documentation note in cima-api.md

**Files:**

- Modify: `docs/cima-api.md` (Section 4, item 3, line ~68)

- [ ] **Step 1: Add the note**

In `docs/cima-api.md`, Section 4 "Implementation Logic for NSAID Filter", replace:

```
   - **ERROR/404:** Trigger "Unknown/Yellow" UI state.
```

with:

```
   - **ERROR/404:** Trigger "Unknown/Yellow" UI state.
   - **Note:** CIMA returns `204 No Content` (empty body), not 404, for unknown `nregistro`/`cn` lookups. The proxy normalizes 204 to a 404 not-found response so the UI can distinguish not-found from server errors.
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no new violations.

- [ ] **Step 3: Commit the docs change**

```bash
git add docs/cima-api.md
git commit -m "docs(api): note CIMA 204 No Content behavior in cima-api.md"
```

### Task 5: Full verification and PR

**Files:** none (git operations only)

- [ ] **Step 1: Verify everything passes**

Run: `npm run test && npm run lint`
Expected: all tests pass, lint clean.

- [ ] **Step 2: Push and open PR**

```bash
git push -u origin HEAD
gh pr create --fill
```

Expected: PR created; the diff contains the route fix, 3 tests, and the docs note (plus the `openspec/changes/cima-not-found-handling/` artifacts).

## Self-Review

- **Spec coverage:** Delta scenario "Medication not found in CIMA (204 No Content)" → Task 3 fix; "Medication not found in CIMA (404)" unchanged, still covered by existing tests. ✓
- **Placeholders:** none — every step has exact code, paths, and commands. ✓
- **Type consistency:** `YELLOW_ANALYSIS`, `response.json()`, `createRequest`, `server.fetch` all match existing usage in the referenced files. ✓
