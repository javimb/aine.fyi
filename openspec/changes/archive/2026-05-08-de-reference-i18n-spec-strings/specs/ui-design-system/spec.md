## MODIFIED Requirements

### Requirement: Typography scale

Headings SHALL use `font-weight: 700` with `letter-spacing: -0.02em`. Body text SHALL use `font-weight: 400` with `letter-spacing: 0`. The page title SHALL be `text-2xl` on mobile and `text-3xl` on desktop. Status banner labels SHALL use `font-weight: 700`, `text-sm`, and `uppercase` with `tracking-wide`.

#### Scenario: Page title typography

- **WHEN** the page title (sourced from i18n key `app.title`) renders
- **THEN** it SHALL use `font-weight: 700` and `letter-spacing: -0.02em`
- **AND** it SHALL be `text-2xl` on viewports below 768px and `text-3xl` on viewports 768px and above

#### Scenario: Status banner typography

- **WHEN** a status banner label (sourced from i18n key `status.<statusLevel>.banner`) renders
- **THEN** it SHALL use `font-weight: 700`, `text-sm`, `uppercase`, and `tracking-wide`
