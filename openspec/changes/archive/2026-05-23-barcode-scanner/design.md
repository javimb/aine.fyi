## Component Architecture

### New Components

**BarcodeScannerButton** — Icon-only button (no visible text label) with a barcode icon, rendered next to the search input. Uses `lucide-react` `ScanBarcode` icon (or `Barcode` if unavailable). Triggers camera permission request and opens the scanner overlay. Has `aria-label` from i18n key `search.scanButtonLabel`.

**ScannerOverlay** — Full-screen fixed overlay with:

- Dark semi-transparent backdrop
- Live camera feed from QuaggaJS
- Viewfinder frame (dashed border highlighting the scan zone)
- Guidance text ("Apunta al código de barras") from i18n key `search.scannerTitle`
- Close button (top-right X) with `aria-label` from `search.closeScannerLabel`
- Status indicator ("Escaneando...") from i18n key `search.scannerStatus`
- Permission denied state with message and retry/dismiss buttons
- `role="dialog"` and `aria-label` for accessibility
- Focus trapping and Escape key to close
- `aria-live="polite"` region announcing detection via `search.scannerDetected`

**useBarcodeScanner (hook)** — Manages QuaggaJS initialization, camera permissions, and detection:

- Returns `{ isSupported, isScanning, lastDetected, error, startScanning, stopScanning }`
- Accepts optional `options` parameter with `onDetected` callback
- `isSupported` — uses `useSyncExternalStore` with server snapshot returning `false` to avoid SSR/client hydration mismatch
- `startScanning` — requests camera permission → initializes QuaggaJS with `{ decoder: { readers: ["ean_reader"] }, locate: true, frequency: 10 }` → binds `onDetected` callback
- `onDetected` callback — invoked on valid detection, passed the detected code string; held via ref to keep `startScanning` stable
- `stopScanning` — teardown QuaggaJS, stop camera tracks, clean up DOM elements from container
- 2-second debounce on detection to prevent duplicate scans
- Cleanup on unmount — always stops camera tracks to release hardware

### Modified Components

**SearchBar** — Renders BarcodeScannerButton next to the Input. Manages `isScannerOpen` state for overlay visibility. Passes an `onDetected` callback to `useBarcodeScanner` that sets `query` state and calls `searchWithQuery` directly (extracted from `handleSearch`), avoiding effect-based state synchronization. Existing search flow (detectQueryType → API call with CN/EAN-13 fallback) remains unmodified.

### Data Flow

1. User taps Scan button
2. `useBarcodeScanner.startScanning()` requests camera + starts QuaggaJS
3. ScannerOverlay shows live camera feed
4. Barcode detected → 2s debounce → validate 13 digits
5. Overlay auto-closes after ~300ms with green flash feedback
6. `onDetected` callback invoked with detected code
7. SearchBar sets `query` state and calls `searchWithQuery` directly
8. Auto-submit triggers existing search flow (detectQueryType → API call → fallback if needed)

## Scanner Overlay UX

- **Full-screen overlay** with dark semi-transparent backdrop
- **Viewfinder frame** — dashed border highlighting the scan zone area
- **Guidance text** from i18n — "Apunta al código de barras"
- **Close button** — top-right X, accessible via Escape key
- **Status indicator** — "Escaneando..." while camera is active
- **On barcode detected**: green flash feedback → auto-close after ~300ms → populate search input → auto-submit
- **Camera unavailable**: hide scan button on unsupported devices; show permission-denied message in overlay with retry/dismiss
- **Fallback**: manual typed barcode input (existing flow unchanged)

## Technical Implementation

### QuaggaJS Configuration

- Package: `@ericblade/quagga2`
- Decoder: `ean_reader` only (EAN-13 for Spanish medication barcodes)
- Mode: live stream (continuous detection from camera feed)
- `locate: true` for better detection accuracy
- `frequency: 10` (~10 checks/sec, balances detection speed vs battery)
- Detection validation: must be 13 digits to qualify as EAN-13

### State Management

- No new global state needed
- SearchBar manages `isScannerOpen` boolean
- `useBarcodeScanner` hook manages all scanning state
- `onDetected` callback (held via ref for stability) triggers `setQuery` + `searchWithQuery` directly in SearchBar — no React effect-based synchronization
- `searchWithQuery` extracted as `useCallback` from `handleSearch` to enable direct invocation from the callback
- Existing search flow remains entirely unmodified

### i18n Keys (messages/es-ES.json)

- `search.scanButtonLabel`: "Escanear código de barras"
- `search.scannerTitle`: "Apunta al código de barras"
- `search.scannerStatus`: "Escaneando..."
- `search.scannerDetected`: "Código detectado"
- `search.scannerPermissionDenied`: "No se pudo acceder a la cámara. Puedes escribir el código manualmente."
- `search.closeScannerLabel`: "Cerrar escáner"

### Accessibility

- Scan button: `aria-label` from i18n
- Overlay: `role="dialog"`, `aria-label`, focus trapping, Escape to close
- Detection: `aria-live="polite"` for screen reader announcements
- Permission denied: `role="alert"` on error message
- Close button: `aria-label` from i18n

### Platform Support

- **Mobile**: rear camera via `getUserMedia({ video: { facingMode: "environment" } })`
- **Desktop**: webcam via `getUserMedia({ video: true })`
- **Unsupported**: scan button hidden when `navigator.mediaDevices?.getUserMedia` is unavailable
