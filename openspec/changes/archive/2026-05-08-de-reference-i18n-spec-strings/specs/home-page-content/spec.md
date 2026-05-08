## MODIFIED Requirements

### Requirement: AINE explainer section

The homepage SHALL include an informational section with the heading from i18n key `explainer.heading` that explains what NSAIDs (AINE) are, lists common examples (ibuprofen, aspirin, naproxen), notes they are one of the most commonly prescribed and over-the-counter drug groups, and states that for someone with a AINE allergy, even a single dose can cause a severe reaction. The body text SHALL come from i18n key `explainer.body`.

#### Scenario: Explainer section is visible on landing page

- **WHEN** a user loads the application on the homepage with no search active
- **THEN** the page SHALL display a section with heading from i18n key `explainer.heading`
- **AND** the section SHALL contain text explaining that AINE are antiinflamatorios no esteroideos, listing common examples, and noting the allergy risk

#### Scenario: Explainer remains visible after search

- **WHEN** a user has performed a search and results are displayed
- **THEN** the explainer section SHALL remain visible below the result cards

### Requirement: Medical disclaimer callout

The homepage SHALL include a prominent disclaimer callout with the heading and body from i18n keys `disclaimer.heading` and `disclaimer.body`. The disclaimer SHALL be visually distinct from regular body text (e.g., using a callout/bordered box style). The heading in the message catalog SHALL contain a warning emoji prefix.

#### Scenario: Disclaimer is visible on landing page

- **WHEN** a user loads the application
- **THEN** the page SHALL display a disclaimer callout containing a warning about the tool being informational and not replacing professional advice

#### Scenario: Disclaimer is accessible

- **WHEN** a screen reader navigates the page
- **THEN** the disclaimer content SHALL be announced in the page reading order

### Requirement: Data source attribution with lastUpdated date

The homepage SHALL display a data source line crediting AEMPS (CIMA) and showing the date the AINE classification data was last updated, sourced from i18n key `dataSource.attribution` with ICU interpolation for `{date}`, using the `lastUpdated` export from `data/aine-classification.ts`.

#### Scenario: Attribution shows lastUpdated date

- **WHEN** the homepage renders
- **THEN** a data source line SHALL display the string from i18n key `dataSource.attribution` with the `{date}` placeholder replaced by the `lastUpdated` date from the AINE classification data

#### Scenario: Attribution updates when data is regenerated

- **WHEN** the AINE classification data is regenerated with a new date
- **AND** the application is rebuilt
- **THEN** the displayed date SHALL match the new `lastUpdated` value
