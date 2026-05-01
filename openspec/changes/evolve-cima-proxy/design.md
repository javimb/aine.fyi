## Context

The app currently has a thin CIMA proxy (`src/app/api/cima/route.ts`) that forwards search-by-name requests to the CIMA REST API and returns raw JSON. The AINE blacklist (`data/aines.ts`) exists with 7 entries but has no `cimaNames` field. There is no matching logic anywhere. The proxy needs to become the intelligent layer that analyzes medications for AINE content and returns enriched responses.

The CIMA API returns `pactivos` as a comma-separated uppercase string without accents (e.g., `"ACETILSALICILICO ACIDO, CLORFENAMINA MALEATO"`). The blacklist stores friendly names with accents (e.g., `"Ácido Acetilsalicílico"`). This normalization gap is the core technical challenge.

## Goals / Non-Goals

**Goals:**

- Evolve the proxy into the AINE intelligence layer — all matching happens server-side
- Support three lookup modes: by name (search list), by `nregistro` (detail), by `cn` (national code detail)
- Enrich every response with `aineAnalysis` containing status and matched AINEs
- Use conservative YELLOW logic: only GREEN when `pactivos` is present and no AINE matches
- Make matching explicit and deterministic via `cimaNames`

**Non-Goals:**

- Caching (deferred to a future change)
- Client-side UI work
- Barcode/scanner functionality
- Adding new AINE entries beyond the existing 7

## Decisions

### D1: Explicit `cimaNames` over algorithmic normalization

**Decision:** Add a `cimaNames: string[]` field to each AINE entry listing exact normalized tokens matching CIMA's `pactivos` format.

**Alternatives considered:**

- _Runtime normalization of blacklist names_: Would need accent-stripping, word-order handling, and fuzzy matching. Fragile and hard to test against CIMA's actual output.
- _Substring matching_: Too loose — "ACIDO" substring-matches inside compound names, causing false positives.
- _Token-set similarity_: Over-engineered for 7 entries that rarely change.

**Rationale:** The blacklist is tiny (7 entries) and stable. Explicit is better than clever. Each `cimaNames` entry is an exact token that CIMA uses, verifiable by looking up a known medication. No false positives, trivial to test.

### D2: All responses enriched, including search lists

**Decision:** Every API response (search results and detail lookups) includes `aineAnalysis`. For search results, each item in the result list gets its own analysis.

**Rationale:** The e-lactancia.org inspiration calls for instant clarity. Users should see the traffic light the moment results appear, not after clicking into a detail view. The computational cost is negligible — 7 blacklist entries against each result's `pactivos`.

### D3: Single route with param-based dispatch

**Decision:** Keep one route (`/api/cima`) that dispatches based on which query parameter is provided: `nombre` → search, `nregistro` → detail, `cn` → detail.

**Alternatives considered:**

- _Separate routes_ (`/api/cima/search`, `/api/cima/detail`): More RESTful but over-engineered for 3 operations with shared analysis logic.

**Rationale:** The analysis pipeline is identical regardless of lookup type. A single route with parameter dispatch keeps the code simple and the client API tiny.

### D4: Matching logic in a separate module

**Decision:** Extract AINE matching into a dedicated module (e.g., `src/lib/aine-matcher.ts`), not inline in the route handler.

**Rationale:** The route handler should focus on HTTP concerns (params, errors, forwarding). Matching is domain logic that deserves its own module, making it testable in isolation.

### D5: Conservative YELLOW semantics

**Decision:** YELLOW means "we could not verify." It triggers when: `pactivos` is missing/empty, CIMA returns a 404, or any CIMA API error occurs. GREEN only triggers when `pactivos` is present and no AINE matches.

**Rationale:** For a health-safety tool, false negatives (saying safe when unsure) are dangerous. YELLOW prompts the user to consult a professional, which is the correct fallback.

## Risks / Trade-offs

- **[CIMA format changes]** → If CIMA alters its `pactivos` format, `cimaNames` entries may stop matching. Mitigation: `cimaNames` is a small, manually curated list easy to update. Can add integration tests hitting the real API.
- **[Missing `cimaNames` entries]** → If we haven't added a `cimaNames` value that CIMA uses for a known AINE, it won't be detected. Mitigation: test against real medications for each of the 7 entries. The explicit format makes gaps obvious.
- **[Multiple params sent]** → A client sending both `nombre` and `nregistro` could cause ambiguous behavior. Mitigation: define a clear precedence order (e.g., `nregistro` > `cn` > `nombre`) and document it.
