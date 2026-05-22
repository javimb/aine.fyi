## MODIFIED Requirements

### Requirement: Search bar is single-mode with auto-scroll to results

The search bar SHALL always render at the same size (large, prominent, `h-12`) on the hero-landing page. There is no separate compact mode. After a search is submitted and results appear, the page SHALL auto-scroll smoothly to the results so the user can see them without manual scrolling. The search bar, title, and subtitle remain visible above the results — the layout does not change between states.

Before submitting a search, the search bar SHALL run `detectQueryType()` on the trimmed query to determine the appropriate API parameter (`cn` or `nombre`). If the detected type is `"ean13"`, the search bar SHALL extract the CN via `extractCnFromEan13()` and use the `cn` parameter. If the detected type is `"cn"`, the search bar SHALL use the `cn` parameter directly. If the detected type is `"name"`, the search bar SHALL use the `nombre` parameter. When a CN or EAN-13 query returns no results (HTTP 404 or empty result), the search bar SHALL transparently retry with `nombre=<original_query>`.

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

## ADDED Requirements

### Requirement: Search placeholder indicates barcode and CN support

The search input SHALL display placeholder text indicating that barcode and CN searches are supported. The placeholder text SHALL be sourced from the i18n key `search.placeholder` in `messages/es-ES.json` with the value `"Buscar medicamento por nombre, código nacional o código de barras..."`.

#### Scenario: Placeholder text shows barcode and CN support

- **WHEN** the search input renders on the page
- **THEN** the placeholder text SHALL indicate that CN and barcode input is accepted
- **AND** the placeholder text SHALL be sourced from i18n key `search.placeholder`

#### Scenario: i18n key for placeholder exists

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the key `search.placeholder` SHALL exist with the value `"Buscar medicamento, CN o código de barras..."`
