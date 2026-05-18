# Accessible Search Form

## Purpose

Ensure the search form is accessible to screen readers by providing Spanish-language ARIA labels on both the `<form>` and `<input>` elements, using shadcn/ui components, supporting a single-mode layout with auto-scroll to results, and providing accessible error, loading, and empty states.

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

### Requirement: Error and loading states are accessible

When the search form is in a loading state, the submit button SHALL indicate loading both visually (disabled state with the text from i18n key `search.buttonLoading`) and to screen readers (`aria-busy="true"` on the form). When an error occurs, the error message from i18n key `search.error` SHALL be announced via `aria-live="polite"` and use `role="alert"`. When a search returns zero results, an `EmptyResults` component with `role="status"` and `aria-live="polite"` SHALL be rendered in the results area. The SearchBar SHALL maintain an `isEmpty` boolean state: set to `true` when the API returns an empty `resultados` array, set to `false` when a new search starts, when results are found, or when an error occurs. The `EmptyResults` component SHALL render when `isEmpty` is `true` and `error` is falsy. The `isEmpty` state SHALL take precedence over the empty results display — the error state SHALL suppress the empty state.

#### Scenario: Loading state accessibility

- **WHEN** a search request is in progress
- **THEN** the form SHALL have `aria-busy="true"`
- **AND** the submit button SHALL be disabled with text from i18n key `search.buttonLoading`

#### Scenario: Error state accessibility

- **WHEN** a search error occurs
- **THEN** the error message from i18n key `search.error` SHALL have `role="alert"` and `aria-live="polite"`

#### Scenario: Empty results state rendering

- **WHEN** a search completes and the API returns `resultados` as an empty array
- **THEN** the SearchBar SHALL set `isEmpty` to `true`
- **AND** the `EmptyResults` component SHALL render with `role="status"` and `aria-live="polite"`

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
