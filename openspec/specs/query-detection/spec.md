# Query Detection

## Purpose

Classify user search input as a código nacional (CN), EAN-13 barcode, or medication name, and route each query type to the appropriate API parameter with transparent fallback to name search when CN/EAN-13 lookups return no results.

## Requirements

### Requirement: Detect query type from user input

The system SHALL provide a `detectQueryType()` function that classifies a search query string into one of three types: `"cn"`, `"ean13"`, or `"name"`. The classification rules SHALL be:

- If the trimmed input consists entirely of digits and has a length of 6 or 7 characters, it SHALL be classified as `"cn"`.
- If the trimmed input consists entirely of digits and has a length of 13 characters, it SHALL be classified as `"ean13"`.
- All other inputs SHALL be classified as `"name"`.

#### Scenario: Six-digit numeric input classified as CN

- **WHEN** the user submits a query that is exactly 6 digits (e.g., `"123456"`)
- **THEN** `detectQueryType()` SHALL return `"cn"`

#### Scenario: Seven-digit numeric input classified as CN

- **WHEN** the user submits a query that is exactly 7 digits (e.g., `"1234567"`)
- **THEN** `detectQueryType()` SHALL return `"cn"`

#### Scenario: Thirteen-digit numeric input classified as EAN-13

- **WHEN** the user submits a query that is exactly 13 digits (e.g., `"8470001234567"`)
- **THEN** `detectQueryType()` SHALL return `"ean13"`

#### Scenario: Alphanumeric input classified as name

- **WHEN** the user submits a query containing letters or mixed characters (e.g., `"ibuprofeno"`)
- **THEN** `detectQueryType()` SHALL return `"name"`

#### Scenario: Short numeric input classified as name

- **WHEN** the user submits a query that is fewer than 6 digits (e.g., `"1234"`)
- **THEN** `detectQueryType()` SHALL return `"name"`

#### Scenario: Numeric input between CN and EAN-13 length classified as name

- **WHEN** the user submits a query that is 8-12 digits
- **THEN** `detectQueryType()` SHALL return `"name"`

#### Scenario: Leading and trailing whitespace is trimmed

- **WHEN** the user submits a query with leading or trailing whitespace (e.g., `"  123456  "`)
- **THEN** `detectQueryType()` SHALL trim the input before classification and return `"cn"`

### Requirement: Extract CN from EAN-13 barcode

The system SHALL provide an `extractCnFromEan13()` function that takes a 13-character EAN-13 string and extracts the Código Nacional from indices 6-11 (the 6-digit substring starting after the GS1 Spain prefix). The extracted substring SHALL be validated as numeric before being returned.

#### Scenario: Valid EAN-13 extracts CN

- **WHEN** `extractCnFromEan13()` receives a valid EAN-13 string `"8470001234567"`
- **THEN** it SHALL return `"123456"` (the substring from indices 6-11)

#### Scenario: EAN-13 string too short

- **WHEN** `extractCnFromEan13()` receives a string shorter than 13 characters
- **THEN** it SHALL return `null`

#### Scenario: EAN-13 string too long

- **WHEN** `extractCnFromEan13()` receives a string longer than 13 characters
- **THEN** it SHALL return `null`

#### Scenario: Entire EAN-13 string

- **WHEN** `extractCnFromEan13()` receives a 13-character string
- **THEN** it SHALL extract exactly the substring from index 6 to index 12 (exclusive)

### Requirement: Route detected query to appropriate API parameter

The search bar SHALL route queries based on the detected type:

- `"cn"` queries SHALL be sent to `GET /api/cima?cn=<value>`
- `"ean13"` queries SHALL have the CN extracted via `extractCnFromEan13()` and sent to `GET /api/cima?cn=<extractedCN>`
- `"name"` queries SHALL be sent to `GET /api/cima?nombre=<value>`

#### Scenario: CN query routed to cn parameter

- **WHEN** the user submits a 6-digit numeric query
- **THEN** the search bar SHALL send a request to `/api/cima?cn=<query>`

#### Scenario: EAN-13 query has CN extracted and routed

- **WHEN** the user submits a 13-digit numeric query
- **THEN** the search bar SHALL extract the CN from indices 6-11
- **AND** send a request to `/api/cima?cn=<extractedCN>`

#### Scenario: Name query routed to nombre parameter

- **WHEN** the user submits a non-numeric or mixed query
- **THEN** the search bar SHALL send a request to `/api/cima?nombre=<query>`

### Requirement: Transparent fallback from CN/EAN-13 to name search

When a CN or EAN-13 query returns no results (HTTP 404 from the API, or a successful response with an empty/no result), the search bar SHALL transparently retry the search using `nombre=<original_query>` without displaying an intermediate empty or error state. The user SHALL see either the fallback results or a final empty state — never two separate loading cycles.

#### Scenario: CN lookup returns 404 triggers name fallback

- **WHEN** a CN search receives an HTTP 404 response
- **THEN** the search bar SHALL automatically retry with `/api/cima?nombre=<original_query>`

#### Scenario: CN lookup returns no result triggers name fallback

- **WHEN** a CN search receives a response with no matching medication
- **THEN** the search bar SHALL automatically retry with `/api/cima?nombre=<original_query>`

#### Scenario: CN lookup succeeds returns result directly

- **WHEN** a CN search receives a valid medication result
- **THEN** the search bar SHALL display the result
- **AND** SHALL NOT perform a name fallback

#### Scenario: EAN-13 extraction fails falls back to name search

- **WHEN** `extractCnFromEan13()` returns `null` for a 13-digit input
- **THEN** the search bar SHALL fall back to `/api/cima?nombre=<original_query>`

#### Scenario: Fallback also returns no results shows final empty state

- **WHEN** both the CN lookup and the name fallback return no results
- **THEN** the search bar SHALL display the standard empty results state
- **AND** SHALL NOT make additional retry attempts
