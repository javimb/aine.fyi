## MODIFIED Requirements

### Requirement: Result card status-driven layout

Each search result SHALL be rendered as a `<div>` card with a tinted background matching the status and a status banner as the card header. The card SHALL NOT have a left border. The card SHALL display the medication name as a heading. Below the heading, the card SHALL display a pills section that renders all active ingredients as CompoundPill elements. The pills section container SHALL have `role="list"` and `aria-label="Principios activos"` for screen reader accessibility. RED/AMBER active ingredients SHALL render as status-colored pills with name and family. All other active ingredients SHALL render as NEUTRAL pills with name only. The raw `pactivos` comma-separated string SHALL NOT be displayed. A visible "Principios activos:" label SHALL NOT appear.

#### Scenario: RED result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"RED"`
- **THEN** the card SHALL have `bg-status-red-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display "🔴 AINE DETECTADO" in `text-status-red` color
- **AND** the medication name SHALL display as a heading
- **AND** the pills section SHALL have `role="list"` and `aria-label="Principios activos"`
- **AND** all active ingredient tokens from `pactivos` SHALL be rendered as pills (RED/AMBER/NEUTRAL based on classification)

#### Scenario: AMBER result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"AMBER"`
- **THEN** the card SHALL have `bg-status-amber-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display "🟠 SALICILATO DETECTADO" in `text-status-amber` color
- **AND** the medication name and active ingredient pills SHALL display

#### Scenario: GREEN result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"GREEN"`
- **THEN** the card SHALL have `bg-status-green-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display "🟢 LIBRE DE AINE" in `text-status-green` color
- **AND** the medication name and active ingredient pills SHALL display (all as NEUTRAL)

#### Scenario: YELLOW result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"YELLOW"`
- **THEN** the card SHALL have `bg-status-yellow-bg` with rounded corners and padding
- **AND** SHALL NOT have a left border
- **AND** a status banner SHALL display "🟡 NO PUDIMOS VERIFICAR" in `text-status-yellow` color
- **AND** the medication name and active ingredient pills SHALL display (all as NEUTRAL)
