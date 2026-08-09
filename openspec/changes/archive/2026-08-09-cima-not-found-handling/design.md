## Context

The app proxies the Spanish CIMA medication API at `/api/cima` (see `openspec/specs/cima-proxy/spec.md`). Detail lookups (`nregistro`/`cn`) map to CIMA `/medicamento`, which responds to unknown identifiers with **204 No Content** (empty body) — verified live: `medicamento?cn=986578` → 204, `medicamento?nregistro=99999` → 204, while valid lookups return 200 + JSON.

In `src/app/api/cima/route.ts` (`handleDetail`), the 204 passes the `if (!response.ok)` guard (204 is 2xx), so `response.json()` throws on the empty body → caught by the generic `catch` → **502 "Error interno del servidor"** + YELLOW analysis. The frontend (`src/components/search-bar.tsx`, `needsFallback`) only retries with `nombre` on `status === 404`, so the user sees a server error for CN numbers CIMA cannot resolve.

## Goals / Non-Goals

**Goals:**

- Users typing a CN (or scanning an EAN-13) that CIMA cannot resolve see the not-found UX (name retry → empty-results state) instead of a 502 server error
- Proxy contract stays truthful: not-found is signalled as 404, genuine upstream failures as 502

**Non-Goals:**

- No frontend changes (existing fallback logic already implements the desired UX once the proxy returns 404)
- No change to the search (`nombre`) path — CIMA search returns 200 even with zero results, so no 502 occurs there
- No changes to how 5xx/network errors are reported (stay 502)
- Not fixing CIMA's 204-for-discontinued-products data quirk beyond the not-found mapping

## Decisions

- **CIMA 204 → proxy 404 + YELLOW analysis** (in `handleDetail` only). Rationale: the existing spec scenario "Medication not found in CIMA (404)" already promises this shape for detail lookups; treating 204 as an error at the proxy is the minimal, contract-preserving fix. Check `response.status === 204` _before_ `response.json()` because the empty body makes JSON parsing throw.
- **Frontend unchanged**: `search-bar.tsx:82` `needsFallback` triggers on `res.status === 404` for CN/EAN-13 queries → retries `/api/cima?nombre=<query>` → if empty, the existing EmptyResults component renders. Verified by reading the code path; covered by existing unit tests.
- **Search path stays as-is**: `handleSearch` keeps 502 for CIMA errors; CIMA never returns 404 for `/medicamentos?nombre=` (verified: returns 200 with empty `resultados`).
- **Alternative rejected — frontend-only fix**: client-side heuristics can't reliably distinguish "not found" from "API down"; the proxy is the correct boundary to normalize upstream semantics.
- **Alternative rejected — 200 + empty resultados**: breaks the specced 404 contract for detail lookups and forces client branch logic on response shape.

## Risks / Trade-offs

- [Clients that rely on 502 to detect CIMA outage] → Mitigation: not-found (404) is now distinguishable from outage (502) — this is the intended improvement; the frontend already treats 404 as retry-able.
- [CIMA may start returning actual 404s] → Existing 404 branch already handles it identically; both paths produce the same response shape.
- [204 on the search endpoint in the future] → Not handled (would hit `handleSearch`'s `!response.ok` guard → 502); low risk since CIMA search currently always returns 200, flagged as an open question in brainstorm.md.
