## MODIFIED Requirements

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

### Requirement: ICU pluralization for result count

The result count heading SHALL use ICU plural format for singular/plural handling. The `results.count` key in the message catalog SHALL use the `{count, plural, one {…} other {…}}` ICU syntax so that the component can render the correct singular or plural form.

#### Scenario: Singular result

- **WHEN** exactly one search result is displayed
- **THEN** the heading SHALL render the singular form using ICU plural syntax from the `results.count` key in `messages/es-ES.json`

#### Scenario: Plural results

- **WHEN** more than one search result is displayed
- **THEN** the heading SHALL render the plural form using ICU plural syntax from the `results.count` key in `messages/es-ES.json`

### Requirement: Status banner and message keys

The `status` namespace in the message catalog SHALL contain entries for each status level (RED, AMBER, GREEN, YELLOW). Each status level SHALL define three keys: `banner` (the status banner label), `message` (the contextual warning or safe message), and `ariaLabel` (the accessible label for screen readers). The `status` namespace SHALL also define an `activeIngredientsLabel` key for the active ingredients list aria-label.

#### Scenario: Status level has required keys

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `status` namespace SHALL contain sub-namespaces `RED`, `AMBER`, `GREEN`, and `YELLOW`
- **AND** each SHALL contain `banner`, `message`, and `ariaLabel` keys
- **AND** the `status` namespace SHALL contain an `activeIngredientsLabel` key

### Requirement: Search namespace keys

The `search` namespace in the message catalog SHALL define keys for `formLabel`, `inputLabel`, `placeholder`, `button`, `buttonLoading`, and `error`.

#### Scenario: Search keys exist

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `search` namespace SHALL contain `formLabel`, `inputLabel`, `placeholder`, `button`, `buttonLoading`, and `error` keys

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
