# UI Design System

## Purpose

TBD

## Requirements

### Requirement: Inter typeface as primary font

The project SHALL use Inter as the primary sans-serif typeface, loaded via `next/font/google` and applied through the `--font-sans` CSS variable. The font SHALL be configured with the `latin` subset.

#### Scenario: Inter font is loaded and applied

- **WHEN** the application renders in a browser
- **THEN** the `<html>` element SHALL have the Inter font family applied via the `--font-geist-sans` CSS variable (renamed or aliased to `--font-sans`)
- **AND** all text content SHALL render in Inter

#### Scenario: Font loading fallback

- **WHEN** the Inter font has not yet loaded
- **THEN** the browser SHALL display a system sans-serif fallback via `font-display: swap`

### Requirement: Warm slate-teal color tokens

The `:root` CSS custom properties in `globals.css` SHALL define a warm slate-teal color system. All achromatic gray tokens SHALL include a subtle chroma component at hue 255 (teal) in oklch. The `--primary` token SHALL be `oklch(0.35 0.07 255)` (deep slate-teal) with `--primary-foreground` of `oklch(0.98 0 0)`. The `--background` SHALL be `oklch(0.99 0.002 255)`, `--card` SHALL be `oklch(1 0 0)`, `--muted` SHALL be `oklch(0.96 0.005 255)`, and `--border` SHALL be `oklch(0.90 0.01 255)`. All other surface tokens (foreground, secondary, etc.) SHALL be adjusted to maintain the warm undertone.

#### Scenario: Primary color is slate-teal

- **WHEN** the application renders
- **THEN** the `--primary` CSS variable SHALL be `oklch(0.35 0.07 255)`
- **AND** elements using `bg-primary` SHALL appear as a deep slate-teal color

#### Scenario: Gray tokens have warm undertone

- **WHEN** the `--muted` or `--border` tokens are applied
- **THEN** they SHALL render with a perceptible warm (teal) undertone compared to pure achromatic gray

### Requirement: Status color tokens

The `:root` CSS custom properties SHALL define four status color token groups, each with a main color, a background tint, and a border color. The tokens and their oklch values SHALL be:

- `--status-red`: `oklch(0.55 0.24 25)`, `--status-red-bg`: `oklch(0.97 0.03 25)`, `--status-red-border`: `oklch(0.55 0.24 25)`
- `--status-amber`: `oklch(0.65 0.14 75)`, `--status-amber-bg`: `oklch(0.97 0.02 75)`, `--status-amber-border`: `oklch(0.65 0.14 75)`
- `--status-green`: `oklch(0.55 0.15 150)`, `--status-green-bg`: `oklch(0.96 0.02 150)`, `--status-green-border`: `oklch(0.55 0.15 150)`
- `--status-yellow`: `oklch(0.80 0.15 90)`, `--status-yellow-bg`: `oklch(0.97 0.02 90)`, `--status-yellow-border`: `oklch(0.80 0.15 90)`

These tokens SHALL also be mapped to Tailwind utility classes via the `@theme inline` block.

#### Scenario: Status red tokens are available

- **WHEN** a component applies `bg-status-red-bg` or `border-status-red-border` or `text-status-red`
- **THEN** the corresponding oklch color SHALL be applied correctly

#### Scenario: All status colors meet WCAG 2.1 AA

- **WHEN** status text is rendered on a status background
- **THEN** the contrast ratio between the status text color and the status background color SHALL be at least 4.5:1 for normal text and 3:1 for large text

### Requirement: Typography scale

Headings SHALL use `font-weight: 700` with `letter-spacing: -0.02em`. Body text SHALL use `font-weight: 400` with `letter-spacing: 0`. The page title SHALL be `text-2xl` on mobile and `text-3xl` on desktop. Status banner labels SHALL use `font-weight: 700`, `text-sm`, and `uppercase` with `tracking-wide`.

#### Scenario: Page title typography

- **WHEN** the page title (sourced from i18n key `app.title`) renders
- **THEN** it SHALL use `font-weight: 700` and `letter-spacing: -0.02em`
- **AND** it SHALL be `text-2xl` on viewports below 768px and `text-3xl` on viewports 768px and above

#### Scenario: Status banner typography

- **WHEN** a status banner label (sourced from i18n key `status.<statusLevel>.banner`) renders
- **THEN** it SHALL use `font-weight: 700`, `text-sm`, `uppercase`, and `tracking-wide`
