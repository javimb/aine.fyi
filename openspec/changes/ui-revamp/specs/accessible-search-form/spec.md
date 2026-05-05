## MODIFIED Requirements

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

The search input SHALL have proper accessible labeling. In hero mode, a visible `<label>` or `aria-label` SHALL identify the input. In compact mode, the same accessible name SHALL persist.

#### Scenario: Screen reader identifies the input

- **WHEN** a screen reader user focuses on the search input
- **THEN** the input SHALL be announced with an accessible name indicating it is a medication search field

### Requirement: Search bar has hero and compact modes

The search bar SHALL render in a large, prominent hero mode when no search has been performed (centered on the page with larger sizing) and transition to a compact mode at the top of the results view after a search is submitted. The hero mode SHALL be the default on the landing page. The compact mode SHALL show the search query pre-filled and results below.

#### Scenario: Search bar in hero mode on landing

- **WHEN** the user first loads the page with no search active
- **THEN** the search bar SHALL render in hero mode — large input (`h-12`), centered within the viewport, visually prominent
- **AND** the page title and subtitle SHALL be visible above the search bar as part of a cohesive hero section
- **AND** the hero section (title + subtitle + search bar) SHALL be centered both horizontally and vertically, filling the viewport height with `min-h-dvh`
- **AND** the hero section SHALL use `max-w-2xl mx-auto` for horizontal centering

#### Scenario: Search bar in compact mode after search

- **WHEN** the user submits a search and results are displayed
- **THEN** the search bar SHALL render in compact mode — smaller input (`h-10`), positioned above results
- **AND** the search query SHALL remain in the input field
- **AND** the compact search bar and results SHALL be centered horizontally with `max-w-2xl mx-auto`
- **AND** the page layout SHALL transition from the full-viewport hero to a top-aligned, centered content layout

#### Scenario: Hero mode is restored on clear

- **WHEN** the user clears the search query and there are no results
- **THEN** the search bar SHALL return to hero mode
- **AND** the hero section SHALL re-center vertically with `min-h-dvh`

### Requirement: Error and loading states are accessible

When the search form is in a loading state, the submit button SHALL indicate loading both visually (disabled state with "Buscando..." text) and to screen readers (`aria-busy="true"` on the form). When an error occurs, the error message SHALL be announced via `aria-live="polite"` and use `role="alert"`.

#### Scenario: Loading state accessibility

- **WHEN** a search request is in progress
- **THEN** the form SHALL have `aria-busy="true"`
- **AND** the submit button SHALL be disabled with text "Buscando..."

#### Scenario: Error state accessibility

- **WHEN** a search error occurs
- **THEN** the error message SHALL have `role="alert"` and `aria-live="polite"`
