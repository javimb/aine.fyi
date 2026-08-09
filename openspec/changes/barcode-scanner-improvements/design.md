## Context

The barcode scanner in aine.fyi uses QuaggaJS (`@ericblade/quagga2`) to scan EAN-13 medication barcodes via `useBarcodeScanner` hook, `BarcodeScannerButton`, and `ScannerOverlay` components. The current detection handler in `useBarcodeScanner` accepts the *first* 13-digit code from QuaggaJS and immediately emits it. This causes occasional false positives — the decoder returns a valid-looking but incorrect EAN-13 (e.g., a nearby product's barcode).

The fix is a validation pipeline inside the detection handler: EAN-13 checksum verification → multi-read confirmation → emit. This keeps QuaggaJS as the decoder but makes the validation logic library-agnostic so a future decoder swap is straightforward.

**Current flow:**
```
QuaggaJS onDetected → regex filter (/^\d{13}$/) → debounce (2s) → setLastDetected + onDetected callback + stopScanning
```

**New flow:**
```
QuaggaJS onDetected → regex filter (/^\d{13}$/) → EAN-13 checksum gate → multi-read confirmation (N consecutive) → setLastDetected + onDetected callback + stopScanning
```

**Stakeholders:** Users scanning medication barcodes in the SearchBar component. The `SearchBar` is the sole consumer of `useBarcodeScanner`.

**Files involved:**
- `src/hooks/use-barcode-scanner.ts` — main hook, detection pipeline changes here
- `src/hooks/use-barcode-scanner.test.ts` — tests need new cases for checksum and multi-read
- `src/lib/validate-barcode.ts` — new pure utility function
- `src/lib/validate-barcode.test.ts` — tests for the utility

## Goals / Non-Goals

**Goals:**
- Eliminate false positives where QuaggaJS returns a valid-looking but incorrect EAN-13 code
- Add EAN-13 checksum verification as a gate before accepting any detection
- Require N consecutive identical reads before confirming a code (multi-read confirmation)
- Make the validation pipeline decoder-agnostic so future library swaps are clean
- Maintain or increase test coverage

**Non-Goals:**
- Replacing QuaggaJS with a different barcode library (future work)
- Adding support for barcode formats beyond EAN-13
- Changing the scanner UI/UX or overlay behavior
- Modifying the CIMA API integration or search flow
- Adding torch control, camera selection, or other hardware features

## Decisions

### 1. EAN-13 checksum validation as a standalone pure function

**Decision:** Extract `validateBarcodeEAN13(code: string): boolean` into `src/lib/validate-barcode.ts`.

**Rationale:** Pure functions are trivially testable, reusable, and decoupled from React and QuaggaJS. The checksum algorithm is: sum odd-position digits + (sum even-position digits × 3), check that the 13th digit makes the total divisible by 10. This catches digit transpositions and single-digit errors — the most common QuaggaJS misreads.

**Alternative considered:** Inline the check in the hook's onDetected handler. Rejected because it mixes concerns and is harder to unit-test in isolation.

### 2. Multi-read confirmation with configurable threshold

**Decision:** Require the same code N consecutive times before accepting it. Default N=3, configurable via `confirmationThreshold` in `UseBarcodeScannerOptions`.

**Rationale:** At QuaggaJS's frequency of 10fps, 3 consecutive reads takes ~0.3s — negligible UX impact. If all 3 reads produce the same code, the probability of a false positive drops dramatically (roughly cubed). Resetting the counter on mismatch means a stray wrong code doesn't poison the sequence.

**Alternative considered:** Weighted voting (majority of N reads, not necessarily consecutive). Rejected because consecutive-match is faster to confirm and simpler to implement. If 2 of 3 reads match but the 3rd differs, the user is still moving the camera and the next 3-read window will likely converge.

### 3. Remove 2-second debounce, replace with multi-read

**Decision:** Remove `lastDetectionTimeRef` and its 2-second cooldown. Multi-read confirmation serves the same purpose (rejecting spurious detections) more precisely.

**Rationale:** The debounce is a blunt instrument — it blocks *all* detections for 2 seconds, even valid re-scans. Multi-read confirmation rejects bad codes while allowing immediate re-detection after a confirmed scan (the hook stops scanning on confirmation anyway). Multi-read also catches misreads that the debounce wouldn't (a misread每隔 2+ seconds still gets through debounce but won't survive 3 consecutive matches).

### 4. Keep existing `/^\d{13}$/` regex as a pre-filter

**Decision:** The regex stays as the first gate in the pipeline, before checksum and multi-read.

**Rationale:** It's a cheap filter that rejects obviously malformed codes (null, non-numeric, wrong length) before the more expensive checks run. No reason to remove it.

### 5. Pipeline state tracked via refs, not state

**Decision:** Use `useRef` for the multi-read confirmation counter and last-confirmed code, not `useState`. The `startScanning` function resets these refs when a new scan session begins.

**Rationale:** Confirmation state is internal to the detection pipeline and doesn't need to trigger re-renders. Only `lastDetected`, `isScanning`, and `error` are exposed as state.

## Risks / Trade-offs

**[Detection latency]** N=3 reads adds ~0.3s at 10fps → **Acceptable.** Users already hold the camera steady for a moment. The trade-off for fewer false positives is worth it.

**[QuaggaJS decode quality unchanged]** The underlying decoder still produces occasional misreads; we're just filtering them out → **Accepted.** A future change can swap the decoder library; the validation pipeline will work with any decoder.

**[Multi-read may reject valid but rarely-detected codes]** If a barcode is very hard to read, QuaggaJS might produce different codes each frame and never achieve N consecutive matches → **Mitigation:** The confirmation threshold is configurable. If users report difficulty scanning certain barcodes, N can be lowered to 2. The default of 3 is conservative for most real-world EAN-13 medication barcodes.

**[Breaking change to hook options]** Adding `confirmationThreshold` is an additive change, not breaking. Removing the debounce behavior changes the hook's timing characteristics but not its interface → **Low risk.** Only `SearchBar` consumes the hook, and it delegates result handling to `onDetected`.