> **For agentic workers:** Follow apply's instructions and don't implement these tasks directly. Instead, use superpowers:subagent-driven-development to implement the plan.md.

## 1. EAN-13 Checksum Validation

- [x] 1.1 Write failing tests for `validateBarcodeEAN13` covering: valid code passes, invalid checksum fails, short code fails, non-numeric code fails, digit transposition fails
- [x] 1.2 Implement `validateBarcodeEAN13` in `src/lib/validate-barcode.ts` to make all tests pass
- [x] 1.3 Commit: `feat(validate): add EAN-13 checksum validation function`

## 2. Multi-Read Confirmation in Hook

- [x] 2.1 Write failing tests for multi-read confirmation: code confirmed after N consecutive detections, counter resets on different code, custom threshold, confirmation state resets on new scan session
- [x] 2.2 Add `confirmationThreshold` to `UseBarcodeScannerOptions` interface (optional, default 3)
- [x] 2.3 Add `confirmCountRef` and `confirmCodeRef` refs to the hook; reset them in `startScanning`
- [x] 2.4 Replace the `onDetected` handler logic: remove debounce (`lastDetectionTimeRef`), add checksum gate (`validateBarcodeEAN13`), add multi-read confirmation gate
- [x] 2.5 Commit: `feat(scanner): replace debounce with EAN-13 checksum and multi-read confirmation`

## 3. Update Existing Tests

- [x] 3.1 Write failing test: code passes regex but fails checksum should be ignored
- [x] 3.2 Write failing test: valid code confirmed after N detections should emit and stop
- [x] 3.3 Update the existing "debounces detections within 2 seconds" test to test multi-read confirmation instead
- [x] 3.4 Update the existing "sets lastDetected on valid 13-digit barcode" test to account for multi-read confirmation (N consecutive detections)
- [x] 3.5 Commit: `test(scanner): update tests for checksum and multi-read validation pipeline`

## 4. Verify Coverage and Lint

- [x] 4.1 Run `npm run test:coverage` and verify coverage has not decreased
- [x] 4.2 Run `npm run lint` and fix any issues
- [x] 4.3 Commit: `chore: verify coverage and lint pass`

## 5. Push and Create PR

- [x] 5.1 Push branch to remote
- [x] 5.2 Create pull request via `gh` CLI