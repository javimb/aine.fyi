# Accessible Search Form

## Purpose

Ensure the search form is accessible to screen readers by providing Spanish-language ARIA labels on both the `<form>` and `<input>` elements, using shadcn/ui components, supporting a single-mode layout with auto-scroll to results, and providing accessible error and loading states.

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

When the search form is in a loading state, the submit button SHALL indicate loading both visually (disabled state with "Buscando..." text) and to screen readers (`aria-busy="true"` on the form). When an error occurs, the error message SHALL be announced via `aria-live="polite"` and use `role="alert"`.

#### Scenario: Loading state accessibility

- **WHEN** a search request is in progress
- **THEN** the form SHALL have `aria-busy="true"`
- **AND** the submit button SHALL be disabled with text "Buscando..."

#### Scenario: Error state accessibility

- **WHEN** a search error occurs
- **THEN** the error message SHALL have `role="alert"` and `aria-live="polite"`
