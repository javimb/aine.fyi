## Context

aine.fyi is a Spanish-language tool that checks whether a medication contains NSAIDs (AINEs). It uses Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

Currently, the search bar sends all queries as `nombre` to `GET /api/cima`. The API route already supports `cn` as a query parameter (proxied to CIMA's `/medicamento?cn=...`), but the client never uses it. Users who type a código nacional (CN) or scan an EAN-13 barcode get poor or no results because the `nombre` param doesn't match numeric codes well.

The change is purely client-side: the server's `/api/cima` route already handles `cn`, `nregistro`, and `nombre` parameters with the correct priority. No backend changes required.

Stakeholders: end users scanning barcodes on medication packaging, maintainers of the aine.fyi codebase.

## Goals / Non-Goals

**Goals:**

- Allow users to search by CN (6-7 digit national code) and get the correct single medication result
- Allow users to search by EAN-13 barcode (13-digit) and have the CN extracted automatically
- Transparently fall back to name search if a CN/EAN-13 lookup returns no results
- Update the search input placeholder to hint at barcode/CN support
- Keep the UI as a single smart search field

**Non-Goals:**

- Adding a separate barcode input field or toggle
- Modifying the server-side `/api/cima` route
- Changing the result card component or display logic
- Supporting barcode formats other than EAN-13
- Real-time search-as-you-type for barcode/CN queries (form submit only)

## Decisions

### 1. Client-side query type detection

**Decision**: Add a `detectQueryType()` utility in `src/lib/` that classifies input as CN, EAN-13, or name using regex patterns.

**Rationale**: The server already supports `cn` and `nombre` params. Detection on the client avoids a new API endpoint, keeps the server simple, and allows immediate fallback logic without extra round-trips.

**Alternatives considered**:

- Server-side detection via a new `/api/search` endpoint — adds unnecessary server complexity; the existing API already supports the needed params
- Two separate input fields — contradicts the single smart field UX decision

### 2. Detection rules

**Decision**: Use the following classification logic:

- **CN**: all digits, 6-7 characters → call `GET /api/cima?cn=<value>`
- **EAN-13**: all digits, 13 characters → extract CN and call `GET /api/cima?cn=<extractedCN>`
- **Name**: everything else → call `GET /api/cima?nombre=<value>`

**Rationale**: CN codes in Spain are 6-7 digits per CIMA documentation. EAN-13 barcodes are exactly 13 digits. These regex patterns are unambiguous — a 13-digit string won't be confused with a CN, and a 6-7 digit string won't be confused with a name.

### 3. EAN-13 → CN extraction algorithm

**Decision**: Extract the CN from indices 6-11 of the EAN-13 (the 6-digit substring), then validate it's numeric. The extracted substring is the CN.

**Rationale**: Spanish pharmaceutical EAN-13 barcodes follow this structure:

- Digits 1-6 (indices 0-5): GS1 Spain prefix `847000`
- Digits 7-12 (indices 6-11): Código Nacional (6-digit CN)
- Digit 13 (index 12): Check digit

The CN occupies exactly indices 6-11. If extraction yields a non-numeric substring, fall back to name search.

**Alternative considered**: Using positions 1-6 — this would extract the GS1 prefix instead of the CN.

### 4. Fallback behavior

**Decision**: When a CN lookup returns a 404 (no result), transparently retry with `nombre=<original_query>`. If the CN lookup succeeds, return the result directly.

**Rationale**: Users might type a partial or incorrect numeric code. Silently falling back to name search provides a better experience than showing "no results" with no alternative. The fallback is transparent — no special messaging needed.

### 5. Search bar component changes

**Decision**: Modify `src/components/search-bar.tsx` to:

1. Run `detectQueryType()` on the query before fetch
2. Construct the appropriate API URL with `cn` or `nombre` param
3. On CN/EAN-13: if the response is a 404 or returns no results, retry with `nombre` param
4. Update the input `placeholder` text to "Buscar medicamento, CN o código de barras..."

**Rationale**: All search logic already lives in `search-bar.tsx`. Adding detection and fallback there keeps the change scoped to one component. The placeholder change is minimal but signals the new capability.

**Alternative considered**: Creating a new hook `useSmartSearch()` — overkill for this scope; the component is only ~100 lines.

## Risks / Trade-offs

- **EAN-13 CN position may vary**: Some non-standard barcodes might not embed the CN at the expected positions. → Mitigation: if extraction yields non-numeric or no results, fall back to name search. This covers edge cases gracefully.
- **6-7 digit names or codes**: A medication name that happens to be 6-7 digits (unlikely in Spanish) could be misdetected as a CN. → Mitigation: this is extremely rare in practice; the fallback to name search on 404 handles it.
- **Test coverage**: New detection and extraction logic must be unit tested to prevent regressions. → Mitigation: add tests for `detectQueryType()` and `extractCnFromEan13()` covering edge cases (empty string, letters, wrong lengths, boundary lengths).
