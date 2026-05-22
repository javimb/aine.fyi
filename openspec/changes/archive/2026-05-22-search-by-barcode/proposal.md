## Why

Users who type or scan a código nacional (CN) or EAN-13 barcode into the search bar get poor or no results because the current search only sends queries as `nombre` (name) to the CIMA API. The API already supports `cn` as a parameter, but the client never uses it. Adding auto-detection and fallback enables barcode/CN searches without any server-side changes.

## What Changes

**Search query detection and routing**

- From: All queries are sent as `nombre` regardless of format
- To: Queries are classified as CN (6-7 digits), EAN-13 (13 digits), or name; CN/EAN-13 queries route to the `cn` API param
- Reason: CN lookups return exact medication matches; name search on numeric input fails
- Impact: Non-breaking; name searches continue to work identically

**EAN-13 barcode → CN extraction**

- From: No barcode support
- To: 13-digit all-numeric input extracts the CN from indices 6-11 of the EAN-13, then queries by CN
- Reason: Physical medication packaging uses EAN-13 barcodes; extracting the embedded CN allows direct lookup
- Impact: Non-breaking; pure addition

**Transparent CN → name fallback**

- From: CN lookup returning no results shows an empty state
- To: CN/EAN-13 lookups that return no results automatically retry as a `nombre` search
- Reason: Mis-scanned or partial codes should still surface useful results
- Impact: Non-breaking; adds fallback behavior

**Search input placeholder**

- From: Placeholder text "Buscar medicamento..."
- To: Placeholder text "Buscar medicamento, CN o código de barras..."
- Reason: Signals to users that barcode/CN input is supported
- Impact: Non-breaking; i18n key update only

## Capabilities

### New Capabilities

- `query-detection`: Classifies search input as CN, EAN-13, or name and routes to the appropriate API parameter, with transparent fallback from CN/EAN-13 to name search on empty results

### Modified Capabilities

- `search-form`: Requirements change to integrate query detection into the search submission flow and update the placeholder text to indicate barcode/CN support

## Impact

- **Client code**: `src/components/search-bar.tsx` (search submission logic), `messages/es-ES.json` (placeholder text)
- **New code**: `src/lib/` — `detectQueryType()` and `extractCnFromEan13()` utilities
- **Tests**: New unit tests for detection and extraction functions; updated search bar tests for fallback behavior
- **API**: No changes — the `/api/cima` route already supports `cn`, `nregistro`, and `nombre` parameters
- **Dependencies**: None — no new packages required
