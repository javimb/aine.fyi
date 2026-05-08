## MODIFIED Requirements

### Requirement: Result card status-driven layout

Each search result SHALL be rendered as a `<div>` card with a tinted background matching the status and a status banner as the card header. The card SHALL NOT have a left border. The card SHALL display the medication name as a heading. Below the heading, the card SHALL display a pills section that renders all active ingredients as CompoundPill elements. The pills section container SHALL have `role="list"` and `aria-label` sourced from i18n key `status.activeIngredientsLabel` for screen reader accessibility. RED/AMBER active ingredients SHALL render as status-colored pills with name and family. All other active ingredients SHALL render as NEUTRAL pills with name only. The raw `pactivos` comma-separated string SHALL NOT be displayed. A visible label for the pills section SHALL NOT appear.

#### Scenario: RED result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"RED"`
- **THEN** the card SHALL have `bg-status-red-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display the string from i18n key `status.RED.banner` in `text-status-red` color
- **AND** the medication name SHALL display as a heading
- **AND** the pills section SHALL have `role="list"` and `aria-label` from i18n key `status.activeIngredientsLabel`
- **AND** all active ingredient tokens from `pactivos` SHALL be rendered as pills (RED/AMBER/NEUTRAL based on classification)

#### Scenario: AMBER result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"AMBER"`
- **THEN** the card SHALL have `bg-status-amber-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display the string from i18n key `status.AMBER.banner` in `text-status-amber` color
- **AND** the medication name and active ingredient pills SHALL display

#### Scenario: GREEN result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"GREEN"`
- **THEN** the card SHALL have `bg-status-green-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display the string from i18n key `status.GREEN.banner` in `text-status-green` color
- **AND** the medication name and active ingredient pills SHALL display (all as NEUTRAL)

#### Scenario: YELLOW result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"YELLOW"`
- **THEN** the card SHALL have `bg-status-yellow-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display the string from i18n key `status.YELLOW.banner` in `text-status-yellow` color
- **AND** the medication name and active ingredient pills SHALL display (all as NEUTRAL)

### Requirement: Contextual warning messages per status

Each result card for RED, AMBER, and YELLOW statuses SHALL display a contextual warning message sourced from i18n key `status.<statusLevel>.message` below the composition and compound pills. The message SHALL use the corresponding status text color. For RED, AMBER, and YELLOW statuses, the message from the catalog SHALL include a warning emoji prefix. GREEN results SHALL display the message from i18n key `status.GREEN.message` without a warning icon.

#### Scenario: RED result displays warning message

- **WHEN** a RED result card renders
- **THEN** it SHALL display the string from i18n key `status.RED.message` in `text-status-red`

#### Scenario: AMBER result displays warning message

- **WHEN** an AMBER result card renders
- **THEN** it SHALL display the string from i18n key `status.AMBER.message` in `text-status-amber`

#### Scenario: YELLOW result displays warning message

- **WHEN** a YELLOW result card renders
- **THEN** it SHALL display the string from i18n key `status.YELLOW.message` in `text-status-yellow`

#### Scenario: GREEN result displays safe message

- **WHEN** a GREEN result card renders
- **THEN** it SHALL display the string from i18n key `status.GREEN.message` in `text-status-green`
- **AND** it SHALL NOT display a separate warning icon beyond what is in the message text

### Requirement: Result list displays all matching drugs

After a search, all matching medications from the CIMA API SHALL be displayed as a list of result cards. A result count SHALL be shown above the list, sourced from i18n key `results.count` with ICU plural formatting.

#### Scenario: Multiple results render as a list

- **WHEN** a search returns 3 matching medications
- **THEN** 3 result cards SHALL render in a vertical list with spacing between them
- **AND** the result count heading from i18n key `results.count` SHALL appear above the list with the plural form

#### Scenario: Single result renders

- **WHEN** a search returns 1 matching medication
- **THEN** 1 result card SHALL render
- **AND** the result count heading from i18n key `results.count` SHALL appear above the card with the singular form

### Requirement: Result cards are accessible

Each result card SHALL have `role="article"` with an `aria-label` that includes the medication name and the string from i18n key `status.<statusLevel>.ariaLabel`. The status banner text SHALL be readable by screen readers without relying on color alone. The warning message SHALL be in the accessible name of the card.

#### Scenario: Screen reader announces result card

- **WHEN** a screen reader user navigates to a result card for "Ibuprofeno 400mg" with status RED
- **THEN** the card SHALL be announced as an article with label including "Ibuprofeno 400mg" and the string from i18n key `status.RED.ariaLabel`
