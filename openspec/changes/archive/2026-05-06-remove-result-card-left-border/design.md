## Context

Result cards currently use a thick 4px left border (`border-l-4`) combined with a `border-l-status-*-border` color class to indicate status. This creates a visually heavy "shadow" effect on the left side of the card. Status is already communicated through three other channels: the background tint, the status banner text, and the text color — making the left border redundant.

The `STATUS_CONFIG` object in `result-card.tsx` holds a `border` key per status that maps to these border color classes. The card's root element applies both `border-l-4` and the dynamic `${config.border}`.

## Goals / Non-Goals

**Goals:**

- Remove the left border visual treatment from all result card statuses
- Maintain clear status communication through existing background tint, banner, and text color
- Clean up the `border` key from `STATUS_CONFIG` since it will no longer be used

**Non-Goals:**

- Redesigning the result card layout or adding new visual indicators
- Changing banner text, warning messages, or accessibility attributes
- Altering the result list component

## Decisions

**Decision: Remove border entirely, no replacement indicator**

The left border is the only element being removed. The background tint (`bg-status-*-bg`), status banner, and text color already provide sufficient visual distinction between statuses. No replacement visual indicator is needed.

Alternative considered: Replace with a top border (`border-t-4`). Rejected because it adds the same visual weight in a different position without serving a purpose that isn't already covered.

## Risks / Trade-offs

- **[Reduced status visibility at a glance]** → Mitigated by background tint and banner remaining in place. The left border was redundant with these signals.
- **[Visual continuity for existing users]** → Minimal risk since the card shape and color coding stay the same. The border removal is a visual simplification, not a semantic change.
