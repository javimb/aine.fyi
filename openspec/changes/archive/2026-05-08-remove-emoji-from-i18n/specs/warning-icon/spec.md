## ADDED Requirements

### Requirement: WarningIcon presentational component

The application SHALL provide a `WarningIcon` component (at `src/components/warning-icon.tsx`) that renders the ⚠️ Unicode character as a purely visual indicator. The component SHALL apply `aria-hidden="true"` to the wrapper element so that screen readers do not announce the warning glyph. The component SHALL NOT have any semantic role attribute.

#### Scenario: WarningIcon renders with aria-hidden

- **WHEN** a `<WarningIcon />` is rendered in any context
- **THEN** it SHALL render a `<span>` element containing the ⚠️ character
- **AND** the `<span>` SHALL have `aria-hidden="true"`

#### Scenario: WarningIcon is not announced by screen readers

- **WHEN** a screen reader navigates past a `<WarningIcon />`
- **THEN** the ⚠️ glyph SHALL NOT be announced

### Requirement: No emoji characters in message catalog

The message catalog (`messages/es-ES.json`) SHALL NOT contain emoji characters in any string value. All strings SHALL be plain text. Visual indicators (status circles, warning icons) SHALL be rendered by components, not embedded in translatable content.

#### Scenario: Message catalog contains no emoji

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** no string value SHALL contain emoji characters (including but not limited to 🔴, 🟠, 🟢, 🟡, ⚠️)

#### Scenario: Status banner strings are plain text

- **WHEN** a result card renders with any status level (RED, AMBER, GREEN, YELLOW)
- **THEN** the banner text from `status.<statusLevel>.banner` SHALL be plain text without emoji prefixes
- **AND** the visual status signal SHALL come from the card's background color and text color styling alone

#### Scenario: Warning message strings are plain text

- **WHEN** a result card with RED, AMBER, or YELLOW status renders its contextual message
- **THEN** the message text from `status.<statusLevel>.message` SHALL be plain text without emoji prefixes
- **AND** a `<WarningIcon />` component SHALL be rendered immediately before the message text within a flex container with `gap-1`

#### Scenario: Disclaimer heading is plain text

- **WHEN** the disclaimer callout renders
- **THEN** the heading text from `disclaimer.heading` SHALL be plain text without emoji prefixes
- **AND** a `<WarningIcon />` component SHALL be rendered immediately before the heading text within a flex container with `gap-1`

### Requirement: New locale files follow no-emoji convention

Any future locale file added to the `messages/` directory SHALL contain only plain text string values. Emoji and other visual indicators SHALL NOT be included in translation strings.

#### Scenario: Adding a new locale

- **WHEN** a developer creates a new locale file (e.g., `messages/ca-ES.json`)
- **THEN** no string value in the file SHALL contain emoji characters
