## MODIFIED Requirements

### Requirement: Result card status-driven layout

Each search result SHALL be rendered as a `<div>` card with a thick left border (4px) in the corresponding status color, a tinted background matching the status, and a status banner as the card header. The card SHALL display the medication name as a heading. Below the heading, the card SHALL display a "Principios activos:" label followed by a pills section that renders all active ingredients as CompoundPill elements. RED/AMBER active ingredients SHALL render as status-colored pills with name and family. All other active ingredients SHALL render as NEUTRAL pills with name only. The raw `pactivos` comma-separated string SHALL NOT be displayed.

#### Scenario: RED result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"RED"`
- **THEN** the card SHALL have `border-l-4 border-l-status-red-border bg-status-red-bg`
- **AND** a status banner SHALL display "🔴 AINE DETECTADO" in `text-status-red` color
- **AND** the medication name SHALL display as a heading
- **AND** a "Principios activos:" label SHALL appear below the heading
- **AND** all active ingredient tokens from `pactivos` SHALL be rendered as pills (RED/AMBER/NEUTRAL based on classification)

#### Scenario: AMBER result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"AMBER"`
- **THEN** the card SHALL have `border-l-4 border-l-status-amber-border bg-status-amber-bg`
- **AND** a status banner SHALL display "🟠 SALICILATO DETECTADO" in `text-status-amber` color
- **AND** the medication name and active ingredient pills SHALL display

#### Scenario: GREEN result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"GREEN"`
- **THEN** the card SHALL have `border-l-4 border-l-status-green-border bg-status-green-bg`
- **AND** a status banner SHALL display "🟢 LIBRE DE AINE" in `text-status-green` color
- **AND** the medication name and active ingredient pills SHALL display (all as NEUTRAL)

#### Scenario: YELLOW result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"YELLOW"`
- **THEN** the card SHALL have `border-l-4 border-l-status-yellow-border bg-status-yellow-bg`
- **AND** a status banner SHALL display "🟡 NO PUDIMOS VERIFICAR" in `text-status-yellow` color
- **AND** the medication name and active ingredient pills SHALL display (all as NEUTRAL)

## REMOVED Requirements

### Requirement: Compound pills for matched AINE compounds

**Reason**: Replaced by the new active-ingredient-pills capability which renders ALL active ingredients as pills, not just RED/AMBER matched ones. The new approach unifies the display into a single section.

**Migration**: The CompoundPill component is retained and extended with NEUTRAL level. The pills container is no longer conditional on matchedAines being non-empty — it always renders for any result with pactivos data.
