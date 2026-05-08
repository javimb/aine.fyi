## MODIFIED Requirements

### Requirement: Contextual warning messages per status

Each result card for RED, AMBER, and YELLOW statuses SHALL display a contextual warning message sourced from i18n key `status.<statusLevel>.message` below the composition and compound pills. The message SHALL use the corresponding status text color. For RED, AMBER, and YELLOW statuses, a `<WarningIcon />` component SHALL be rendered immediately before the message text within a flex container with `gap-1`. The message string from the catalog SHALL NOT contain a warning emoji prefix. GREEN results SHALL display the message from i18n key `status.GREEN.message` without a warning icon.

#### Scenario: RED result displays warning message

- **WHEN** a RED result card renders
- **THEN** it SHALL display the string from i18n key `status.RED.message` in `text-status-red`
- **AND** a `<WarningIcon />` SHALL be rendered before the message text

#### Scenario: AMBER result displays warning message

- **WHEN** an AMBER result card renders
- **THEN** it SHALL display the string from i18n key `status.AMBER.message` in `text-status-amber`
- **AND** a `<WarningIcon />` SHALL be rendered before the message text

#### Scenario: YELLOW result displays warning message

- **WHEN** a YELLOW result card renders
- **THEN** it SHALL display the string from i18n key `status.YELLOW.message` in `text-status-yellow`
- **AND** a `<WarningIcon />` SHALL be rendered before the message text

#### Scenario: GREEN result displays safe message

- **WHEN** a GREEN result card renders
- **THEN** it SHALL display the string from i18n key `status.GREEN.message` in `text-status-green`
- **AND** it SHALL NOT display a `<WarningIcon />`
