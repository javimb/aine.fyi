## ADDED Requirements

### Requirement: AINE explainer section

The homepage SHALL include an informational section with the heading "¿Qué son los AINE?" that explains what NSAIDs (AINE) are, lists common examples (ibuprofen, aspirin, naproxen), notes they are one of the most commonly prescribed and over-the-counter drug groups, and states that for someone with a AINE allergy, even a single dose can cause a severe reaction.

#### Scenario: Explainer section is visible on landing page

- **WHEN** a user loads the application on the homepage with no search active
- **THEN** the page SHALL display a section with heading "¿Qué son los AINE?"
- **AND** the section SHALL contain text explaining that AINE are antiinflamatorios no esteroideos, listing common examples, and noting the allergy risk

#### Scenario: Explainer remains visible after search

- **WHEN** a user has performed a search and results are displayed
- **THEN** the explainer section SHALL remain visible below the result cards

### Requirement: Medical disclaimer callout

The homepage SHALL include a prominent disclaimer callout with a warning icon (⚠️) stating that this tool is informational and does not replace professional medical advice, that the user should always verify the physical medication leaflet, and that they should consult a doctor or pharmacist. The disclaimer SHALL be visually distinct from regular body text (e.g., using a callout/bordered box style).

#### Scenario: Disclaimer is visible on landing page

- **WHEN** a user loads the application
- **THEN** the page SHALL display a disclaimer callout containing a warning about the tool being informational and not replacing professional advice

#### Scenario: Disclaimer is accessible

- **WHEN** a screen reader navigates the page
- **THEN** the disclaimer content SHALL be announced in the page reading order

### Requirement: Data source attribution with lastUpdated date

The homepage SHALL display a data source line crediting AEMPS (CIMA) and showing the date the AINE classification data was last updated, using the `lastUpdated` export from `data/aine-classification.ts`. The format SHALL be "Datos: AEMPS (CIMA) · Actualizado: YYYY-MM-DD".

#### Scenario: Attribution shows lastUpdated date

- **WHEN** the homepage renders
- **THEN** a data source line SHALL display "Datos: AEMPS (CIMA) · Actualizado:" followed by the `lastUpdated` date from the AINE classification data

#### Scenario: Attribution updates when data is regenerated

- **WHEN** the AINE classification data is regenerated with a new date
- **AND** the application is rebuilt
- **THEN** the displayed date SHALL match the new `lastUpdated` value

### Requirement: Mobile-first responsive layout

All homepage sections SHALL be designed mobile-first with full-width content on viewports below 640px and centered content with `max-w-2xl` on viewports 640px and above. The search bar in hero mode SHALL be full-width on mobile.

#### Scenario: Homepage renders on mobile viewport

- **WHEN** the page renders on a 375px viewport
- **THEN** all sections SHALL be full-width with appropriate padding
- **AND** the hero search bar SHALL be full-width within the content area

#### Scenario: Homepage renders on desktop viewport

- **WHEN** the page renders on a 1024px viewport
- **THEN** the content SHALL be centered with `max-w-2xl` (672px maximum)
