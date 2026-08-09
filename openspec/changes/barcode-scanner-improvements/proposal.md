## Why

The barcode scanner occasionally accepts false positives — QuaggaJS returns a valid-looking but incorrect EAN-13 code (e.g., a nearby product's barcode). Adding EAN-13 checksum verification and multi-read confirmation will eliminate these false positives by requiring the code to pass checksum validation and appear N consecutive times before being accepted.

## What Changes

**Barcode detection validation pipeline**
- From: Accept the first 13-digit detection with a 2-second debounce to prevent duplicates
- To: Require detections to pass EAN-13 checksum validation AND appear N consecutive times (default 3) before accepting
- Reason: The debounce is a blunt filter that rejects all detections for 2 seconds regardless of validity, while still letting through misreads spaced 2+ seconds apart. Multi-read confirmation rejects false positives precisely and only adds ~0.3s latency.

**Hook options interface**
- From: `UseBarcodeScannerOptions { onDetected?: (code: string) => void }`
- To: `UseBarcodeScannerOptions { onDetected?: (code: string) => void; confirmationThreshold?: number }`
- Reason: Callers need to tune the confirmation threshold for different use cases. Default of 3 is conservative; lowering to 2 trades some accuracy for speed.
- Impact: Non-breaking (optional parameter with default)

**2-second debounce removed**
- From: Detections within 2 seconds of a previous detection are silently dropped
- To: No time-based debounce; accuracy is enforced by multi-read confirmation instead
- Reason: Multi-read is a more targeted accuracy filter. The debounce blocks valid re-scans and doesn't catch misreads spaced 2+ seconds apart.

## Capabilities

### New Capabilities

_None_

### Modified Capabilities

- `barcode-scanner`: Requirement "Barcode detection and validation" is changing behavior from single-shot detection with debounce to multi-read confirmation with checksum validation. The validation pipeline (checksum + multi-read) is part of the scanner hook, not a separate capability.

## Impact

**Files modified:**
- `src/hooks/use-barcode-scanner.ts` — replace debounce with multi-read confirmation pipeline, add `confirmationThreshold` option
- `src/hooks/use-barcode-scanner.test.ts` — add tests for checksum gate, multi-read confirmation, and remove/rewrite debounce tests

**Files added:**
- `src/lib/validate-barcode.ts` — pure `validateBarcodeEAN13()` function
- `src/lib/validate-barcode.test.ts` — unit tests for checksum validation

**No API or dependency changes.** The hook's return type (`UseBarcodeScannerReturn`) is unchanged. Consumers see the same interface; only the detection accuracy behavior changes.