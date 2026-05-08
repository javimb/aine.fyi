## Why

Emojis in i18n strings conflate visual design with translatable content. Circle indicators (🔴🟠🟢🟡) in status banners are redundant — the card's background color already communicates status. Warning glyphs (⚠️) in messages and the disclaimer heading should be a reusable UI component, not embedded in translated text. Removing emojis from the message catalog keeps strings pure content and lets the component layer own visual treatment.

## What Changes

- Remove all emoji characters (🔴🟠🟢🟡⚠️) from `messages/es-ES.json`
- Create a reusable `<WarningIcon />` component that renders a ⚠️ glyph with `aria-hidden="true"` and no semantic role
- Update `StatusBanner` to render without a circle emoji (the card background already signals status)
- Update `ResultCard` to render `<WarningIcon />` before RED/AMBER/YELLOW messages
- Update `Disclaimer` to render `<WarningIcon />` before the heading text
- Update affected tests to match new string values and component structure

## Capabilities

### New Capabilities

- `warning-icon`: A reusable presentational component that renders a warning glyph (⚠️) with `aria-hidden="true"` and no semantic role, for use wherever a visual warning indicator is needed

### Modified Capabilities

- `i18n-messages`: Remove all emoji characters from message catalog string values. Status banner messages become plain text (e.g. "AINE DETECTADO" instead of "🔴 AINE DETECTADO"). Warning messages become plain text (e.g. "Evita este medicamento..." instead of "⚠️ Evita este medicamento..."). The `disclaimer.heading` key becomes plain text without ⚠️ prefix.
- `result-cards`: Status banner messages are now plain text rendered inside the existing styled banner. RED/AMBER/YELLOW contextual messages are now preceded by a `<WarningIcon />` component. GREEN messages have no warning icon.
- `home-page-content`: The disclaimer heading is now preceded by a `<WarningIcon />` component instead of relying on an emoji in the i18n string.

## Impact

- **Files changed**: `messages/es-ES.json`, `src/components/status-banner.tsx`, `src/components/result-card.tsx`, `src/components/disclaimer.tsx`, new `src/components/warning-icon.tsx`, plus related test files
- **Breaking for translators**: String values change — any future locale files must follow the "text-only" convention
- **No API or dependency changes**
