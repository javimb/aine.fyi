## Why

The "Principios activos:" label above the pills section is visually redundant — the pills themselves clearly communicate what they are. Removing it declutters the result card. However, screen readers still need this context to understand that the pills represent active ingredients (vs. interactions, contraindications, etc.).

## What Changes

- Remove the visible `<p>` "Principios activos:" label from result cards
- Add `aria-label="Principios activos"` to the pills `<div role="list">` container so assistive tech still announces the section's purpose
- Update unit and E2E tests to assert the aria-label instead of the visible label text

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `result-cards`: Remove requirement for visible "Principios activos:" label; add requirement for aria-label on pills container
- `active-ingredient-pills`: Change "Principios activos:" from a visible label to an aria-label on the list container

## Impact

- `src/components/result-card.tsx` — remove `<p>` label, add `aria-label` to `<div role="list">`
- `src/components/result-card.test.tsx` — update assertions
- `e2e/exhaustive/search.spec.ts` — update assertions
- `openspec/specs/result-cards/spec.md` — update Requirement 1 and Scenario 1
- `openspec/specs/active-ingredient-pills/spec.md` — update Requirement 2 and Scenarios 1 and 2
