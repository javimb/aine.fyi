## MODIFIED Requirements

### Requirement: Search bar is single-mode with auto-scroll to results

The search bar SHALL always render at the same size (large, prominent, `h-12`) on the hero-landing page. There is no separate compact mode. After a search is submitted and results appear, the page SHALL auto-scroll smoothly to the results so the user can see them without manual scrolling. The search bar, title, and subtitle remain visible above the results — the layout does not change between states.

Before submitting a search, the search bar SHALL run `detectQueryType()` on the trimmed query to determine the appropriate API parameter (`cn` or `nombre`). If the detected type is `"ean13"`, the search bar SHALL extract the CN via `extractCnFromEan13()` and use the `cn` parameter. If the detected type is `"cn"`, the search bar SHALL use the `cn` parameter directly. If the detected type is `"name"`, the search bar SHALL use the `nombre` parameter. When a CN or EAN-13 query returns no results (HTTP 404 or empty result), the search bar SHALL transparently retry with `nombre=<original_query>`.

The search bar SHALL render a BarcodeScannerButton next to the search input when `navigator.mediaDevices?.getUserMedia` is available. The SearchBar SHALL manage an `isScannerOpen` boolean state for overlay visibility. The SearchBar SHALL pass an `onDetected` callback to `useBarcodeScanner` that sets the `query` state to the detected barcode and calls `searchWithQuery` directly, reusing the existing search pipeline without modification and avoiding React effect-based state synchronization.

#### Scenario: Search bar renders prominently on landing page

- **WHEN** the user loads the page
- **THEN** the search bar SHALL render with a large input (`h-12`) as part of a hero section centered vertically with `min-h-dvh` and `justify-center`
- **AND** the page title and subtitle SHALL be visible above the search bar
- **AND** the search bar SHALL be horizontally centered with `max-w-2xl`

#### Scenario: Auto-scroll to results after search

- **WHEN** the user submits a search and results are displayed
- **THEN** the page SHALL smoothly scroll to the results section automatically
- **AND** the search bar, title, and subtitle SHALL remain visible above the results
- **AND** the search query SHALL remain in the input field

#### Scenario: CN query submitted via cn parameter

- **WHEN** the user submits a 6-7 digit numeric query
- **THEN** the search bar SHALL detect type `"cn"` and send a request to `/api/cima?cn=<query>`

#### Scenario: EAN-13 query submitted with CN extraction

- **WHEN** the user submits a 13-digit numeric query
- **THEN** the search bar SHALL detect type `"ean13"`, extract the CN, and send a request to `/api/cima?cn=<extractedCN>`

#### Scenario: Name query submitted via nombre parameter

- **WHEN** the user submits a non-numeric or mixed query
- **THEN** the search bar SHALL detect type `"name"` and send a request to `/api/cima?nombre=<query>`

#### Scenario: CN lookup with no results triggers name fallback

- **WHEN** a CN or EAN-13 query returns HTTP 404 or no results
- **THEN** the search bar SHALL transparently retry with `/api/cima?nombre=<original_query>`

#### Scenario: Name query does not trigger fallback

- **WHEN** a name search returns no results
- **THEN** the search bar SHALL display the empty results state
- **AND** SHALL NOT perform any fallback

#### Scenario: Scanner button renders next to search input on supported device

- **WHEN** the search bar renders on a device with `navigator.mediaDevices?.getUserMedia` available
- **THEN** a BarcodeScannerButton SHALL render next to the search input
- **AND** tapping the button SHALL set `isScannerOpen` to `true`

#### Scenario: Scanner overlay opens and closes

- **WHEN** `isScannerOpen` is `true`
- **THEN** the ScannerOverlay SHALL render
- **WHEN** the overlay closes (via close button, Escape key, or successful detection)
- **THEN** `isScannerOpen` SHALL be set to `false`

#### Scenario: Detected barcode populates search and auto-submits

- **WHEN** a barcode detection completes and the `onDetected` callback is invoked with the detected code
- **THEN** the SearchBar SHALL set `query` state to the detected barcode
- **AND** `searchWithQuery` SHALL be called automatically with the detected code
- **AND** the search SHALL follow the existing pipeline without modification

#### Scenario: Scanner button hidden on unsupported device

- **WHEN** the search bar renders on a device without `navigator.mediaDevices?.getUserMedia`
- **THEN** no BarcodeScannerButton SHALL render
- **AND** the search bar SHALL function identically to the current text-only implementation
