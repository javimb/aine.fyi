> **For agentic workers:** Follow apply's instructions and don't implement these tasks directly. Instead, use superpowers:subagent-driven-development to implement the plan.md.

## 1. Add scanner i18n keys

- [x] 1.1 Write failing test: verify `search` namespace contains `scanButtonLabel`, `scannerTitle`, `scannerStatus`, `scannerDetected`, `scannerPermissionDenied`, and `closeScannerLabel` keys in `messages/es-ES.json`
- [x] 1.2 Add the six scanner i18n keys to `messages/es-ES.json` under the `search` namespace and make the test pass
- [x] 1.3 Commit: `feat(i18n): add barcode scanner translation keys`

## 2. Create useBarcodeScanner hook

- [x] 2.1 Write failing test: hook returns `isSupported` as `false` when `navigator.mediaDevices.getUserMedia` is unavailable
- [x] 2.2 Write failing test: `startScanning` initializes QuaggaJS with `ean_reader`, `locate: true`, `frequency: 10` and returns `isScanning: true`
- [x] 2.3 Write failing test: detection of a valid 13-digit code sets `lastDetected` and calls `stopScanning`
- [x] 2.4 Write failing test: detection of a non-13-digit code is ignored
- [x] 2.5 Write failing test: 2-second debounce prevents duplicate detections
- [x] 2.6 Write failing test: camera permission denial sets error state
- [x] 2.7 Write failing test: `stopScanning` tears down QuaggaJS and releases camera tracks
- [x] 2.8 Write failing test: cleanup on unmount stops camera tracks
- [x] 2.9 Implement `useBarcodeScanner` hook in `src/hooks/use-barcode-scanner.ts` to pass all tests
- [x] 2.10 Commit: `feat(hook): add useBarcodeScanner hook with QuaggaJS integration`

## 3. Create BarcodeScannerButton component

- [x] 3.1 Write failing test: button renders with `ScanBarcode` icon and `aria-label` from i18n key `search.scanButtonLabel` when camera is supported
- [x] 3.2 Write failing test: button does not render when `navigator.mediaDevices.getUserMedia` is unavailable
- [x] 3.3 Write failing test: button calls `onOpenScanner` when clicked
- [x] 3.4 Implement `BarcodeScannerButton` component in `src/components/barcode-scanner-button.tsx`
- [x] 3.5 Commit: `feat(ui): add BarcodeScannerButton component`

## 4. Create ScannerOverlay component

- [x] 4.1 Write failing test: overlay renders as `role="dialog"` with `aria-label` when open
- [x] 4.2 Write failing test: close button has `aria-label` from i18n key `search.closeScannerLabel` and calls `onClose`
- [x] 4.3 Write failing test: Escape key calls `onClose`
- [x] 4.4 Write failing test: focus is trapped within the overlay
- [x] 4.5 Write failing test: guidance text uses i18n key `search.scannerTitle`
- [x] 4.6 Write failing test: status indicator uses i18n key `search.scannerStatus`
- [x] 4.7 Write failing test: permission-denied state displays message from i18n key `search.scannerPermissionDenied` with retry and dismiss buttons
- [x] 4.8 Write failing test: `aria-live="polite"` region announces detection using i18n key `search.scannerDetected`
- [x] 4.9 Write failing test: green flash feedback appears on successful detection
- [x] 4.10 Implement `ScannerOverlay` component in `src/components/scanner-overlay.tsx`
- [x] 4.11 Commit: `feat(ui): add ScannerOverlay component`

## 5. Integrate scanner into SearchBar

- [x] 5.1 Write failing test: SearchBar renders BarcodeScannerButton next to the input on supported devices
- [x] 5.2 Write failing test: tapping the scan button opens the ScannerOverlay
- [x] 5.3 Write failing test: detected barcode populates the search input and auto-submits via `handleSearch`
- [x] 5.4 Write failing test: overlay closing resets `isScannerOpen` state
- [x] 5.5 Write failing test: SearchBar hides scan button on unsupported devices and functions identically to text-only
- [x] 5.6 Integrate BarcodeScannerButton and ScannerOverlay into SearchBar component with `isScannerOpen` state and `lastDetected` handling
- [x] 5.7 Commit: `feat(search): integrate barcode scanner into SearchBar`

## 6. Install QuaggaJS dependency

- [x] 6.1 Install `@ericblade/quagga2` as a dependency
- [x] 6.2 Commit: `chore(deps): add @ericblade/quagga2 for barcode scanning`

## 7. Push and Create PR

- [ ] 7.1 Push branch to remote
- [ ] 7.2 Create pull request via `gh` CLI
