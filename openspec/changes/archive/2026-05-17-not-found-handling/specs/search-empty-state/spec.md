# Search Empty State

## Purpose

Display a friendly, informative message with actionable search tips when a medication search returns zero results, so users understand why nothing was found and how to refine their search.

## ADDED Requirements

### Requirement: EmptyState displays no-results message with search term

When a search returns zero results, the application SHALL render an `EmptyState` component that displays a title message including the user's search term, sourced from i18n key `emptyState.title` with the query interpolated.

#### Scenario: Empty state shows searched term in message

- **WHEN** the user searches for "ibuprofeno" and the CIMA API returns zero results
- **THEN** the EmptyState component SHALL render with a title containing the text from i18n key `emptyState.title` with the query "ibuprofeno" interpolated
- **AND** the title SHALL be displayed prominently within the component

#### Scenario: Empty state appears below search form

- **WHEN** the search state transitions to `{ status: "empty", query: "xyz" }`
- **THEN** the EmptyState component SHALL render below the search form
- **AND** the search form SHALL remain visible and functional so the user can immediately refine their search

### Requirement: EmptyState displays search tips card

The EmptyState component SHALL display a tips section with a heading from i18n key `emptyState.tipHeading` and a list of actionable suggestions sourced from i18n keys `emptyState.tipSpelling`, `emptyState.tipGeneric`, and `emptyState.tipBrand`.

#### Scenario: Tips card renders with all three suggestions

- **WHEN** the EmptyState component renders
- **THEN** it SHALL display a tips heading from `emptyState.tipHeading`
- **AND** it SHALL list three suggestions: check spelling (`emptyState.tipSpelling`), try the generic name (`emptyState.tipGeneric`), and try the brand name (`emptyState.tipBrand`)

### Requirement: EmptyState is styled consistently with result cards

The EmptyState component SHALL use visual styling consistent with the existing result card pattern — rounded corners, padding, and a muted background — so it feels like a natural part of the search result area.

#### Scenario: Empty state card uses consistent styling

- **WHEN** the EmptyState component renders
- **THEN** it SHALL have rounded corners (`rounded-lg`) and padding (`p-4`)
- **AND** it SHALL use a muted background color consistent with the neutral card style

### Requirement: EmptyState is accessible

The EmptyState component SHALL be accessible to screen readers. The component SHALL use `role="status"` and `aria-live="polite"` so that the empty-state message is announced after a search completes with no results.

#### Scenario: Screen reader announces empty state

- **WHEN** a search completes with zero results and the EmptyState component renders
- **THEN** the component SHALL have `role="status"` and `aria-live="polite"`
- **AND** screen readers SHALL announce the empty-state message

### Requirement: SearchBar detects empty result set

The SearchBar component SHALL detect when the CIMA API returns an empty `resultados` array and transition the search state to `{ status: "empty", query: <search term> }`. No API route changes are required — the detection logic is entirely frontend-side.

#### Scenario: CIMA returns empty resultados array

- **WHEN** the user searches for "xyznonexistent" and the API responds with `{ resultados: [] }`
- **THEN** the SearchBar SHALL set the search state to `{ status: "empty", query: "xyznonexistent" }`
- **AND** the EmptyState component SHALL render with the query value

#### Scenario: CIMA returns non-empty resultados array

- **WHEN** the user searches for "ibuprofeno" and the API responds with `{ resultados: [...] }` where the array has items
- **THEN** the SearchBar SHALL set the search state to `{ status: "success", results: [...] }`
- **AND** the EmptyState component SHALL NOT render
