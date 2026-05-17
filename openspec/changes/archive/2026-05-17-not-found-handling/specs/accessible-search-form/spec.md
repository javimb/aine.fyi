# Accessible Search Form

## MODIFIED Requirements

### Requirement: Search bar is single-mode with auto-scroll to results

The search bar SHALL always render at the same size (large, prominent, `h-12`) on the hero-landing page. There is no separate compact mode. After a search is submitted and feedback is displayed (results, empty state, or error state), the page SHALL auto-scroll smoothly to the feedback section so the user can see it without manual scrolling. The search bar, title, and subtitle remain visible above the feedback — the layout does not change between states.

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

#### Scenario: Auto-scroll to empty state after search

- **WHEN** the user submits a search and the result set is empty
- **THEN** the page SHALL smoothly scroll to the empty state section automatically
- **AND** the search bar, title, and subtitle SHALL remain visible above the empty state

#### Scenario: Auto-scroll to error state after failed search

- **WHEN** the user submits a search and an API error occurs
- **THEN** the page SHALL smoothly scroll to the error state section automatically
- **AND** the search bar, title, and subtitle SHALL remain visible above the error state

### Requirement: Error and loading states are accessible

When the search form is in a loading state, the submit button SHALL indicate loading both visually (disabled state with the text from i18n key `search.buttonLoading`) and to screen readers (`aria-busy="true"` on the form). When an error occurs, the error message from i18n key `search.error` SHALL be announced via `aria-live="polite"` and use `role="alert"`. The search form SHALL manage state using a discriminated union type `SearchState` (`idle | loading | success | empty | error`) so that each state is mutually exclusive and the correct feedback component renders below the form.

#### Scenario: Loading state accessibility

- **WHEN** a search request is in progress
- **THEN** the form SHALL have `aria-busy="true"`
- **AND** the submit button SHALL be disabled with text from i18n key `search.buttonLoading`
- **AND** the search state SHALL be `{ status: "loading" }`

#### Scenario: Error state accessibility

- **WHEN** a search error occurs
- **THEN** the error message from i18n key `search.error` SHALL have `role="alert"` and `aria-live="polite"`
- **AND** the search state SHALL be `{ status: "error", message: <error text> }`

#### Scenario: Success state

- **WHEN** a search returns results
- **THEN** the search state SHALL be `{ status: "success", results: [...] }`
- **AND** the ResultList component SHALL render below the search form

#### Scenario: Empty state

- **WHEN** a search returns zero results
- **THEN** the search state SHALL be `{ status: "empty", query: <search term> }`
- **AND** the EmptyState component SHALL render below the search form
