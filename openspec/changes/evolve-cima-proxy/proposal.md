## Why

The current CIMA proxy is a passive CORS bypass — it forwards search requests and returns raw CIMA data without any AINE analysis. The core value of this app (instantly telling users if a medication is safe) requires the proxy to become the intelligent layer: fetching from CIMA, matching active ingredients against the AINE blacklist, and returning an enriched response with a clear risk status. Without this, the client would need to reimplement matching logic, and the proxy would stay a dumb pipe.

## What Changes

- Add AINE matching logic to the proxy: normalize `pactivos` from CIMA responses, compare against blacklist `cimaNames`, and produce a `RED | GREEN | YELLOW` status per result
- Extend the AINE data model with a `cimaNames` field — explicit normalized strings matching CIMA's format for each entry, eliminating ambiguous substring matching
- Add support for two new query parameters: `nregistro` and `cn` for detail lookups alongside the existing `nombre` search
- Enrich all API responses (search and detail) with an `aineAnalysis` object containing `status` and `matchedAines`
- Apply conservative YELLOW logic: missing/empty `pactivos` → YELLOW, CIMA errors/404 → YELLOW; GREEN only when `pactivos` is present and contains no AINE matches

## Capabilities

### New Capabilities

- `aine-matching`: Server-side AINE detection logic — normalizing CIMA's `pactivos` against blacklist `cimaNames`, producing a status result

### Modified Capabilities

- `cima-proxy`: Adding `nregistro` and `cn` query parameters, enriching all responses with `aineAnalysis`, and introducing Zod validation for CIMA responses
- `aine-data`: Adding the `cimaNames` field to the AINE entry schema and data

## Impact

- `data/aines.ts` and `data/aines.schema.ts` — schema and data extended with `cimaNames`
- `src/app/api/cima/route.ts` — major rewrite: multi-param dispatch, AINE analysis integration, enriched response shape
- New module likely needed for matching logic (separate from route handler)
- Client code will consume the new `aineAnalysis` field (no client-side matching needed)
