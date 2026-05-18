# Empty Results Display

## Purpose

Display a neutral "not found" message with screen reader support when a medication search returns zero results from the CIMA API.

## Requirements

### Requirement: EmptyResults component renders neutral not-found message

The application SHALL provide an `EmptyResults` client component (at `src/components/empty-results.tsx`) that renders a neutral/muted styled message when a medication search returns zero results. The component SHALL source its message text from i18n key `search.emptyResults`. The component SHALL NOT use any status color tint (RED, AMBER, GREEN, YELLOW) — the empty state is visually distinct from the YELLOW uncertain status. The component SHALL render within the same `w-full max-w-2xl` container as the search results, below the search form.

#### Scenario: EmptyResults renders with neutral styling

- **WHEN** a search returns zero results
- **THEN** the EmptyResults component SHALL render a message with neutral/muted text styling
- **AND** SHALL NOT have any status color background or text tint
- **AND** the message text SHALL come from i18n key `search.emptyResults`

#### Scenario: EmptyResults does not render when results exist

- **WHEN** a search returns one or more results
- **THEN** the EmptyResults component SHALL NOT render

### Requirement: EmptyResults is accessible to screen readers

The EmptyResults component SHALL announce the "not found" message to screen readers automatically. The component SHALL use `role="status"` and `aria-live="polite"` so that assistive technology announces the empty state after a search completes with no matches.

#### Scenario: Screen reader announces empty state

- **WHEN** a search completes with zero results
- **THEN** the EmptyResults message element SHALL have `role="status"`
- **AND** the message element SHALL have `aria-live="polite"`
- **AND** screen readers SHALL announce the message content automatically

### Requirement: i18n key for empty results message

The message catalog (`messages/es-ES.json`) SHALL contain a `search.emptyResults` key with a Spanish-language message informing the user that no medications were found and suggesting they check the spelling. The message SHALL be plain text without emoji characters, consistent with the no-emoji convention for all message catalog strings.

#### Scenario: Empty results message is defined in catalog

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the key `search.emptyResults` SHALL exist with a plain text message in Spanish
- **AND** the message SHALL NOT contain emoji characters
