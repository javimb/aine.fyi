## MODIFIED Requirements

### Requirement: Medical disclaimer callout

The homepage SHALL include a prominent disclaimer callout with the heading and body from i18n keys `disclaimer.heading` and `disclaimer.body`. The disclaimer SHALL be visually distinct from regular body text (e.g., using a callout/bordered box style). The heading string from the message catalog SHALL NOT contain a warning emoji prefix. A `<WarningIcon />` component SHALL be rendered immediately before the heading text within a flex container with `gap-1`.

#### Scenario: Disclaimer is visible on landing page

- **WHEN** a user loads the application
- **THEN** the page SHALL display a disclaimer callout containing a warning about the tool being informational and not replacing professional advice
- **AND** a `<WarningIcon />` SHALL be rendered before the heading text

#### Scenario: Disclaimer is accessible

- **WHEN** a screen reader navigates the page
- **THEN** the disclaimer content SHALL be announced in the page reading order
- **AND** the `<WarningIcon />` SHALL NOT be announced (it SHALL have `aria-hidden="true"`)
