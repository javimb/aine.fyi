# Barcode Scanner

## Purpose

Camera-based EAN-13 barcode detection via QuaggaJS overlay, enabling users to scan medication barcodes instead of typing them manually. Includes scanner button, camera overlay, detection validation, camera permission handling, and accessibility support.

## ADDED Requirements

### Requirement: Barcode scanner button renders next to search input

A BarcodeScannerButton component SHALL render as an icon-only button (no visible text label) next to the search input. The button SHALL use the `ScanBarcode` icon from `lucide-react` (or `Barcode` if unavailable) and SHALL have an `aria-label` sourced from i18n key `search.scanButtonLabel`. The button SHALL only render when `navigator.mediaDevices?.getUserMedia` is available; on unsupported devices it SHALL NOT be rendered at all.

#### Scenario: Scanner button visible on supported device

- **WHEN** a user loads the page on a device with `navigator.mediaDevices?.getUserMedia` available
- **THEN** the BarcodeScannerButton SHALL render as an icon-only button next to the search input
- **AND** the button SHALL have an `aria-label` from i18n key `search.scanButtonLabel`

#### Scenario: Scanner button hidden on unsupported device

- **WHEN** a user loads the page on a device without `navigator.mediaDevices?.getUserMedia`
- **THEN** the BarcodeScannerButton SHALL NOT render

### Requirement: Scanner overlay opens on button tap

When the user taps the BarcodeScannerButton, a full-screen ScannerOverlay SHALL open. The overlay SHALL have a dark semi-transparent backdrop, a live camera feed from QuaggaJS, a viewfinder frame (dashed border highlighting the scan zone), and guidance text from i18n key `search.scannerTitle`. The overlay SHALL use `role="dialog"` with an `aria-label` for accessibility.

#### Scenario: Overlay opens with camera feed

- **WHEN** the user taps the BarcodeScannerButton
- **THEN** a full-screen overlay SHALL open with a dark semi-transparent backdrop
- **AND** a live camera feed SHALL be displayed
- **AND** a viewfinder frame (dashed border) SHALL highlight the scan zone
- **AND** guidance text from i18n key `search.scannerTitle` SHALL be displayed

#### Scenario: Overlay is an accessible dialog

- **WHEN** the scanner overlay opens
- **THEN** the overlay container SHALL have `role="dialog"` and an `aria-label`

### Requirement: Scanner overlay close button and keyboard support

The ScannerOverlay SHALL provide a close button in the top-right corner with an X icon and `aria-label` from i18n key `search.closeScannerLabel`. The overlay SHALL support closing via the Escape key. Focus SHALL be trapped within the overlay while it is open.

#### Scenario: Close button closes overlay

- **WHEN** the user taps the close button in the overlay
- **THEN** the overlay SHALL close
- **AND** the camera SHALL be stopped

#### Scenario: Escape key closes overlay

- **WHEN** the overlay is open and the user presses the Escape key
- **THEN** the overlay SHALL close
- **AND** the camera SHALL be stopped

#### Scenario: Focus is trapped in overlay

- **WHEN** the overlay is open
- **THEN** focus SHALL be trapped within the overlay
- **AND** Tab/Shift+Tab SHALL NOT move focus outside the overlay

### Requirement: Barcode detection and validation

The `useBarcodeScanner` hook SHALL manage QuaggaJS initialization and barcode detection. It SHALL initialize QuaggaJS with `{ decoder: { readers: ["ean_reader"] }, locate: true, frequency: 10 }` for live stream detection. When a barcode is detected, it SHALL validate that the code is exactly 13 digits (EAN-13 format). Valid detections SHALL set `lastDetected` and call `stopScanning`. A 2-second debounce SHALL prevent duplicate scans.

#### Scenario: Valid EAN-13 barcode detected

- **WHEN** QuaggaJS detects a code that is 13 digits long
- **THEN** `lastDetected` SHALL be set to the detected code
- **AND** scanning SHALL stop automatically

#### Scenario: Invalid barcode ignored

- **WHEN** QuaggaJS detects a code that is NOT 13 digits long
- **THEN** the detection SHALL be ignored
- **AND** scanning SHALL continue

#### Scenario: Duplicate scan debounce

- **WHEN** a valid barcode is detected
- **AND** less than 2 seconds have passed since the previous detection
- **THEN** the second detection SHALL be ignored

### Requirement: Scanner auto-close on detection

When a valid EAN-13 barcode is detected and validated, the overlay SHALL display a green flash feedback briefly (~300ms), then auto-close. The detected barcode SHALL be announced to screen readers via an `aria-live="polite"` region using i18n key `search.scannerDetected`.

#### Scenario: Auto-close after successful scan

- **WHEN** a valid barcode is detected and validated
- **THEN** a green flash feedback SHALL appear briefly
- **AND** the overlay SHALL auto-close after approximately 300ms

#### Scenario: Screen reader announces detection

- **WHEN** a valid barcode is detected
- **THEN** the `aria-live="polite"` region SHALL announce the text from i18n key `search.scannerDetected`

### Requirement: Scanning status indicator

While the camera is active and scanning, the overlay SHALL display a status indicator with the text from i18n key `search.scannerStatus`.

#### Scenario: Status indicator shows while scanning

- **WHEN** the scanner overlay is open and the camera is active
- **THEN** the status indicator SHALL display the text from i18n key `search.scannerStatus`

### Requirement: Camera permission handling

When the user taps the scan button, `useBarcodeScanner.startScanning()` SHALL request camera permission. If permission is denied or the camera is unavailable, the overlay SHALL display a permission-denied state with a message from i18n key `search.scannerPermissionDenied`, along with retry and dismiss buttons.

#### Scenario: Camera permission granted

- **WHEN** the user grants camera permission
- **THEN** the camera feed SHALL start and scanning SHALL begin

#### Scenario: Camera permission denied

- **WHEN** the user denies camera permission or the camera is unavailable
- **THEN** the overlay SHALL display a message from i18n key `search.scannerPermissionDenied`
- **AND** retry and dismiss buttons SHALL be shown

#### Scenario: Retry camera permission

- **WHEN** the user taps the retry button after a permission denial
- **THEN** the permission request SHALL be attempted again

#### Scenario: Dismiss camera permission error

- **WHEN** the user taps the dismiss button after a permission denial
- **THEN** the overlay SHALL close

### Requirement: Camera hardware cleanup

The `useBarcodeScanner` hook SHALL clean up all camera resources on unmount and when scanning stops. QuaggaJS SHALL be stopped, and all camera media tracks SHALL be released.

#### Scenario: Camera stops on overlay close

- **WHEN** the overlay closes (via close button, Escape key, or successful detection)
- **THEN** QuaggaJS SHALL be stopped
- **AND** all camera media tracks SHALL be released

#### Scenario: Camera cleanup on unmount

- **WHEN** the component using `useBarcodeScanner` unmounts
- **THEN** QuaggaJS SHALL be stopped
- **AND** all camera media tracks SHALL be released

### Requirement: Rear camera preference on mobile

On mobile devices, the scanner SHALL request the rear-facing camera via `getUserMedia({ video: { facingMode: "environment" } })`. On desktop, it SHALL request `getUserMedia({ video: true })`.

#### Scenario: Rear camera on mobile device

- **WHEN** the scanner starts on a mobile device
- **THEN** `getUserMedia` SHALL be called with `{ video: { facingMode: "environment" } }`

#### Scenario: Default camera on desktop

- **WHEN** the scanner starts on a desktop device
- **THEN** `getUserMedia` SHALL be called with `{ video: true }`

### Requirement: Detection result propagation to search

When `lastDetected` changes from `null` to a barcode string, the SearchBar component SHALL set the `query` state to the detected barcode and call `handleSearch`, reusing the existing search pipeline (`detectQueryType` → API call with CN/EAN-13 fallback).

#### Scenario: Detected barcode populates search input

- **WHEN** a valid barcode is detected and the overlay closes
- **THEN** the SearchBar query input SHALL be populated with the detected barcode value
- **AND** `handleSearch` SHALL be called automatically

#### Scenario: Detected barcode follows existing search flow

- **WHEN** a barcode is detected and auto-submitted
- **THEN** the search SHALL follow the existing pipeline (`detectQueryType` → API call → fallback if needed)
- **AND** no modifications to the existing search logic SHALL be required
