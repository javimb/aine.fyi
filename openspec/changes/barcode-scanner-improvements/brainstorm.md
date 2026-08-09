## Design Summary

Improve barcode scanner reliability by eliminating false positives. The current `useBarcodeScanner` hook accepts the first 13-digit detection from QuaggaJS, which occasionally returns a valid-looking but incorrect EAN-13 code (e.g., a nearby product's barcode). The fix adds a validation pipeline: EAN-13 checksum verification + multi-read confirmation — decoupled from the decoder so it works regardless of which barcode library is used.

## Alternatives Considered

### Option A: Keep QuaggaJS, add EAN-13 checksum + multi-read validation
- **Approach**: Add checksum verification and require the same code N consecutive times before accepting. Minimal change to existing hook internals.
- **Pros**: Minimal disruption; existing tests largely unchanged; checksum is simple and well-understood; multi-read dramatically reduces false positives.
- **Cons**: QuaggaJS is unmaintained; underlying decoder quality stays the same; multi-read adds detection latency; doesn't address other QuaggaJS limitations.
- **Why not chosen**: Viable short-term fix but doesn't position the app for future improvements or address root cause.

### Option B: Replace QuaggaJS with a more reliable library
- **Approach**: Swap `@ericblade/quagga2` for a modern library like `html5-qrcode` (wrapping ZXing). Rewrite hook internals while keeping the same interface.
- **Pros**: ZXing is battle-tested and actively maintained; generally more accurate for EAN-13; future format support (QR, etc.) is easier.
- **Cons**: More change surface area; larger bundle size; different API means rewriting tests; may require UI adjustments.
- **Why not chosen**: More effort than needed for the immediate false-positive problem; higher regression risk.

### Option C: Add validation layer now, evaluate library replacement later
- **Approach**: Immediately add EAN-13 checksum verification + multi-read confirmation to the existing QuaggaJS hook. Validation logic is extracted into a pure, testable function that's library-agnostic. The hook's detection pipeline is refactored so the decoder is pluggable, making a future library swap straightforward.
- **Pros**: Fixes the immediate problem quickly; validation is decoupled from decoder so it works with any library; minimal disruption; sets up architecture for clean library replacement later.
- **Cons**: Multi-read adds ~0.3-1s detection delay; doesn't immediately improve QuaggaJS decode quality; slightly more complex hook internals.
- **Chosen**: Best balance of solving the reported problem with minimal risk while structuring for future improvements.

## Agreed Approach

Option C — add validation layer now with pluggable decoder for future replacement.

The detection pipeline changes from single-shot to a gated flow:

```
QuaggaJS raw detection → EAN-13 checksum gate → multi-read confirmation → emit confirmed code
```

Key decisions:

1. **EAN-13 checksum validation** — pure utility `validateBarcodeEAN13(code: string): boolean` in `src/lib/validate-barcode.ts`, fully unit-tested
2. **Multi-read confirmation** — require same code N consecutive times (default N=3), configurable via `confirmationThreshold` option
3. **Reset on mismatch** — if a different code is detected mid-sequence, counter resets to 1 for the new code
4. **2-second debounce removed** — replaced by multi-read mechanism, which is a more targeted accuracy filter
5. **Decoder-agnostic pipeline** — the hook's detection handler uses the pipeline regardless of which decoder library provides raw detections

## Key Decisions

- Multi-read threshold defaults to 3 (balances reliability vs. speed at ~0.3s additional delay)
- `confirmationThreshold` exposed in `UseBarcodeScannerOptions` for caller tuning
- EAN-13 checksum validation extracted to standalone pure function for testability and reuse
- Existing `/^\d{13}$/` regex stays as a quick pre-filter before checksum and multi-read gates
- Debounce mechanism (2s cooldown) removed in favor of multi-read confirmation

## Open Questions

- None remaining — all design decisions were agreed upon during brainstorming.