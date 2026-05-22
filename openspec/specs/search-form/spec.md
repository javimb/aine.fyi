# Search Form

## Purpose

Ensure the search form is accessible to screen readers, supports single-mode layout with auto-scroll to results, and provides accessible error, loading, and empty states — including a neutral "not found" message when a search returns zero results.

## Requirements

### Requirement: Search form has an accessible name

The `<form>` element containing the search input and button SHALL have an `aria-label` attribute with a Spanish-language description so that screen readers can identify the form's purpose. The form SHALL use shadcn/ui `Input` and `Button` components.

#### Scenario: Screen reader identifies the form

- **WHEN** a screen reader user navigates to the search form
- **THEN** the form SHALL be announced with its accessible name

#### Scenario: Form renders with aria-label and shadcn/ui components

- **WHEN** the search form is rendered
- **THEN** the `<form>` element SHALL have an `aria-label`
- **AND** the input SHALL be a shadcn/ui `Input` component
- **AND** the button SHALL be a shadcn/ui `Button` component

### Requirement: Search input has an accessible label

The search input SHALL have proper accessible labeling. A visible `aria-label` SHALL identify the input at all times.

#### Scenario: Screen reader identifies the input

- **WHEN** a screen reader user focuses on the search input
- **THEN** the input SHALL be announced with an accessible name indicating it is a medication search field

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

### Requirement: Error and loading states are accessible

When the search form is in a loading state, the submit button SHALL indicate loading both visually (disabled state with the text from i18n key `search.buttonLoading`) and to screen readers (`aria-busy="true"` on the form). When an error occurs, the error message from i18n key `search.error` SHALL be announced via `aria-live="polite"` and use `role="alert"`.

#### Scenario: Loading state accessibility

- **WHEN** a search request is in progress
- **THEN** the form SHALL have `aria-busy="true"`
- **AND** the submit button SHALL be disabled with text from i18n key `search.buttonLoading`

#### Scenario: Error state accessibility

- **WHEN** a search error occurs
- **THEN** the error message from i18n key `search.error` SHALL have `role="alert"` and `aria-live="polite"`

### Requirement: Empty results state with neutral not-found message

The SearchBar SHALL maintain an `isEmpty` boolean state: set to `true` when the API returns an empty `resultados` array, set to `false` when a new search starts, when results are found, or when an error occurs. When `isEmpty` is `true` and `error` is falsy, an `EmptyResults` component SHALL render with `role="status"` and `aria-live="polite"` to announce the empty state to screen readers. The component SHALL render within the same `w-full max-w-2xl` container as the search results, below the search form. The `isEmpty` state SHALL take precedence over the empty results display — the error state SHALL suppress the empty state.

The `EmptyResults` component (at `src/components/empty-results.tsx`) SHALL render a neutral/muted styled message sourced from i18n key `search.emptyResults`. The component SHALL NOT use any status color tint (RED, AMBER, GREEN, YELLOW) — the empty state is visually distinct from the YELLOW uncertain status.

#### Scenario: Empty results state rendering

- **WHEN** a search completes and the API returns `resultados` as an empty array
- **THEN** the SearchBar SHALL set `isEmpty` to `true`
- **AND** the `EmptyResults` component SHALL render with `role="status"` and `aria-live="polite"`
- **AND** the message text SHALL come from i18n key `search.emptyResults`
- **AND** the component SHALL NOT have any status color background or text tint

#### Scenario: Error state suppresses empty state

- **WHEN** a search completes with both an error and zero results
- **THEN** the error message SHALL render
- **AND** the EmptyResults component SHALL NOT render

#### Scenario: New search resets empty state

- **WHEN** the user submits a new search query
- **THEN** `isEmpty` SHALL be set to `false`
- **AND** the EmptyResults component SHALL NOT render during loading

#### Scenario: Results found resets empty state

- **WHEN** a search returns one or more results
- **THEN** `isEmpty` SHALL be `false`
- **AND** the EmptyResults component SHALL NOT render

#### Scenario: Empty results message is accessible to screen readers

- **WHEN** a search completes with zero results
- **THEN** the EmptyResults message element SHALL have `role="status"`
- **AND** the message element SHALL have `aria-live="polite"`
- **AND** screen readers SHALL announce the message content automatically

#### Scenario: i18n key for empty results message

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the key `search.emptyResults` SHALL exist with a plain text message in Spanish
- **AND** the message SHALL NOT contain emoji characters

### Requirement: Search placeholder indicates barcode and CN support

The search input SHALL display placeholder text indicating that barcode and CN searches are supported. The placeholder text SHALL be sourced from the i18n key `search.placeholder` in `messages/es-ES.json` with the value `"Buscar medicamento por nombre, código nacional o código de barras..."`.

#### Scenario: Placeholder text shows barcode and CN support

- **WHEN** the search input renders on the page
- **THEN** the placeholder text SHALL indicate that CN and barcode input is accepted
- **AND** the placeholder text SHALL be sourced from i18n key `search.placeholder`

#### Scenario: i18n key for placeholder exists

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the key `search.placeholder` SHALL exist with the value `"Buscar medicamento por nombre, código nacional o código de barras..."`
