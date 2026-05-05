# AEMPS Attribution

## Purpose

Display a visible attribution line crediting AEMPS as the data source, rendered as secondary/subtle text.

## Requirements

### Requirement: AEMPS attribution is visible on the page

The application SHALL display a data source line crediting AEMPS as the data source. The attribution SHALL include the text "Datos: AEMPS (CIMA)" followed by "· Actualizado:" and the `lastUpdated` date from `data/aine-classification.ts`. The attribution SHALL be rendered as part of the homepage footer section, styled as secondary/subtle text.

#### Scenario: Attribution is visible to users

- **WHEN** a user loads the application
- **THEN** the page SHALL display "Datos: AEMPS (CIMA) · Actualizado:" followed by the classification data date

#### Scenario: Attribution is accessible to screen readers

- **WHEN** a screen reader navigates the page
- **THEN** the attribution text SHALL be announced as part of the page content

#### Scenario: Attribution styling is secondary

- **WHEN** the attribution is rendered
- **THEN** it SHALL appear with small text size and muted color, visually subordinate to the main content
