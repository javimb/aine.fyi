## Why

Users looking up Spanish medications must manually type EAN-13 barcodes, which is error-prone and slow on mobile. Adding camera-based barcode scanning reduces input friction and improves accessibility, letting users scan a medication barcode and instantly get results through the existing search pipeline.

## What Changes

**SearchBar**

- From: Text-only search input with manual barcode entry
- To: Search input with an icon-only scan button that opens a full-screen camera overlay
- Reason: Reduce friction for barcode-based medication lookups
- Impact: Non-breaking, additive change

**Scanner Overlay**

- From: No scanning capability
- To: Full-screen camera overlay with live barcode detection, auto-close on detection, and camera permission handling
- Reason: Provide intuitive scanning UX with ample viewport for aiming
- Impact: New UI component, no breaking changes

**Search Flow**

- From: Manual query entry only
- To: Detected barcode auto-populates search input and auto-submits through existing detectQueryType → API call pipeline
- Reason: Seamless integration with zero modification to existing search logic
- Impact: Non-breaking, existing flow untouched

## Capabilities

### New Capabilities

- `barcode-scanner`: Camera-based EAN-13 barcode detection via QuaggaJS overlay, including scanner button, camera overlay, detection validation, permission handling, and i18n support

### Modified Capabilities

- `search-form`: Integrate barcode scanner button next to search input; handle detected barcode populating query and auto-submitting
- `i18n`: Add scanner-related translation keys for Spanish locale

## Impact

- **New dependency**: `@ericblade/quagga2` for in-browser barcode detection
- **New files**: `BarcodeScannerButton` component, `ScannerOverlay` component, `useBarcodeScanner` hook
- **Modified files**: SearchBar component (add scanner button + overlay state), i18n messages file (add ~6 keys)
- **No API changes**: detected barcode reuses existing search pipeline
- **No breaking changes**: scan button hidden on unsupported devices; manual input remains the fallback
