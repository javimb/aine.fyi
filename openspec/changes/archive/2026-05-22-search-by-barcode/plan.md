# Search by Barcode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable users to search by CN (6-7 digit código nacional) and EAN-13 barcode, with transparent fallback to name search when no result is found.

**Architecture:** Client-side query detection utility (`src/lib/query-detection.ts`) classifies input as CN/EAN-13/name, extracts CN from barcodes, and the search bar component uses it to route to the correct API parameter (`cn` or `nombre`) with automatic fallback on empty results. The server `/api/cima` route is unchanged.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Vitest, next-intl, Tailwind CSS v4, shadcn/ui

---

## File Structure

| File                                         | Action | Responsibility                                              |
| -------------------------------------------- | ------ | ----------------------------------------------------------- |
| `src/lib/query-detection.ts`                 | Create | `detectQueryType()` and `extractCnFromEan13()` functions    |
| `src/lib/query-detection.test.ts`            | Create | Unit tests for both functions                               |
| `src/components/search-bar.tsx`              | Modify | Integrate query detection + fallback logic                  |
| `src/components/search-bar.test.tsx`         | Modify | Add tests for CN route, EAN-13 route, fallback, empty state |
| `messages/es-ES.json`                        | Modify | Update `search.placeholder` value                           |
| `openspec/changes/search-by-barcode/plan.md` | Create | This file                                                   |

---

### Task 1: Query detection — write failing tests

**Files:**

- Create: `src/lib/query-detection.test.ts`

- [ ] **Step 1: Write failing tests for `detectQueryType()`**

Create `src/lib/query-detection.test.ts` with the following tests:

```typescript
import { describe, it, expect } from "vitest";
import { detectQueryType, extractCnFromEan13 } from "./query-detection";

describe("detectQueryType", () => {
  it("classifies 6-digit numeric input as CN", () => {
    expect(detectQueryType("123456")).toBe("cn");
  });

  it("classifies 7-digit numeric input as CN", () => {
    expect(detectQueryType("1234567")).toBe("cn");
  });

  it("classifies 13-digit numeric input as EAN-13", () => {
    expect(detectQueryType("8470001234567")).toBe("ean13");
  });

  it("classifies alphanumeric input as name", () => {
    expect(detectQueryType("ibuprofeno")).toBe("name");
  });

  it("classifies short numeric input (< 6 digits) as name", () => {
    expect(detectQueryType("1234")).toBe("name");
  });

  it("classifies 8-12 digit numeric input as name", () => {
    expect(detectQueryType("12345678")).toBe("name");
    expect(detectQueryType("123456789012")).toBe("name");
  });

  it("trims whitespace before classification", () => {
    expect(detectQueryType("  123456  ")).toBe("cn");
  });
});
```

- [ ] **Step 2: Write failing tests for `extractCnFromEan13()`**

Append to `src/lib/query-detection.test.ts`:

```typescript
describe("extractCnFromEan13", () => {
  it("extracts CN substring from valid EAN-13", () => {
    expect(extractCnFromEan13("8470001234567")).toBe("123456");
  });

  it("returns null for string shorter than 13 characters", () => {
    expect(extractCnFromEan13("84700012345")).toBeNull();
  });

  it("returns null for string longer than 13 characters", () => {
    expect(extractCnFromEan13("84700012345678")).toBeNull();
  });

  it("extracts exactly indices 6-12 from a 13-character string", () => {
    const input = "ABCDEFGHIJKLM";
    expect(extractCnFromEan13(input)).toBe("GHIJKL");
  });

  it("returns null for empty string", () => {
    expect(extractCnFromEan13("")).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/lib/query-detection.test.ts`
Expected: FAIL — `detectQueryType` and `extractCnFromEan13` are not defined (module not found)

---

### Task 2: Query detection — implement functions

**Files:**

- Create: `src/lib/query-detection.ts`

- [ ] **Step 1: Implement `detectQueryType()` and `extractCnFromEan13()`**

Create `src/lib/query-detection.ts`:

```typescript
export type QueryType = "cn" | "ean13" | "name";

export function detectQueryType(input: string): QueryType {
  const trimmed = input.trim();
  if (/^\d{6,7}$/.test(trimmed)) return "cn";
  if (/^\d{13}$/.test(trimmed)) return "ean13";
  return "name";
}

export function extractCnFromEan13(ean13: string): string | null {
  if (ean13.length !== 13) return null;
  return ean13.slice(6, 12);
}
```

- [ ] **Step 2: Run tests and confirm all pass**

Run: `npx vitest run src/lib/query-detection.test.ts`
Expected: ALL PASS

- [ ] **Step 3: Run full test suite to confirm no regressions**

Run: `npx vitest run`
Expected: ALL PASS, coverage does not decrease

- [ ] **Step 4: Commit**

```bash
git add src/lib/query-detection.ts src/lib/query-detection.test.ts
git commit -m "feat: add detectQueryType and extractCnFromEan13 utilities"
```

---

### Task 3: Search bar integration — write failing tests

**Files:**

- Modify: `src/components/search-bar.test.tsx`

- [ ] **Step 1: Add test for CN query routing**

Add a test that submits a 6-digit CN and verifies the fetch URL uses `cn` param:

```typescript
it("routes 6-digit numeric query to cn parameter", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        nombre: "Medicamento CN",
        pactivos: "IBUPROFENO",
        aineAnalysis: { status: "RED", matchedAines: [] },
      }),
  });

  await fill(input, "123456");
  await submit(form);

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/cima?cn=123456",
    expect.objectContaining({ headers: expect.any(Object) }),
  );
});
```

- [ ] **Step 2: Add test for EAN-13 query with CN extraction**

```typescript
it("routes 13-digit EAN-13 query to cn parameter with extracted CN", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        nombre: "Medicamento EAN",
        pactivos: "IBUPROFENO",
        aineAnalysis: { status: "RED", matchedAines: [] },
      }),
  });

  await fill(input, "8470001234567");
  await submit(form);

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/cima?cn=123456",
    expect.objectContaining({ headers: expect.any(Object) }),
  );
});
```

- [ ] **Step 3: Add test for name query routing**

```typescript
it("routes alphanumeric query to nombre parameter", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ resultados: [] }),
  });

  await fill(input, "ibuprofeno");
  await submit(form);

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/cima?nombre=ibuprofeno",
    expect.objectContaining({ headers: expect.any(Object) }),
  );
});
```

- [ ] **Step 4: Add test for CN 404 fallback to nombre**

```typescript
it("falls back to nombre search when CN query returns 404", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ aineAnalysis: { status: "YELLOW" } }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          resultados: [
            {
              nombre: "Ibuprofeno",
              pactivos: "IBUPROFENO",
              aineAnalysis: { status: "RED", matchedAines: [] },
            },
          ],
        }),
    });

  await fill(input, "654321");
  await submit(form);

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    "/api/cima?cn=654321",
    expect.any(Object),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    "/api/cima?nombre=654321",
    expect.any(Object),
  );
});
```

- [ ] **Step 5: Add test for CN lookup success (no fallback)**

```typescript
it("does not fall back when CN query succeeds", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container, getByRole } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        nombre: "Medicamento CN",
        pactivos: "IBUPROFENO",
        aineAnalysis: { status: "RED", matchedAines: [] },
      }),
  });

  await fill(input, "123456");
  await submit(form);

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith(
    "/api/cima?cn=123456",
    expect.any(Object),
  );
});
```

- [ ] **Step 6: Add test for name query empty results (no retry)**

```typescript
it("does not retry when name query returns empty results", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container, getByRole } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ resultados: [] }),
  });

  await fill(input, "xyz");
  await submit(form);

  expect(global.fetch).toHaveBeenCalledTimes(1);
  const status = getByRole("status");
  expect(status).toBeInTheDocument();
});
```

- [ ] **Step 7: Add test for CN empty result fallback to nombre**

```typescript
it("falls back to nombre when CN lookup returns no matching medication", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container, getByRole } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ resultados: [] }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ resultados: [] }),
    });

  await fill(input, "999999");
  await submit(form);

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    "/api/cima?cn=999999",
    expect.any(Object),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    "/api/cima?nombre=999999",
    expect.any(Object),
  );

  const status = getByRole("status");
  expect(status).toBeInTheDocument();
});
```

- [ ] **Step 8: Run tests to verify they fail**

Run: `npx vitest run src/components/search-bar.test.tsx`
Expected: FAIL — new tests fail because `handleSearch` doesn't route by query type yet

---

### Task 4: Search bar integration — implement

**Files:**

- Modify: `src/components/search-bar.tsx`

- [ ] **Step 1: Import and call `detectQueryType` and `extractCnFromEan13` in `handleSearch`**

Modify `src/components/search-bar.tsx` — add import at top:

```typescript
import { detectQueryType, extractCnFromEan13 } from "@/lib/query-detection";
```

Then replace the `handleSearch` function body with query-type-aware logic:

```typescript
async function handleSearch(e: React.FormEvent) {
  e.preventDefault();
  const trimmed = query.trim();
  if (!trimmed) return;

  setLoading(true);
  setError("");
  setIsEmpty(false);

  const queryType = detectQueryType(trimmed);

  try {
    let apiUrl: string;
    if (queryType === "cn") {
      apiUrl = `/api/cima?cn=${encodeURIComponent(trimmed)}`;
    } else if (queryType === "ean13") {
      const cn = extractCnFromEan13(trimmed);
      if (cn) {
        apiUrl = `/api/cima?cn=${encodeURIComponent(cn)}`;
      } else {
        apiUrl = `/api/cima?nombre=${encodeURIComponent(trimmed)}`;
      }
    } else {
      apiUrl = `/api/cima?nombre=${encodeURIComponent(trimmed)}`;
    }

    const res = await fetch(apiUrl);
    const data = await res.json();

    const isCnLookup = queryType === "cn" || queryType === "ean13";
    const needsFallback =
      isCnLookup &&
      (res.status === 404 ||
        (data.resultados && data.resultados.length === 0) ||
        (!data.resultados && !data.nombre && !data.error));

    if (needsFallback) {
      const fallbackRes = await fetch(
        `/api/cima?nombre=${encodeURIComponent(trimmed)}`,
      );
      const fallbackData = await fallbackRes.json();
      processResponse(fallbackData);
    } else {
      processResponse(data);
    }
  } catch {
    setError(t("error"));
    setResults([]);
    setIsEmpty(false);
  } finally {
    setLoading(false);
  }

  function processResponse(data: Record<string, unknown>) {
    if (data.resultados) {
      setResults(data.resultados as SearchResult[]);
      setIsEmpty(data.resultados.length === 0);
    } else if (data.error) {
      setError(data.error as string);
      setResults([]);
      setIsEmpty(false);
    } else {
      setResults([data as SearchResult]);
      setIsEmpty(false);
    }
  }
}
```

- [ ] **Step 2: Run search bar tests and confirm they pass**

Run: `npx vitest run src/components/search-bar.test.tsx`
Expected: ALL PASS

- [ ] **Step 3: Run full test suite and confirm no regressions**

Run: `npx vitest run`
Expected: ALL PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/search-bar.tsx src/components/search-bar.test.tsx
git commit -m "feat: integrate query detection and fallback in search bar"
```

---

### Task 5: Placeholder i18n update

**Files:**

- Modify: `messages/es-ES.json`
- Modify: `src/components/search-bar.test.tsx` (update test fixture)

- [ ] **Step 1: Update `messages/es-ES.json` placeholder**

In `messages/es-ES.json`, change:

```json
"placeholder": "Buscar medicamento...",
```

to:

```json
"placeholder": "Buscar medicamento por nombre, código nacional o código de barras...",
```

- [ ] **Step 2: Update the test fixture in `search-bar.test.tsx`**

In `src/components/search-bar.test.tsx`, update the `messages` object:

```typescript
placeholder: "Buscar medicamento por nombre, código nacional o código de barras...",
```

This replaces the old `"Buscar medicamento..."` placeholder.

- [ ] **Step 3: Run full test suite and confirm all pass**

Run: `npx vitest run`
Expected: ALL PASS

- [ ] **Step 4: Commit**

```bash
git add messages/es-ES.json src/components/search-bar.test.tsx
git commit -m "feat: update search placeholder to indicate CN and barcode support"
```

---

### Task 6: Push and Create PR

- [ ] **Step 1: Push feature branch to remote**

```bash
git push -u origin HEAD
```

- [ ] **Step 2: Create pull request via `gh` CLI**

```bash
gh pr create --title "feat: search by CN and EAN-13 barcode" --body "## Summary
- Add \`detectQueryType()\` and \`extractCnFromEan13()\` utilities for classifying search input as CN, EAN-13, or name
- Integrate query detection into search bar: CN/EAN-13 queries route to \`/api/cima?cn=\`, name queries route to \`/api/cima?nombre=\`
- Transparent fallback: when a CN/EAN-13 lookup returns 404 or no results, automatically retries with \`nombre=\`
- Update search placeholder to indicate barcode and CN support

## Test plan
- [x] Unit tests for \`detectQueryType()\`: CN (6-7 digits), EAN-13 (13 digits), name (other), whitespace trimming
- [x] Unit tests for \`extractCnFromEan13()\`: valid extraction, too short, too long, exact indices
- [x] Integration tests for search bar: CN routing, EAN-13 extraction + routing, name routing, 404 fallback, empty result fallback, no-retry on name searches
- [x] Placeholder text updated in i18n messages"
```
