## ADDED Requirements

### Requirement: Result card status-driven layout

Each search result SHALL be rendered as a `<div>` card with a thick left border (4px) in the corresponding status color, a tinted background matching the status, and a status banner as the card header. The card SHALL display the medication name as a heading and the composition (`pactivos`) as body text.

#### Scenario: RED result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"RED"`
- **THEN** the card SHALL have `border-l-4 border-l-status-red-border bg-status-red-bg`
- **AND** a status banner SHALL display "🔴 AINE DETECTADO" in `text-status-red` color
- **AND** the medication name SHALL display as a heading
- **AND** the composition (`pactivos`) SHALL display as body text

#### Scenario: AMBER result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"AMBER"`
- **THEN** the card SHALL have `border-l-4 border-l-status-amber-border bg-status-amber-bg`
- **AND** a status banner SHALL display "🟠 SALICILATO DETECTADO" in `text-status-amber` color
- **AND** the medication name and composition SHALL display

#### Scenario: GREEN result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"GREEN"`
- **THEN** the card SHALL have `border-l-4 border-l-status-green-border bg-status-green-bg`
- **AND** a status banner SHALL display "🟢 LIBRE DE AINE" in `text-status-green` color
- **AND** the medication name and composition SHALL display

#### Scenario: YELLOW result card renders

- **WHEN** a search result has `aineAnalysis.status` of `"YELLOW"`
- **THEN** the card SHALL have `border-l-4 border-l-status-yellow-border bg-status-yellow-bg`
- **AND** a status banner SHALL display "🟡 NO PUDIMOS VERIFICAR" in `text-status-yellow` color

### Requirement: Compound pills for matched AINE compounds

For search results with `aineAnalysis.status` of `"RED"` or `"AMBER"`, the card SHALL display each matched AINE compound as an accessible pill element. Each pill SHALL show the compound name and its family, styled as a small rounded badge with the status color as background. The pill container SHALL use `role="list"` and each pill SHALL use `role="listitem"` with an `aria-label` describing the compound (e.g., "IBUPROFENO, Arylpropionicos").

#### Scenario: RED result displays compound pills

- **WHEN** a RED result has `matchedAines` containing `[{name: "IBUPROFENO", family: "Arylpropionicos"}]`
- **THEN** the card SHALL render a pill element displaying "IBUPROFENO · Arylpropionicos"
- **AND** the pill SHALL have `role="listitem"` and `aria-label="IBUPROFENO, Arylpropionicos"`
- **AND** the pill container SHALL have `role="list"`

#### Scenario: Multiple compound pills wrap on mobile

- **WHEN** a result has multiple matched AINE compounds
- **THEN** the pills SHALL wrap using `flex-wrap` with `gap` between items
- **AND** each pill SHALL be readable on a 320px viewport width

#### Scenario: GREEN result shows no compound pills

- **WHEN** a GREEN result renders
- **THEN** no compound pills SHALL be displayed

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
