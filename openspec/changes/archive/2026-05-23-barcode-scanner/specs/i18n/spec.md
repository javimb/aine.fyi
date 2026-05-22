## ADDED Requirements

### Requirement: Scanner-related translation keys

The `search` namespace in the message catalog SHALL define the following additional keys for barcode scanner support: `scanButtonLabel` (accessible label for the scan button), `scannerTitle` (guidance text shown in the overlay), `scannerStatus` (status text while scanning), `scannerDetected` (screen reader announcement on detection), `scannerPermissionDenied` (error message when camera access is denied), and `closeScannerLabel` (accessible label for the close button).

#### Scenario: Scanner keys exist in message catalog

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `search` namespace SHALL contain `scanButtonLabel`, `scannerTitle`, `scannerStatus`, `scannerDetected`, `scannerPermissionDenied`, and `closeScannerLabel` keys

#### Scenario: Scan button label is accessible

- **WHEN** the BarcodeScannerButton renders
- **THEN** its `aria-label` SHALL use the string from `messages/es-ES.json` under `search.scanButtonLabel`

#### Scenario: Scanner overlay guidance text

- **WHEN** the scanner overlay is open
- **THEN** the guidance text SHALL use the string from `messages/es-ES.json` under `search.scannerTitle`

#### Scenario: Scanner status text

- **WHEN** the scanner is actively scanning
- **THEN** the status indicator SHALL display the text from `messages/es-ES.json` under `search.scannerStatus`

#### Scenario: Detection announcement for screen readers

- **WHEN** a barcode is successfully detected
- **THEN** the `aria-live="polite"` region SHALL announce the text from `messages/es-ES.json` under `search.scannerDetected`

#### Scenario: Permission denied error message

- **WHEN** camera permission is denied or unavailable
- **THEN** the error message SHALL use the string from `messages/es-ES.json` under `search.scannerPermissionDenied`

#### Scenario: Close scanner button label

- **WHEN** the close button renders in the scanner overlay
- **THEN** its `aria-label` SHALL use the string from `messages/es-ES.json` under `search.closeScannerLabel`

## MODIFIED Requirements

### Requirement: Search namespace keys

The `search` namespace in the message catalog SHALL define keys for `formLabel`, `inputLabel`, `placeholder`, `button`, `buttonLoading`, `error`, `scanButtonLabel`, `scannerTitle`, `scannerStatus`, `scannerDetected`, `scannerPermissionDenied`, and `closeScannerLabel`.

#### Scenario: Search keys exist

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `search` namespace SHALL contain `formLabel`, `inputLabel`, `placeholder`, `button`, `buttonLoading`, `error`, `scanButtonLabel`, `scannerTitle`, `scannerStatus`, `scannerDetected`, `scannerPermissionDenied`, and `closeScannerLabel` keys
