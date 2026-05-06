## MODIFIED Requirements

### Requirement: pactivos normalization for matching

The matching function SHALL normalize `pactivos` before lookup: split by comma, strip accents, uppercase, and trim whitespace on each token. Each normalized token SHALL be used as a key for exact lookup in the classification map. The `normalizePactivos` function SHALL be exported from the module for use by other components that need to correlate raw token strings with matched entries.

#### Scenario: Accent stripping in pactivos

- **WHEN** CIMA returns a `pactivos` string containing accented characters
- **THEN** the normalization step SHALL strip accents (e.g., `"ÁCIDO"` → `"ACIDO"`) before looking up in the classification map

#### Scenario: Export of normalizePactivos

- **WHEN** another module imports from `aine-matcher.ts`
- **THEN** the `normalizePactivos` function SHALL be available as a named export
