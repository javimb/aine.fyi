## Why

The thick left border on result cards creates a visually heavy "shadow" effect that feels outdated and draws unnecessary attention to the card edge. The status information is already communicated through the banner, background tint, and text color — the left border is redundant visual weight.

## What Changes

- Remove the 4px left border (`border-l-4`) from all result card statuses (RED, AMBER, GREEN, YELLOW)
- Remove the `border-l-status-*-border` color classes from all result card statuses
- Keep all other visual status signals intact: background tint, status banner, and text color

## Capabilities

### New Capabilities

_None_

### Modified Capabilities

- `result-cards`: Remove the thick left border requirement from the status-driven card layout, relying on background tint, banner, and text color for status communication instead

## Impact

- `src/components/result-card.tsx` — remove `border-l-4` and `${config.border}` from the card's className
- `src/components/result-card.tsx` — remove `border` key from `STATUS_CONFIG` object
- `openspec/specs/result-cards/spec.md` — update requirements to remove left border references
- Related unit tests may need assertion updates if they check for border classes
