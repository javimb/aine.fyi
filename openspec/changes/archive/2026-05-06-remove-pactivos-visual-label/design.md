## Context

Result cards currently display a visible `<p>` label "Principios activos:" above the pills section. Visual users perceive this as redundant — the pills already convey what they are by their nature and layout. However, screen reader users rely on this label to understand the semantic role of the pills section (active ingredients vs. interactions, contraindications, etc.).

The current markup:

```tsx
<p className="text-sm font-medium text-muted-foreground">
  Principios activos:
</p>
<div role="list" className="mt-1 flex flex-wrap gap-1.5">
  {pills}
</div>
```

## Goals / Non-Goals

**Goals:**

- Remove the visually redundant "Principios activos:" label
- Preserve screen reader context via `aria-label` on the list container
- Keep the card accessible (no information loss for assistive tech)

**Non-Goals:**

- Changing pill styling or layout
- Changing warning messages or status banners
- Adding new visual elements to the card

## Decisions

**Decision 1: Use `aria-label` on existing `<div role="list">` instead of sr-only `<span>`**

Alternatives considered:

- **sr-only `<span>`**: Would add extra DOM nodes for content only assistive tech sees. More markup than needed.
- **`aria-labelledby` pointing to a hidden element**: Over-engineered for a simple static label.

`aria-label` on the `<div role="list">` is the simplest approach — one attribute on an existing element, no new DOM nodes, screen readers will announce "Principios activos, list" when entering the section.

**Decision 2: Keep the wrapping `<div>` for the pills section (no structural change)**

The outer `<div className="mt-2">` wrapper stays. Only the `<p>` inside it is removed. This keeps the spacing stable and the change minimal.

## Risks / Trade-offs

- **[Visual spacing change]** Removing the `<p>` may affect vertical spacing → The `<div className="mt-2">` wrapper remains, and pills have their own `mt-1` gap. Spinosa alignment should be verified visually.
- **[aria-label pronunciation]** Screen readers will read "Principios activos" when entering the list → This is the same text as before, so pronunciation is unchanged.
