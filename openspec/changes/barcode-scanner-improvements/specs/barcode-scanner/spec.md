## ADDED Requirements

### Requirement: EAN-13 checksum validation

A pure function `validateBarcodeEAN13(code: string): boolean` SHALL be exported from `src/lib/validate-barcode.ts`. It SHALL verify the EAN-13 checksum digit: sum the digits at odd positions (1st, 3rd, 5th, ..., 11th), add three times the sum of digits at even positions (2nd, 4th, 6th, ..., 12th), then verify that the 13th digit (check digit) makes the total sum divisible by 10. The function SHALL return `false` for codes that are not exactly 13 digits, contain non-numeric characters, or fail the checksum calculation. The function SHALL be decoder-agnostic and not depend on React or any barcode library.

#### Scenario: Valid EAN-13 code passes checksum

- **WHEN** `validateBarcodeEAN13` is called with a valid EAN-13 code (e.g., "8470006543215")
- **THEN** the function SHALL return `true`

#### Scenario: Invalid checksum digit fails

- **WHEN** `validateBarcodeEAN13` is called with a 13-digit code where the check digit does not match
- **THEN** the function SHALL return `false`

#### Scenario: Code with fewer than 13 digits fails

- **WHEN** `validateBarcodeEAN13` is called with a code shorter than 13 digits
- **THEN** the function SHALL return `false`

#### Scenario: Code with non-numeric characters fails

- **WHEN** `validateBarcodeEAN13` is called with a code containing non-digit characters
- **THEN** the function SHALL return `false`

#### Scenario: Digit transposition fails checksum

- **WHEN** `validateBarcodeEAN13` is called with a code where two adjacent digits are transposed
- **THEN** the function SHALL return `false`

---

### Requirement: Multi-read confirmation

The `useBarcodeScanner` hook SHALL require the same barcode code to be detected N consecutive times before accepting it as valid. The default threshold SHALL be 3, configurable via the `confirmationThreshold` option in `UseBarcodeScannerOptions`. When a different code is detected mid-sequence, the counter SHALL reset to 1 for the new code. Confirmation state SHALL be tracked via `useRef` (not `useState`) and SHALL be reset when `startScanning` is called. The `confirmCountRef` and `confirmCodeRef` refs SHALL NOT trigger re-renders.

#### Scenario: Code confirmed after N consecutive detections

- **WHEN** QuaggaJS detects the same EAN-13 code `confirmationThreshold` consecutive times
- **THEN** `lastDetected` SHALL be set to the confirmed code
- **AND** the `onDetected` callback SHALL be called with the confirmed code
- **AND** scanning SHALL stop automatically

#### Scenario: Counter resets on different code mid-sequence

- **WHEN** QuaggaJS detects code A fewer than `confirmationThreshold` times consecutively
- **AND** then detects a different code B
- **THEN** the confirmation counter SHALL reset to 1 for code B
- **AND** scanning SHALL continue

#### Scenario: Custom confirmation threshold

- **WHEN** `useBarcodeScanner` is called with `{ confirmationThreshold: 2 }`
- **AND** QuaggaJS detects the same EAN-13 code 2 consecutive times
- **THEN** the code SHALL be accepted and confirmed

#### Scenario: Confirmation state resets on new scan session

- **WHEN** `startScanning` is called to begin a new scan session
- **THEN** the confirmation counter and last-confirmed code refs SHALL be reset to their initial values

---

## MODIFIED Requirements

### Requirement: Barcode detection and validation

The `useBarcodeScanner` hook SHALL manage QuaggaJS initialization and barcode detection. It SHALL initialize QuaggaJS with `{ decoder: { readers: ["ean_reader"] }, locate: true, frequency: 10 }` for live stream detection. When a barcode is detected, the hook SHALL apply the following validation pipeline in order: (1) validate that the code matches the pattern `/^\d{13}$/` (regex pre-filter), (2) verify the code passes EAN-13 checksum validation via `validateBarcodeEAN13`, and (3) confirm the same code appears N consecutive times (multi-read confirmation, default N=3, configurable via `confirmationThreshold`). Only after passing all three gates SHALL `lastDetected` be set, the `onDetected` callback be called, and `stopScanning` be invoked. The 2-second debounce is removed; multi-read confirmation replaces it as the accuracy filter. The `UseBarcodeScannerOptions` interface SHALL accept an optional `confirmationThreshold` number parameter (default 3).

#### Scenario: Valid EAN-13 barcode detected and confirmed

- **WHEN** QuaggaJS detects a 13-digit code that passes the EAN-13 checksum
- **AND** the same code is detected `confirmationThreshold` consecutive times
- **THEN** `lastDetected` SHALL be set to the confirmed code
- **AND** the `onDetected` callback SHALL be called with the confirmed code
- **AND** scanning SHALL stop automatically

#### Scenario: Code passes regex but fails checksum

- **WHEN** QuaggaJS detects a 13-digit code that fails EAN-13 checksum validation
- **THEN** the detection SHALL be ignored
- **AND** scanning SHALL continue

#### Scenario: Invalid barcode format ignored

- **WHEN** QuaggaJS detects a code that is NOT 13 digits long or contains non-numeric characters
- **THEN** the detection SHALL be ignored
- **AND** scanning SHALL continue