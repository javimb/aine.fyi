# Result Cards

## Purpose

Render medication search results as status-driven cards with color-coded borders, banners, compound pills, and contextual warning messages.

## Requirements

### Requirement: Result card status-driven layout

Each search result SHALL be rendered as a `<div>` card with a thick left border (4px) in the corresponding status color, a tinted background matching the status, and a status banner as the card header. The card SHALL display the medication name as a heading. Below the heading, the card SHALL display a pills section that renders all active ingredients as CompoundPill elements. The pills section container SHALL have `role="list"` and `aria-label="Principios activos"` for screen reader accessibility. RED/AMBER active ingredients SHALL render as status-colored pills with name and family. All other active ingredients SHALL render as NEUTRAL pills with name only. The raw `pactivos` comma-separated string SHALL NOT be displayed. A visible "Principios activos:" label SHALL NOT appear.

#### Scenario: RED result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"RED"`
- **THEN** the card SHALL have `border-l-4 border-l-status-red-border bg-status-red-bg`
- **AND** a status banner SHALL display "🔴 AINE DETECTADO" in `text-status-red` color
- **AND** the medication name SHALL display as a heading
- **AND** the pills section SHALL have `role="list"` and `aria-label="Principios activos"`
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

### Requirement: Contextual warning messages per status

Each result card for RED, AMBER, and YELLOW statuses SHALL display a contextual warning message below the composition and compound pills. The message SHALL use the corresponding status text color and include a warning icon (⚠️).

| Status | Message                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------- |
| RED    | "Evita este medicamento si tienes alergia a AINE. Consulta con tu farmacéutico."                     |
| AMBER  | "Los salicilatos pueden provocar reacción cruzada con alergia a AINE. Consulta con tu farmacéutico." |
| YELLOW | "No pudimos verificar los componentes de este medicamento. Consulta con tu farmacéutico."            |

GREEN results SHALL display "No se han detectado compuestos AINE." without a warning icon.

#### Scenario: RED result displays warning message

- **WHEN** a RED result card renders
- **THEN** it SHALL display "⚠️ Evita este medicamento si tienes alergia a AINE. Consulta con tu farmacéutico." in `text-status-red`

#### Scenario: AMBER result displays warning message

- **WHEN** an AMBER result card renders
- **THEN** it SHALL display "⚠️ Los salicilatos pueden provocar reacción cruzada con alergia a AINE. Consulta con tu farmacéutico." in `text-status-amber`

#### Scenario: YELLOW result displays warning message

- **WHEN** a YELLOW result card renders
- **THEN** it SHALL display "⚠️ No pudimos verificar los componentes de este medicamento. Consulta con tu farmacéutico." in `text-status-yellow`

#### Scenario: GREEN result displays safe message

- **WHEN** a GREEN result card renders
- **THEN** it SHALL display "No se han detectado compuestos AINE." in `text-status-green`
- **AND** it SHALL NOT display a warning icon

### Requirement: Result list displays all matching drugs

After a search, all matching medications from the CIMA API SHALL be displayed as a list of result cards. A result count SHALL be shown above the list (e.g., "3 resultados").

#### Scenario: Multiple results render as a list

- **WHEN** a search returns 3 matching medications
- **THEN** 3 result cards SHALL render in a vertical list with spacing between them
- **AND** the text "3 resultados" SHALL appear above the list

#### Scenario: Single result renders

- **WHEN** a search returns 1 matching medication
- **THEN** 1 result card SHALL render
- **AND** the text "1 resultado" SHALL appear above the card

### Requirement: Result cards are accessible

Each result card SHALL have an `role="article"` with an `aria-label` that includes the medication name and status. The status banner text SHALL be readable by screen readers without relying on color alone. The warning message SHALL be in the accessible name of the card.

#### Scenario: Screen reader announces result card

- **WHEN** a screen reader user navigates to a result card for "Ibuprofeno 400mg" with status RED
- **THEN** the card SHALL be announced as an article with label including "Ibuprofeno 400mg" and "AINE detectado"
