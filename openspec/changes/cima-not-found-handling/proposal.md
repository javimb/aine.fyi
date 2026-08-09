## Why

Users typing a CN (Código Nacional) or scanning an EAN-13 barcode for a medication CIMA cannot resolve see a "502 Error interno del servidor" instead of a not-found result. Investigation shows CIMA's detail endpoint returns **204 No Content** (empty body) for unknown `nregistro`/`cn` lookups, not 404. The proxy route treats 204 as success (`response.ok` is true for 2xx), so parsing the empty body throws and the generic catch returns 502. The frontend only retries with `nombre` on a 404, so the server error surfaces directly to the user. Fixing the proxy to signal not-found as 404 restores the designed fallback flow (name retry → empty-results state) and makes genuine upstream failures (502) distinguishable from unknown medications.

## What Changes

**CIMA not-found handling for detail lookups (`nregistro`/`cn`)**

- From: CIMA 204 No Content → proxy returns 502 "Error interno del servidor" (empty body makes `response.json()` throw; catch returns 502)
- To: CIMA 204 No Content → proxy returns 404 with `aineAnalysis: { status: "YELLOW", matchedAines: [] }`, same shape as the existing CIMA-404 branch
- Reason: 204 is CIMA's actual not-found signal; the spec already promises 404 semantics for not-found detail lookups
- Impact: non-breaking for clients; the frontend's existing `needsFallback` (retry with `nombre` on 404) now activates and leads to the empty-results UI

**No other behavior changes**: search (`nombre`) path, 5xx → 502, and 400 missing-params handling are untouched.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `cima-proxy`: extend the "Medication not found in CIMA (404)" requirement so a CIMA **204 No Content** response for detail lookups (`nregistro`/`cn`) is also treated as not-found and the proxy returns 404 with `aineAnalysis: YELLOW`

## Impact

- `src/app/api/cima/route.ts` — `handleDetail()` adds a `response.status === 204` check before JSON parsing
- Tests: `src/app/api/cima/route.test.ts` and `src/app/api/cima/integration.test.ts` (new 204 → 404 cases)
- Spec: delta for `openspec/specs/cima-proxy/spec.md` ("Medication not found" scenario)
- Docs: `docs/cima-api.md` one-line note (204 observed for unknown lookups)
- No dependency, frontend, or config changes
