## Context

The message catalog (`messages/es-ES.json`) currently contains emoji characters mixed into translatable strings. Circle emojis (🔴🟠🟢🟡) prefix status banner labels, and ⚠️ prefixes warning messages and the disclaimer heading. This couples visual design to translation content — if the design system changes how status is indicated, translators would need to touch strings. The component layer already has the styling infrastructure to signal status (background colors, text colors), making the circle emojis redundant. The ⚠️ glyph is a structural visual element that should be owned by components, not translators.

Current state of affected strings:

| Key                     | Current Value              | After Change            |
| ----------------------- | -------------------------- | ----------------------- |
| `status.RED.banner`     | 🔴 AINE DETECTADO          | AINE DETECTADO          |
| `status.RED.message`    | ⚠️ Evita este...           | Evita este...           |
| `status.AMBER.banner`   | 🟠 SALICILATO DETECTADO    | SALICILATO DETECTADO    |
| `status.AMBER.message`  | ⚠️ Los salicilatos...      | Los salicilatos...      |
| `status.GREEN.banner`   | 🟢 LIBRE DE AINE           | LIBRE DE AINE           |
| `status.YELLOW.banner`  | 🟡 NO PUDIMOS VERIFICAR    | NO PUDIMOS VERIFICAR    |
| `status.YELLOW.message` | ⚠️ No pudimos verificar... | No pudimos verificar... |
| `disclaimer.heading`    | ⚠️ Aviso importante        | Aviso importante        |

## Goals / Non-Goals

**Goals:**

- Remove all emoji characters from i18n string values so the message catalog contains only translatable text
- Provide a reusable `WarningIcon` component for the ⚠️ visual indicator, used in component JSX
- Keep the visual experience identical — circle indicators are removed because the styled card background already communicates status; ⚠️ is preserved via the component

**Non-Goals:**

- Changing the visual design of status cards or the disclaimer (layout, colors, typography stay the same)
- Adding SVG or custom icon components (⚠️ Unicode glyph is sufficient)
- Refactoring the `StatusBanner` component interface beyond what's needed
- Adding new status levels or changing the status classification logic

## Decisions

### Decision 1: Circle emojis are simply removed (no replacement)

The colored circle emojis (🔴🟠🟢🟡) in banner labels are redundant. The result card already uses `bg-status-{color}-bg` for the card background and `text-status-{color}` for the banner text. These provide strong, immediate visual status signaling. Adding a circle emoji on top adds no information and creates an inconsistency where color is communicated in two places (CSS and i18n).

**Alternatives considered:**

- Replace circles with a CSS-rendered colored dot (`::before` pseudo-element) — adds complexity for no user-facing benefit
- Keep circles but render them in JSX — the circles purely duplicate the card's background color signal

**Decision:** Remove with no replacement. The card styling is the status indicator.

### Decision 2: WarningIcon is a simple presentational component

The `WarningIcon` component renders a single ⚠️ Unicode character with `aria-hidden="true"` and no semantic role. It's used as a visual prefix in two contexts: result card warning messages (RED/AMBER/YELLOW) and the disclaimer heading.

**Alternatives considered:**

- Inline `<span aria-hidden="true">⚠️</span>` everywhere — duplicates the pattern, no single source of truth for the visual element
- SVG icon — overkill for a single Unicode glyph that's universally available
- CSS `::before` with `content: "⚠️"` — can't be composed in JSX, harder to space and style alongside translated text

**Decision:** Dedicated component file (`warning-icon.tsx`), accepting no props (the glyph, accessibility attributes, and styling are fixed). Consumers render `<WarningIcon />` and add their own spacing.

### Decision 3: WarningIcon placement uses a flex container with gap

When `<WarningIcon />` appears next to text, a `flex items-start gap-1` wrapper ensures consistent spacing between the icon and the text. This applies to:

- Result card warning messages (line 86-88 area of `result-card.tsx`)
- Disclaimer heading (line 11 of `disclaimer.tsx`)

**Alternatives considered:**

- Plain space character between icon and text — inconsistent width, fragile
- `margin-right` on the icon — works but gap is more idiomatic in Tailwind

**Decision:** Flex container with `gap-1`.

### Decision 4: StatusBanner needs no changes

`StatusBanner` receives a `banner` string prop and renders it. After the i18n change, `banner` will be plain text without the emoji prefix. No component changes are needed — the banner text style (`font-bold uppercase tracking-wide`) plus the card's colored background is sufficient.

**Decision:** No changes to `status-banner.tsx`.

## Risks / Trade-offs

- **[Visual regression]** → Mitigation: Removing circle emojis reduces visual density in banners. Verify in manual review that the status banner text alone (e.g. "AINE DETECTADO") reads clearly against the colored background. The styling already makes banners bold uppercase with status-colored text, so this is low risk.
- **[String change breaks tests]** → Mitigation: All test files that assert on translated strings (especially e2e tests checking for banner/message content) must be updated to match the emoji-free strings. This is a mechanical change.
- **[Future locales must follow convention]** → Mitigation: Document the "no emoji in strings" convention in the spec so any new locale file is created without emojis.
