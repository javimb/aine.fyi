# Barcode Scanner Improvements Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Eliminate barcode scanner false positives by adding EAN-13 checksum validation and multi-read confirmation to replace the current debounce mechanism.

**Architecture:** A pure `validateBarcodeEAN13` function in `src/lib/validate-barcode.ts` serves as a standalone checksum gate. The `useBarcodeScanner` hook replaces its 2-second debounce with a multi-read confirmation pipeline: regex filter → checksum gate → N-consecutive-match gate. Confirmation state lives in refs (no re-renders) and resets on each `startScanning` call.

**Tech Stack:** React 19 (hooks/refs), Vitest, Testing Library React, TypeScript 5, QuaggaJS (`@ericblade/quagga2`).

---

## Task 1: EAN-13 Checksum Validation

**Files:**
- Create: `src/lib/validate-barcode.ts`
- Create: `src/lib/validate-barcode.test.ts`

- [ ] **Step 1: Write failing tests for `validateBarcodeEAN13`**

Create `src/lib/validate-barcode.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateBarcodeEAN13 } from "./validate-barcode";

describe("validateBarcodeEAN13", () => {
  it("returns true for a valid EAN-13 code", () => {
    expect(validateBarcodeEAN13("8470006543214")).toBe(true);
  });

  it("returns true for another valid EAN-13 code", () => {
    expect(validateBarcodeEAN13("5901234123457")).toBe(true);
  });

  it("returns false when the check digit does not match", () => {
    expect(validateBarcodeEAN13("8470006543219")).toBe(false);
  });

  it("returns false for a code shorter than 13 digits", () => {
    expect(validateBarcodeEAN13("12345")).toBe(false);
  });

  it("returns false for a code with non-numeric characters", () => {
    expect(validateBarcodeEAN13("123456789012A")).toBe(false);
  });

  it("returns false when two adjacent digits are transposed", () => {
    expect(validateBarcodeEAN13("8470006453214")).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/validate-barcode.test.ts`
Expected: FAIL — `validateBarcodeEAN13` is not exported.

- [ ] **Step 3: Implement `validateBarcodeEAN13`**

Create `src/lib/validate-barcode.ts`:

```ts
export function validateBarcodeEAN13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;

  const digits = code.split("").map(Number);

  const sumOdd = digits
    .filter((_, i) => i % 2 === 0)
    .slice(0, 6)
    .reduce((acc, d) => acc + d, 0);

  const sumEven = digits
    .filter((_, i) => i % 2 === 1)
    .reduce((acc, d) => acc + d, 0);

  return (sumOdd + sumEven * 3 + digits[12]) % 10 === 0;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/validate-barcode.test.ts`
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/validate-barcode.ts src/lib/validate-barcode.test.ts
git commit -m "feat(validate): add EAN-13 checksum validation function"
```

---

## Task 2: Multi-Read Confirmation in Hook

**Files:**
- Modify: `src/hooks/use-barcode-scanner.ts`
- Modify: `src/hooks/use-barcode-scanner.test.ts`

- [ ] **Step 1: Write failing tests for multi-read confirmation**

Add these tests to `src/hooks/use-barcode-scanner.test.ts` inside the existing `describe("useBarcodeScanner", ...)` block, **after** the existing tests:

```ts
it("requires N consecutive identical detections before confirming", async () => {
  mockGetUserMedia("resolve");

  const { result } = await setupQuaggaMock();

  await act(async () => {
    await result.current.startScanning();
  });

  const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBeNull();

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBeNull();

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBe("8470006543214");
  expect(result.current.isScanning).toBe(false);
});

it("resets confirmation counter when a different code is detected mid-sequence", async () => {
  mockGetUserMedia("resolve");

  const { result } = await setupQuaggaMock();

  await act(async () => {
    await result.current.startScanning();
  });

  const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });

  await act(async () => {
    onDetectedCb({ codeResult: { code: "5901234123457" } });
  });
  expect(result.current.lastDetected).toBeNull();

  await act(async () => {
    onDetectedCb({ codeResult: { code: "5901234123457" } });
  });
  expect(result.current.lastDetected).toBeNull();

  await act(async () => {
    onDetectedCb({ codeResult: { code: "5901234123457" } });
  });
  expect(result.current.lastDetected).toBe("5901234123457");
});

it("supports a custom confirmation threshold", async () => {
  mockGetUserMedia("resolve");

  vi.doMock("@ericblade/quagga2", () => ({
    default: mockQuagga,
  }));

  mockQuagga.init.mockImplementation(
    (_config: unknown, callback: (err?: unknown) => void) => {
      callback();
    },
  );

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() =>
    useBarcodeScanner(undefined, { confirmationThreshold: 2 }),
  );

  await act(async () => {
    await result.current.startScanning();
  });

  const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBeNull();

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBe("8470006543214");
});

it("resets confirmation state on new scan session", async () => {
  mockGetUserMedia("resolve");

  const { result } = await setupQuaggaMock();

  await act(async () => {
    await result.current.startScanning();
  });

  const firstCb = mockQuagga.onDetected.mock.calls[0][0];

  await act(async () => {
    firstCb({ codeResult: { code: "8470006543214" } });
  });

  await act(async () => {
    result.current.stopScanning();
  });

  await act(async () => {
    await result.current.startScanning();
  });

  const secondCb = mockQuagga.onDetected.mock.calls[
    mockQuagga.onDetected.mock.calls.length - 1
  ][0];

  await act(async () => {
    secondCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBeNull();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/use-barcode-scanner.test.ts`
Expected: New tests FAIL — no multi-read confirmation logic exists yet.

- [ ] **Step 3: Add `confirmationThreshold` to `UseBarcodeScannerOptions`**

In `src/hooks/use-barcode-scanner.ts`, update the interface:

```ts
interface UseBarcodeScannerOptions {
  onDetected?: (code: string) => void;
  confirmationThreshold?: number;
}
```

- [ ] **Step 4: Add `confirmCountRef` and `confirmCodeRef` refs, reset in `startScanning`**

In `src/hooks/use-barcode-scanner.ts`, add the new refs after `lastDetectionTimeRef` (which will be removed in a later step, but for now just add the new refs):

```ts
const confirmCountRef = useRef(0);
const confirmCodeRef = useRef<string | null>(null);
```

Inside `startScanning`, after setting `setIsScanning(true)`, add the reset:

```ts
confirmCountRef.current = 0;
confirmCodeRef.current = null;
```

Place this reset right after the `Quagga.start()` / `setIsScanning(true)` line, before `Quagga.onDetected(...)`.

- [ ] **Step 5: Replace the `onDetected` handler logic — remove debounce, add checksum and multi-read gates**

Replace the entire `Quagga.onDetected(...)` callback body. Change from:

```ts
Quagga.onDetected((result: { codeResult: { code: string | null } }) => {
  const code = result.codeResult.code;
  if (!code || !/^\d{13}$/.test(code)) return;

  const now = Date.now();
  if (
    lastDetectionTimeRef.current > 0 &&
    now - lastDetectionTimeRef.current < 2000
  )
    return;
  lastDetectionTimeRef.current = now;

  setLastDetected(code);
  onDetectedRef.current?.(code);
  stopScanning();
});
```

To:

```ts
Quagga.onDetected((result: { codeResult: { code: string | null } }) => {
  const code = result.codeResult.code;
  if (!code || !/^\d{13}$/.test(code)) return;
  if (!validateBarcodeEAN13(code)) return;

  if (confirmCodeRef.current === code) {
    confirmCountRef.current += 1;
  } else {
    confirmCodeRef.current = code;
    confirmCountRef.current = 1;
  }

  const threshold = options?.confirmationThreshold ?? 3;
  if (confirmCountRef.current < threshold) return;

  setLastDetected(code);
  onDetectedRef.current?.(code);
  stopScanning();
});
```

Also, add the import at the top of the file:

```ts
import { validateBarcodeEAN13 } from "@/lib/validate-barcode";
```

- [ ] **Step 6: Remove `lastDetectionTimeRef` since debounce is no longer needed**

Remove the declaration:

```ts
const lastDetectionTimeRef = useRef(0);
```

- [ ] **Step 7: Run tests to verify new tests pass but existing ones may need updating**

Run: `npx vitest run src/hooks/use-barcode-scanner.test.ts`
Expected: New multi-read tests PASS. Existing test `sets lastDetected on valid 13-digit barcode and stops scanning` may need updating (see Task 3).

- [ ] **Step 8: Commit**

```bash
git add src/hooks/use-barcode-scanner.ts src/hooks/use-barcode-scanner.test.ts
git commit -m "feat(scanner): replace debounce with EAN-13 checksum and multi-read confirmation"
```

---

## Task 3: Update Existing Tests

**Files:**
- Modify: `src/hooks/use-barcode-scanner.test.ts`

- [ ] **Step 1: Write failing test — code passes regex but fails checksum should be ignored**

Add this test inside the existing `describe` block:

```ts
it("ignores a 13-digit code that fails EAN-13 checksum validation", async () => {
  mockGetUserMedia("resolve");

  const { result } = await setupQuaggaMock();

  await act(async () => {
    await result.current.startScanning();
  });

  const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543219" } });
  });
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543219" } });
  });
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543219" } });
  });

  expect(result.current.lastDetected).toBeNull();
  expect(result.current.isScanning).toBe(true);
});
```

Run: `npx vitest run src/hooks/use-barcode-scanner.test.ts`
Expected: PASS (checksum gate already implemented in Task 2), but verify it fails before Task 2 for TDD order. If running after Task 2, this test passes immediately.

- [ ] **Step 2: Write failing test — valid code confirmed after N detections should emit and stop**

This test was already written in Task 2 (`requires N consecutive identical detections before confirming`). Verify it still passes.

Run: `npx vitest run src/hooks/use-barcode-scanner.test.ts -t "requires N consecutive"`
Expected: PASS.

- [ ] **Step 3: Update "sets lastDetected on valid 13-digit barcode and stops scanning" test**

The existing test at line 117 (`it("sets lastDetected on valid 13-digit barcode and stops scanning"`) sends a single detection and expects immediate confirmation. With multi-read confirmation (default threshold 3), it now needs 3 consecutive detections.

Replace the test body (lines 117–133) with:

```ts
it("sets lastDetected on valid 13-digit barcode and stops scanning", async () => {
  mockGetUserMedia("resolve");

  const { result } = await setupQuaggaMock();

  await act(async () => {
    await result.current.startScanning();
  });

  const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });

  expect(result.current.lastDetected).toBe("8470006543214");
  expect(result.current.isScanning).toBe(false);
});
```

Note: The barcode value changed from `"8470006543215"` (invalid checksum) to `"8470006543214"` (valid checksum), and 3 consecutive detections are required.

- [ ] **Step 4: Update "debounces detections within 2 seconds" test — replace with multi-read confirmation test**

Replace the existing "debounces detections within 2 seconds" test (lines 152–190) with a test that verifies multi-read confirmation prevents premature acceptance:

```ts
it("does not confirm a code until N consecutive identical detections", async () => {
  mockGetUserMedia("resolve");

  const { result } = await setupQuaggaMock();

  await act(async () => {
    await result.current.startScanning();
  });

  const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBeNull();

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBeNull();

  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  expect(result.current.lastDetected).toBe("8470006543214");
  expect(result.current.isScanning).toBe(false);
});
```

This replaces the debounce-based test with a multi-read confirmation test. Remove the `vi.spyOn(Date, "now")` mock and `currentTime` manipulation since debounce is no longer used.

- [ ] **Step 5: Update "calls onDetected callback when a barcode is detected" test**

The existing test (line 242) sends a single detection and expects immediate callback. Update it to require 3 consecutive detections with a valid EAN-13 code:

```ts
it("calls onDetected callback when a barcode is detected", async () => {
  mockGetUserMedia("resolve");

  const onDetected = vi.fn();

  vi.doMock("@ericblade/quagga2", () => ({
    default: mockQuagga,
  }));

  mockQuagga.init.mockImplementation(
    (_config: unknown, callback: (err?: unknown) => void) => {
      callback();
    },
  );

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() =>
    useBarcodeScanner(undefined, { onDetected }),
  );

  await act(async () => {
    await result.current.startScanning();
  });

  const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });
  await act(async () => {
    onDetectedCb({ codeResult: { code: "8470006543214" } });
  });

  expect(onDetected).toHaveBeenCalledWith("8470006543214");
  expect(result.current.lastDetected).toBe("8470006543214");
});
```

- [ ] **Step 6: Update "ignores detection of non-13-digit codes" test**

The existing test (line 135) sends a 5-digit code and expects `lastDetected` to remain null. This still works with multi-read confirmation, but verify the code used for the valid detection is a valid EAN-13. No changes needed — the test still correctly tests that "12345" (non-13-digit) is ignored.

- [ ] **Step 7: Run all tests to verify they pass**

Run: `npx vitest run src/hooks/use-barcode-scanner.test.ts`
Expected: All tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/use-barcode-scanner.test.ts
git commit -m "test(scanner): update tests for checksum and multi-read validation pipeline"
```

---

## Task 4: Verify Coverage and Lint

- [ ] **Step 1: Run full test suite with coverage**

Run: `npm run test:coverage`
Expected: All tests pass. Coverage for `validate-barcode.ts` should be 100%. Coverage for `use-barcode-scanner.ts` should not decrease. Lines and branches thresholds (80%) must be met.

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No errors. If there are errors, fix them before committing.

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 4: Commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: verify coverage and lint pass"
```

(Only if fixes were needed; skip if everything passed clean.)

---

## Task 5: Push and Create PR

- [ ] **Step 1: Push branch to remote**

```bash
git push -u origin javi.imbernon/barcode-scanner-improvements
```

- [ ] **Step 2: Create pull request via `gh` CLI**

```bash
gh pr create --title "feat: add EAN-13 checksum validation and multi-read confirmation to barcode scanner" --body "## Summary

Replaces the 2-second debounce in \`useBarcodeScanner\` with a validation pipeline:

1. Regex pre-filter (existing)
2. EAN-13 checksum validation (new, \`validateBarcodeEAN13\`)
3. Multi-read confirmation — N consecutive identical detections required (new, default N=3)

This eliminates false positives from QuaggaJS misreads while maintaining fast scan times (~0.3s at 10fps).

## Changes

- **New:** \`src/lib/validate-barcode.ts\` — pure EAN-13 checksum function
- **New:** \`src/lib/validate-barcode.test.ts\` — comprehensive tests for checksum validation
- **Modified:** \`src/hooks/use-barcode-scanner.ts\` — replaced debounce with checksum + multi-read gates
- **Modified:** \`src/hooks/use-barcode-scanner.test.ts\` — updated tests for new validation pipeline

## Test plan

- [x] Unit tests pass (\`npm run test:coverage\`)
- [x] Lint clean (\`npm run lint\`)
- [x] Typecheck clean (\`npx tsc --noEmit\`)
- [x] Coverage thresholds met (80% lines/branches)"
```