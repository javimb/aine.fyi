# Result Display

## Purpose

Rendering medication search results — status-driven result cards with color-coded backgrounds, banners, active ingredient pills with title-case normalization, warning icon components, and contextual messages.

## Requirements

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

### Requirement: Title-case normalization for display

The system SHALL provide a `toTitleCase` function that converts UPPERCASE or mixed-case strings to title case for display. It SHALL capitalize the first letter of each word, lowercase the rest, and keep Spanish minor words (de, del, en, con, para, por, e, y) in lowercase when not the first word of the string.

#### Scenario: Simple single-word title case

- **WHEN** `toTitleCase` is called with `"IBUPROFENO"`
- **THEN** it SHALL return `"Ibuprofeno"`

#### Scenario: Multi-word title case

- **WHEN** `toTitleCase` is called with `"DICLOFENACO SODICO"`
- **THEN** it SHALL return `"Diclofenaco Sodico"`

#### Scenario: Spanish minor words preserved lowercase

- **WHEN** `toTitleCase` is called with `"HIDROXIDO DE ALUMINIO"`
- **THEN** it SHALL return `"Hidroxido de Aluminio"`

#### Scenario: Minor word as first word is capitalized

- **WHEN** `toTitleCase` is called with `"DE MEXICO"`
- **THEN** it SHALL return `"De Mexico"`

#### Scenario: Already title-cased string is idempotent

- **WHEN** `toTitleCase` is called with `"Ibuprofeno"`
- **THEN** it SHALL return `"Ibuprofeno"`

### Requirement: Active ingredient pills display all principios activos

The result card SHALL display all principios activos from the `pactivos` field as individual pills in a unified section. The pills section container SHALL have `role="list"` and `aria-label` sourced from i18n key `status.activeIngredientsLabel` for screen reader accessibility. Each token (split by comma from `pactivos`) SHALL be correlated against `matchedAines` using normalized matching. Tokens that match a RED or AMBER entry SHALL render as a status-colored CompoundPill. Tokens that do not match any RED/AMBER entry (GREEN or unknown) SHALL render as a neutral CompoundPill. A visible label for the pills section SHALL NOT appear.

#### Scenario: RED result shows RED pill for matched active ingredient

- **WHEN** a result has `pactivos: "IBUPROFENO"` and `matchedAines: [{name: "IBUPROFENO", family: "Derivados del acido propionico", level: "RED"}]`
- **THEN** the pills section SHALL have `aria-label` from i18n key `status.activeIngredientsLabel`
- **AND** SHALL render a RED-styled CompoundPill with title-cased name `"Ibuprofeno"` and title-cased family `"Derivados del Acido Propionico"`

#### Scenario: GREEN result shows only neutral pills

- **WHEN** a result has `pactivos: "PARACETAMOL"` and `matchedAines: []` and status `"GREEN"`
- **THEN** the pills section SHALL have `aria-label` from i18n key `status.activeIngredientsLabel`
- **AND** SHALL render a single NEUTRAL-styled CompoundPill with title-cased name `"Paracetamol"` and no family text

#### Scenario: Mixed result shows both RED and neutral pills

- **WHEN** a result has `pactivos: "IBUPROFENO, PARACETAMOL"` and `matchedAines: [{name: "IBUPROFENO", family: "Derivados del acido propionico", level: "RED"}]`
- **THEN** "Ibuprofeno" as a RED pill and "Paracetamol" as a NEUTRAL pill SHALL render in the same row

#### Scenario: YELLOW result with unknown active ingredient shows neutral pill

- **WHEN** a result has `pactivos: "UNKNOWN_COMPOUND"` and `matchedAines: []` and status `"YELLOW"`
- **THEN** the card SHALL render "Unknown Compound" as a NEUTRAL pill

### Requirement: CompoundPill supports NEUTRAL level

The CompoundPill component SHALL accept a `level` prop with values `"RED"`, `"AMBER"`, or `"NEUTRAL"`. When `level` is `"NEUTRAL"`, the pill SHALL render with muted background and text styling, SHALL NOT display a family name or dot separator, and SHALL use `role="listitem"` with `aria-label` containing only the name.

#### Scenario: Neutral pill renders without family

- **WHEN** a CompoundPill is rendered with `name="Paracetamol"`, `family=""`, and `level="NEUTRAL"`
- **THEN** it SHALL display only `"Paracetamol"` with muted styling
- **AND** SHALL have `role="listitem"` and `aria-label="Paracetamol"`

#### Scenario: RED pill still shows family

- **WHEN** a CompoundPill is rendered with `name="Ibuprofeno"`, `family="Derivados del acido propionico"`, and `level="RED"`
- **THEN** it SHALL display `"Ibuprofeno · Derivados del Acido Propionico"` with RED styling
- **AND** SHALL have `aria-label="Ibuprofeno, Derivados del Acido Propionico"`

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

#### Scenario: New locale files follow no-emoji convention

- **WHEN** a developer creates a new locale file (e.g., `messages/ca-ES.json`)
- **THEN** no string value in the file SHALL contain emoji characters
