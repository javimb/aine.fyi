# I18N

## Purpose

Internationalization configuration and centralized message catalog — declaring the page locale, configuring next-intl, and maintaining a single source of truth for all UI-facing strings.

## Requirements

### Requirement: Page language and locale

The application SHALL declare Spanish (Spain) as the page language via `<html lang="es-ES">` and Open Graph locale metadata (`og:locale`). The locale value SHALL be sourced from the next-intl configuration, not hardcoded. The root layout SHALL use `generateMetadata` with `getTranslations` to produce page title, description, and Open Graph metadata from the message catalog.

#### Scenario: Page language is declared

- **WHEN** the application renders
- **THEN** the `<html>` element SHALL have `lang="es-ES"`

#### Scenario: Open Graph locale metadata

- **WHEN** the root layout generates metadata
- **THEN** the Open Graph metadata SHALL include `og:locale` set to `es-ES`

#### Scenario: Page title from message catalog

- **WHEN** the root layout generates metadata
- **THEN** the `<title>` and `openGraph.title` SHALL use the string from `messages/es-ES.json` under `app.title`

#### Scenario: Page description from message catalog

- **WHEN** the root layout generates metadata
- **THEN** the `description` and `openGraph.description` SHALL use the string from `messages/es-ES.json` under `app.description`

### Requirement: Centralized message catalog

The application SHALL store all UI-facing strings in a single JSON message catalog file (`messages/es-ES.json`) organized by namespace. Each namespace SHALL correspond to a logical section of the application (e.g., `app`, `search`, `status`, `results`, `explainer`, `disclaimer`, `dataSource`, `api`). The message catalog file SHALL be the sole source of truth for string content; this spec governs only the required key structure and semantics, not the literal wording of values.

#### Scenario: Medical reviewer can audit all text

- **WHEN** a reviewer needs to verify all patient-facing text
- **THEN** they SHALL be able to read `messages/es-ES.json` top-to-bottom without navigating source code

#### Scenario: New string addition

- **WHEN** a developer adds a new UI-facing string to the application
- **THEN** they SHALL add it to `messages/es-ES.json` under the appropriate namespace and reference it via next-intl translation functions

#### Scenario: Content change does not require spec update

- **WHEN** a developer changes the wording of an existing string in `messages/es-ES.json`
- **THEN** no update to this spec SHALL be required, provided the key name and namespace remain unchanged

### Requirement: next-intl Provider-Only configuration

The application SHALL configure next-intl using the Provider-Only pattern (no `[locale]` route segment) with `es-ES` as the fixed default locale.

#### Scenario: Locale configuration

- **WHEN** the application starts
- **THEN** next-intl SHALL be configured with `es-ES` as the default and only locale

#### Scenario: URL structure preserved

- **WHEN** a user navigates to any page
- **THEN** the URL SHALL NOT contain a locale segment (e.g., `/es/`)

### Requirement: Client component string access

Client components SHALL access translated strings via the `useTranslations(namespace)` hook from next-intl.

#### Scenario: Search bar displays translated placeholder

- **WHEN** the search bar component renders
- **THEN** it SHALL display the placeholder text from `messages/es-ES.json` under the `search.placeholder` key via `useTranslations('search')`

#### Scenario: Status banner displays translated label and message

- **WHEN** a result card renders with a status
- **THEN** it SHALL display the banner label and detail message from `messages/es-ES.json` under `status.<statusLevel>.banner` and `status.<statusLevel>.message` via `useTranslations('status')`

#### Scenario: Client-side error message

- **WHEN** the search bar catches a network error
- **THEN** it SHALL display the error text from `messages/es-ES.json` under `search.error`

### Requirement: Server component string access

Server components SHALL access translated strings via the `getTranslations(namespace)` async function from next-intl.

#### Scenario: Page heading from translations

- **WHEN** the home page renders server-side
- **THEN** the `<h1>` and subtitle SHALL use strings from `messages/es-ES.json` under `app.title` and `app.description` via `getTranslations('app')`

#### Scenario: Explainer section from translations

- **WHEN** the explainer section renders server-side
- **THEN** it SHALL use strings from `messages/es-ES.json` under `explainer.heading` and `explainer.body`

#### Scenario: Disclaimer section from translations

- **WHEN** the disclaimer renders server-side
- **THEN** it SHALL use strings from `messages/es-ES.json` under `disclaimer.heading` and `disclaimer.body`

#### Scenario: Data source attribution from translations

- **WHEN** the data source attribution renders
- **THEN** it SHALL use the string from `messages/es-ES.json` under `dataSource.attribution` with ICU interpolation for `{date}`

### Requirement: ICU pluralization for result count

The result count heading SHALL use ICU plural format for singular/plural handling. The `results.count` key in the message catalog SHALL use the `{count, plural, one {…} other {…}}` ICU syntax so that the component can render the correct singular or plural form.

#### Scenario: Singular result

- **WHEN** exactly one search result is displayed
- **THEN** the heading SHALL render the singular form using ICU plural syntax from the `results.count` key in `messages/es-ES.json`

#### Scenario: Plural results

- **WHEN** more than one search result is displayed
- **THEN** the heading SHALL render the plural form using ICU plural syntax from the `results.count` key in `messages/es-ES.json`

### Requirement: Status banner and message keys

The `status` namespace in the message catalog SHALL contain entries for each status level (RED, AMBER, GREEN, YELLOW). Each status level SHALL define three keys: `banner` (the status banner label, plain text without emoji), `message` (the contextual warning or safe message, plain text without emoji), and `ariaLabel` (the accessible label for screen readers). The `status` namespace SHALL also define an `activeIngredientsLabel` key for the active ingredients list aria-label. No string value in the status namespace SHALL contain emoji characters.

#### Scenario: Status level has required keys

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `status` namespace SHALL contain sub-namespaces `RED`, `AMBER`, `GREEN`, and `YELLOW`
- **AND** each SHALL contain `banner`, `message`, and `ariaLabel` keys
- **AND** no string value SHALL contain emoji characters
- **AND** the `status` namespace SHALL contain an `activeIngredientsLabel` key

### Requirement: Search namespace keys

The `search` namespace in the message catalog SHALL define keys for `formLabel`, `inputLabel`, `placeholder`, `button`, `buttonLoading`, `error`, `scanButtonLabel`, `scannerTitle`, `scannerStatus`, `scannerDetected`, `scannerPermissionDenied`, and `closeScannerLabel`.

#### Scenario: Search keys exist

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `search` namespace SHALL contain `formLabel`, `inputLabel`, `placeholder`, `button`, `buttonLoading`, `error`, `scanButtonLabel`, `scannerTitle`, `scannerStatus`, `scannerDetected`, `scannerPermissionDenied`, and `closeScannerLabel` keys

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

### Requirement: App namespace keys

The `app` namespace in the message catalog SHALL define keys for `title` and `description`.

#### Scenario: App keys exist

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `app` namespace SHALL contain `title` and `description` keys

### Requirement: Explainer namespace keys

The `explainer` namespace in the message catalog SHALL define keys for `heading` and `body`.

#### Scenario: Explainer keys exist

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `explainer` namespace SHALL contain `heading` and `body` keys

### Requirement: Disclaimer namespace keys

The `disclaimer` namespace in the message catalog SHALL define keys for `heading` and `body`.

#### Scenario: Disclaimer keys exist

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `disclaimer` namespace SHALL contain `heading` and `body` keys

### Requirement: DataSource namespace keys

The `dataSource` namespace in the message catalog SHALL define an `attribution` key that supports ICU interpolation for `{date}`.

#### Scenario: DataSource keys exist

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `dataSource` namespace SHALL contain an `attribution` key with a `{date}` interpolation placeholder

### Requirement: API route error messages in message catalog

The CIMA proxy API route SHALL return error messages sourced from the message catalog under the `api` namespace.

#### Scenario: Missing parameters error

- **WHEN** a request is made to `/api/cima` without required parameters
- **THEN** the error message SHALL come from `messages/es-ES.json` under `api.missingParams`

#### Scenario: Internal server error

- **WHEN** the API route encounters an unhandled error
- **THEN** the error message SHALL come from `messages/es-ES.json` under `api.internalError`

#### Scenario: Upstream CIMA API error

- **WHEN** the upstream CIMA API returns an error
- **THEN** the error message SHALL come from `messages/es-ES.json` under `api.upstreamError`

### Requirement: ARIA labels from message catalog

All accessibility labels (ARIA attributes) that contain user-facing text SHALL reference the message catalog.

#### Scenario: Search form ARIA label

- **WHEN** the search form renders
- **THEN** its `aria-label` SHALL use the string from `messages/es-ES.json` under `search.formLabel`

#### Scenario: Search input ARIA label

- **WHEN** the search input renders
- **THEN** its `aria-label` SHALL use the string from `messages/es-ES.json` under `search.inputLabel`

#### Scenario: Result card ARIA label

- **WHEN** a result card renders
- **THEN** its `aria-label` SHALL use a status-dependent translated string from `messages/es-ES.json` under `status.<statusLevel>.ariaLabel`

#### Scenario: Active ingredients list ARIA label

- **WHEN** the active ingredients list renders
- **THEN** its `aria-label` SHALL use the string from `messages/es-ES.json` under `status.activeIngredientsLabel`

### Requirement: No hardcoded UI strings in components

After migration, no component file SHALL contain hardcoded Spanish strings. All user-facing text SHALL be accessed through next-intl translation functions.

#### Scenario: Component audit

- **WHEN** a developer searches component source files for Spanish-language string literals
- **THEN** there SHALL be zero hardcoded UI strings in component JSX, object constants, or function return values
