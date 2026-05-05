## ADDED Requirements

### Requirement: AEMPS attribution is visible on the page

The application SHALL display a visible attribution line "Datos proporcionados por la AEMPS" to credit the data source. This attribution SHALL be rendered as secondary/subtle text below the main content area.

#### Scenario: Attribution is visible to users

- **WHEN** a user loads the application
- **THEN** the page SHALL display the text "Datos proporcionados por la AEMPS"

#### Scenario: Attribution is accessible to screen readers

- **WHEN** a screen reader navigates the page
- **THEN** the attribution text SHALL be announced as part of the page content

#### Scenario: Attribution styling is secondary

- **WHEN** the attribution is rendered
- **THEN** it SHALL appear with small text size and muted color, visually subordinate to the main content
