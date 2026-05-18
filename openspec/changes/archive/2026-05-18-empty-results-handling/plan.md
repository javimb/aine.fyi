# Empty Results Handling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a neutral "not found" message with screen reader support when a medication search returns zero results.

**Architecture:** A new `EmptyResults` client component renders a neutral/muted message from i18n, announced via `role="status"` and `aria-live="polite"`. SearchBar gains an `isEmpty` boolean state set when the CIMA API returns an empty `resultados` array.

**Tech Stack:** Next.js 16 App Router, next-intl, Vitest, React Testing Library, shadcn/ui, Tailwind CSS v4

---

## Task 1: Add i18n key for empty results

**Files:**

- Modify: `messages/es-ES.json`

- [ ] **Step 1: Add `search.emptyResults` key to message catalog**

In `messages/es-ES.json`, add the `emptyResults` key inside the `search` object (after line 12, the `error` key):

```json
"error": "Error al buscar",
"emptyResults": "No se han encontrado medicamentos con ese nombre. Comprueba que está bien escrito."
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/es-ES.json','utf8')); console.log('valid')"`
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add messages/es-ES.json
git commit -m "feat(i18n): add search.emptyResults message key"
```

---

## Task 2: EmptyResults component (TDD)

**Files:**

- Create: `src/components/empty-results.tsx`
- Create: `src/components/empty-results.test.tsx`

- [ ] **Step 1: Write failing tests for EmptyResults**

Create `src/components/empty-results.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";

afterEach(cleanup);

const messages = {
  search: {
    emptyResults:
      "No se han encontrado medicamentos con ese nombre. Comprueba que está bien escrito.",
  },
};

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es-ES" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("EmptyResults", () => {
  it("renders the message from i18n key search.emptyResults", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { getByText } = renderWithProvider(<EmptyResults />);
    expect(
      getByText(/No se han encontrado medicamentos con ese nombre/),
    ).toBeInTheDocument();
  });

  it("renders with role=status for screen reader announcement", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { container } = renderWithProvider(<EmptyResults />);
    const message = container.querySelector("[role='status']");
    expect(message).toBeInTheDocument();
    expect(message?.textContent).toContain("No se han encontrado medicamentos");
  });

  it("renders with aria-live=polite", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { container } = renderWithProvider(<EmptyResults />);
    const message = container.querySelector("[aria-live='polite']");
    expect(message).toBeInTheDocument();
  });

  it("uses muted text styling without any status color class", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { container } = renderWithProvider(<EmptyResults />);
    const message = container.querySelector("[role='status']");
    expect(message?.className).toContain("text-muted-foreground");
    expect(message?.className).not.toContain("text-status-red");
    expect(message?.className).not.toContain("text-status-amber");
    expect(message?.className).not.toContain("text-status-yellow");
    expect(message?.className).not.toContain("text-status-green");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/empty-results.test.tsx`
Expected: FAIL — module `./empty-results` not found

- [ ] **Step 3: Implement EmptyResults component**

Create `src/components/empty-results.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function EmptyResults() {
  const t = useTranslations("search");

  return (
    <p role="status" aria-live="polite" className="mt-4 text-muted-foreground">
      {t("emptyResults")}
    </p>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/empty-results.test.tsx`
Expected: PASS (all 4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/empty-results.tsx src/components/empty-results.test.tsx
git commit -m "feat: add EmptyResults component with accessible empty state"
```

---

## Task 3: SearchBar empty state integration (TDD)

**Files:**

- Modify: `src/components/search-bar.tsx`
- Modify: `src/components/search-bar.test.tsx`

- [ ] **Step 1: Write failing tests for SearchBar empty state**

Add these tests to `src/components/search-bar.test.tsx`. First, add `emptyResults` to the existing `messages` object (inside `search`):

```ts
emptyResults:
  "No se han encontrado medicamentos con ese nombre. Comprueba que está bien escrito.",
```

Then add these test cases inside the existing `describe("SearchBar", ...)` block:

```ts
it("renders EmptyResults when API returns empty resultados array", async () => {
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

  const status = getByRole("status");
  expect(status).toBeInTheDocument();
  expect(status.textContent).toContain("No se han encontrado medicamentos");
});

it("does not render EmptyResults when results are found", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container, queryByRole } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi.fn().mockResolvedValueOnce({
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

  await fill(input, "ibuprofeno");
  await submit(form);

  expect(queryByRole("status")).not.toBeInTheDocument();
});

it("does not render EmptyResults when error occurs", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container, queryByRole, getByRole } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({ error: "Error al consultar la API de CIMA" }),
  });

  await fill(input, "xyz");
  await submit(form);

  expect(queryByRole("status")).not.toBeInTheDocument();
  expect(getByRole("alert")).toBeInTheDocument();
});

it("hides EmptyResults during loading", async () => {
  const { default: SearchBar } = await import("./search-bar");
  const { container, queryByRole } = renderWithProvider(<SearchBar />);
  const input = container.querySelector('input[type="text"]')!;
  const form = container.querySelector("form")!;

  let resolvePromise: (value: unknown) => void;
  const pendingPromise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  global.fetch = vi.fn().mockReturnValue(pendingPromise);

  await fill(input, "xyz");
  await submit(form);

  expect(queryByRole("status")).not.toBeInTheDocument();

  resolvePromise!({
    ok: true,
    json: () => Promise.resolve({ resultados: [] }),
  });

  await waitFor(() => {
    expect(queryByRole("status")).toBeInTheDocument();
  });
});
```

You also need to add these helper imports at the top (alongside existing imports):

```ts
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
```

And add these helper functions after `renderWithProvider`:

```ts
async function fill(input: Element, value: string) {
  const user = userEvent.setup();
  await user.click(input);
  await user.keyboard(value);
}

async function submit(form: Element) {
  const user = userEvent.setup();
  await userEvent.click(form.querySelector('button[type="submit"]')!);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/search-bar.test.tsx`
Expected: FAIL — EmptyResults not rendered, `getByRole("status")` throws

- [ ] **Step 3: Add `isEmpty` state and EmptyResults rendering to SearchBar**

Modify `src/components/search-bar.tsx`:

Add import at the top (after line 7):

```tsx
import EmptyResults from "@/components/empty-results";
```

Add `isEmpty` state inside the component (after line 27, the `error` state):

```tsx
const [isEmpty, setIsEmpty] = useState(false);
```

In `handleSearch`, reset `isEmpty` at the start (after `setError("")` on line 40):

```tsx
setIsEmpty(false);
```

In the fetch handler, after `setResults(data.resultados)` on line 46, add:

```tsx
setIsEmpty(data.resultados.length === 0);
```

In the `else if (data.error)` branch (line 47-49), after `setResults([])`:

```tsx
setIsEmpty(false);
```

In the `else` branch (line 50-51), after `setResults([data])`:

```tsx
setIsEmpty(false);
```

In the catch block (lines 53-55), after `setResults([])`:

```tsx
setIsEmpty(false);
```

In the JSX, add EmptyResults rendering after the error block and before the results block (between lines 90 and 92):

```tsx
{
  isEmpty && !error && <EmptyResults />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/search-bar.test.tsx`
Expected: PASS (all tests including new empty state tests)

- [ ] **Step 5: Run full test suite to verify no regressions**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/components/search-bar.tsx src/components/search-bar.test.tsx
git commit -m "feat(search): integrate EmptyResults into SearchBar with isEmpty state"
```

---

## Task 4: Push and Create PR

- [ ] **Step 1: Push branch to remote**

```bash
git push -u origin empty-results-handling
```

- [ ] **Step 2: Create pull request via gh CLI**

```bash
gh pr create --title "feat: add empty results handling for search" --body "$(cat <<'EOF'
## Summary
- Adds `EmptyResults` component with neutral/muted styling and screen reader support (`role="status"`, `aria-live="polite"`)
- Adds `isEmpty` state to SearchBar to detect when CIMA API returns zero results
- Adds `search.emptyResults` i18n key to message catalog

## Test plan
- [x] EmptyResults renders with neutral styling, no status colors
- [x] EmptyResults announced to screen readers via role=status + aria-live=polite
- [x] SearchBar shows EmptyResults when resultados is empty array
- [x] SearchBar suppresses EmptyResults when error is present
- [x] SearchBar hides EmptyResults during loading
- [x] Full test suite passes
EOF
)"
```
