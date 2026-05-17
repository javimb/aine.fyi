# Search Error State

## Purpose

Display a styled error message with a retry button when the CIMA API call fails, so users understand something went wrong and can re-attempt the search without re-typing their query.

## ADDED Requirements

### Requirement: ErrorState displays error message

When a search request fails (network error or non-2xx response), the application SHALL render an `ErrorState` component that displays the error message provided to it via the `message` prop.

#### Scenario: API returns non-2xx status

- **WHEN** the CIMA API responds with a 502 or other non-2xx status
- **THEN** the ErrorState component SHALL render with the error message from the `message` prop
- **AND** the message SHALL be displayed prominently

#### Scenario: Network error occurs

- **WHEN** the fetch call throws a network error (e.g., no connectivity)
- **THEN** the ErrorState component SHALL render with the error message from i18n key `search.error`

### Requirement: ErrorState provides retry button

The ErrorState component SHALL include a "Reintentar" button (label from i18n key `errorState.retry`) that invokes the `onRetry` callback when clicked, allowing the user to re-submit their last search without re-typing it.

#### Scenario: User clicks retry after API error

- **WHEN** the user clicks the "Reintentar" button in the ErrorState component
- **THEN** the `onRetry` callback SHALL be invoked
- **AND** the search SHALL be re-submitted with the same query
- **AND** the search state SHALL transition to `{ status: "loading" }`

### Requirement: ErrorState is visually distinct from EmptyState

The ErrorState component SHALL be visually distinct from the EmptyState component. It SHALL use the `text-status-red` color and include a `WarningIcon` to signal an error condition at a glance.

#### Scenario: Error state uses red color and warning icon

- **WHEN** the ErrorState component renders
- **THEN** it SHALL use `text-status-red` for the error message text
- **AND** it SHALL display a `WarningIcon` before the error message
- **AND** the styling SHALL be visually distinct from the EmptyState component

### Requirement: ErrorState is accessible

The ErrorState component SHALL be accessible to screen readers. The error message SHALL have `role="alert"` and `aria-live="polite"` so that the error is announced automatically.

#### Scenario: Screen reader announces error state

- **WHEN** a search fails and the ErrorState component renders
- **THEN** the error message container SHALL have `role="alert"` and `aria-live="polite"`
- **AND** screen readers SHALL announce the error message

### Requirement: SearchBar transitions to error state on failure

The SearchBar component SHALL detect API errors and transition the search state to `{ status: "error", message: <error text> }`. The `onRetry` callback passed to ErrorState SHALL re-trigger the search with the current query value.

#### Scenario: SearchBar transitions to error state

- **WHEN** the fetch to `/api/cima` fails
- **THEN** the SearchBar SHALL set the search state to `{ status: "error", message: <error text> }`
- **AND** the ErrorState component SHALL render below the search form
- **AND** the search form SHALL remain visible with the query still in the input field

#### Scenario: Retry re-submits the same query

- **WHEN** the user clicks "Reintentar" in the ErrorState
- **THEN** the SearchBar SHALL set the search state to `{ status: "loading" }`
- **AND** SHALL re-submit a fetch to `/api/cima?nombre=<original query>`
- **AND** the input field SHALL retain the original query value
