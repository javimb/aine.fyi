## Design Summary

Users typing CN numbers (Código Nacional) get a "502 Error interno del servidor" for medications CIMA cannot resolve. Investigation found CIMA's detail endpoint `/medicamento?nregistro=` / `/medicamento?cn=` returns **204 No Content** (not 404) for unknown lookups. The proxy route treats 204 as success (`response.ok === true`), so `response.json()` throws on the empty body → catch → 502. The frontend fallback (retry with `nombre` on 404) never triggers because the proxy returns 502, so the user sees a server error instead of the empty-results state.

**Fix**: normalize CIMA 204 → proxy 404 + `aineAnalysis: YELLOW` for detail lookups (`nregistro`/`cn`), so the existing frontend fallback (retry with `nombre`, then empty-results UI) works as designed.

## Alternatives Considered

### Option A: Normalize 204 → 404 in the proxy route (CHOSEN)

- **Approach**: In `src/app/api/cima/route.ts` `handleDetail()`, check `response.status === 204` before attempting `response.json()` and return the same 404 + YELLOW response shape already used for CIMA 404s. Frontend untouched.
- **Pros**:
  - Single source of truth for not-found semantics at the API boundary
  - Reuses the exact response shape already specced ("Medication not found in CIMA (404)")
  - Existing frontend fallback (`search-bar.tsx` `needsFallback` on `status === 404`) immediately works — retries with `nombre`, shows empty state if nothing found
  - Minimal, testable change; unit + integration tests already model the 404 shape
- **Cons**:
  - Doesn't fix the frontend's dependence on the 404 status code (coupling between proxy contract and client fallback logic)
- **Why not chosen**: n/a — this is the agreed approach.

### Option B: Frontend-only fix (treat 502-with-empty-body as not-found)

- **Approach**: Extend `needsFallback` in `search-bar.tsx` to also trigger on 502 responses where the payload looks like a not-found.
- **Pros**: No API route change.
- **Cons**: Masks genuine upstream failures as "not found"; brittle string/shape sniffing on error payloads; leaves the proxy contract wrong (still misreports not-found as 502); duplicated logic where the client must know CIMA's quirks.
- **Why not chosen**: The proxy is the right boundary to normalize upstream behavior. Client-side heuristics can't distinguish "medication unknown" from "API down" reliably, and the spec already promises 404 semantics at the proxy.

### Option C: Return 200 + empty `resultados` on CIMA 204

- **Approach**: Map CIMA 204 detail lookups to `200 { resultados: [] }` so the UI shows the empty-results state directly.
- **Pros**: Avoids status-code coupling in the client.
- **Cons**: Breaks the existing spec contract (detail lookups return 404 on not-found); changes the response _shape_ (search-style envelope) for a detail lookup, forcing client branch logic; loses the semantic distinction between "nothing found" and "list of zero results".
- **Why not chosen**: The project already specifies 404 + YELLOW for not-found detail lookups; Option A satisfies that contract with one line of behavior change and zero client changes.

## Agreed Approach

Option A. The proxy route's `handleDetail()` treats CIMA **204 No Content** as not-found and returns `404 + aineAnalysis: { status: "YELLOW", matchedAines: [] }` — identical to the existing CIMA-404 branch. CIMA 5xx and network errors remain 502. The search path (`nombre`) is unchanged: CIMA search returns 200 even with zero results, so no 502 occurs there. The frontend fallback then works as originally designed: CN/EAN-13 lookup 404 → retry with `nombre` → empty-results UI if still nothing.

## Key Decisions

- **204 is not-found, not an error**: verified live against CIMA — unknown `nregistro`/`cn` returns 204 No Content with empty body; valid lookups return 200 with JSON. The route must check `status === 204` explicitly (before `response.json()`, since the empty body makes `.json()` throw).
- **Keep the existing 404 + YELLOW response shape**: no new response schema; the spec scenario "Medication not found in CIMA (404)" extends to cover 204.
- **Frontend unchanged**: the `needsFallback` retry-on-404 logic already implements the desired UX once the proxy returns 404.
- **Search path untouched**: `handleSearch` keeps 502 for CIMA 5xx; CIMA never 404s on `/medicamentos?nombre=` (returns 200 with empty `resultados`).
- **Change renamed** from `suma-404-api` → `cima-not-found-handling` (CIMA is the upstream; "SUMA" was a misnomer).

## Open Questions

- None blocking. (Possible follow-up: CIMA's detail endpoint returning 200-with-valid-JSON but a 204-with-empty-body for discontinued products — out of scope for this change.)
