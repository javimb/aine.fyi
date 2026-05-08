## ADDED Requirements

### Requirement: Centralized message catalog

The application SHALL store all UI-facing strings in a single JSON message catalog file (`messages/es-ES.json`) organized by namespace. Each namespace SHALL correspond to a logical section of the application (e.g., `app`, `search`, `status`, `results`, `explainer`, `disclaimer`, `dataSource`, `api`).

#### Scenario: Medical reviewer can audit all text

- **WHEN** a reviewer needs to verify all patient-facing text
- **THEN** they SHALL be able to read `messages/es-ES.json` top-to-bottom without navigating source code

#### Scenario: New string addition

- **WHEN** a developer adds a new UI-facing string to the application
- **THEN** they SHALL add it to `messages/es-ES.json` under the appropriate namespace and reference it via next-intl translation functions

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

### Requirement: Metadata string access

The root layout SHALL use `generateMetadata` with `getTranslations` to produce page title, description, and Open Graph metadata from the message catalog.

#### Scenario: Page title from message catalog

- **WHEN** the root layout generates metadata
- **THEN** the `<title>` and `openGraph.title` SHALL use the string from `messages/es-ES.json` under `app.title`

#### Scenario: Page description from message catalog

- **WHEN** the root layout generates metadata
- **THEN** the `description` and `openGraph.description` SHALL use the string from `messages/es-ES.json` under `app.description`

### Requirement: ICU pluralization for result count

The result count heading SHALL use ICU plural format for singular/plural handling.

#### Scenario: Singular result

- **WHEN** exactly one search result is displayed
- **THEN** the heading SHALL read "1 resultado" using ICU `{count, plural, one {…} other {…}}` format

#### Scenario: Plural results

- **WHEN** more than one search result is displayed
- **THEN** the heading SHALL read "N resultados" using ICU plural format

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
