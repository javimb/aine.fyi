## MODIFIED Requirements

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
