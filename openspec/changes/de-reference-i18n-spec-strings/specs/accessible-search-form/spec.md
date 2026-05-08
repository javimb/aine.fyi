## MODIFIED Requirements

### Requirement: Error and loading states are accessible

When the search form is in a loading state, the submit button SHALL indicate loading both visually (disabled state with the text from i18n key `search.buttonLoading`) and to screen readers (`aria-busy="true"` on the form). When an error occurs, the error message from i18n key `search.error` SHALL be announced via `aria-live="polite"` and use `role="alert"`.

#### Scenario: Loading state accessibility

- **WHEN** a search request is in progress
- **THEN** the form SHALL have `aria-busy="true"`
- **AND** the submit button SHALL be disabled with text from i18n key `search.buttonLoading`

#### Scenario: Error state accessibility

- **WHEN** a search error occurs
- **THEN** the error message from i18n key `search.error` SHALL have `role="alert"` and `aria-live="polite"`
