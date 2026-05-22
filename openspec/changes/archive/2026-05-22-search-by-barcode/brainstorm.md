## Design Summary

Add barcode/CN search support to aine.fyi using a single smart search field that auto-detects whether the input is a código nacional (CN), EAN-13 barcode, or medication name — and falls back to name search if a CN lookup returns no results.

## Alternatives Considered

### Option A: Client-side detection, unified API call

- **Approach**: Detect CN/barcode vs name on the client side using regex. If digits, extract CN from EAN-13 if needed, call `/api/cima?cn=<CN>`. If not found, fall back to `/api/cima?nombre=<query>`. Single smart field, minimal server changes.
- **Pros**: Simple, few moving parts, leverages existing `cn` API parameter, fallback is transparent
- **Cons**: EAN-13 → CN extraction logic lives on the client
- **Why not chosen**: This IS the chosen approach

### Option B: Server-side detection, single API endpoint

- **Approach**: Send all queries to a single endpoint (`/api/search?q=...`). Server detects query type, extracts CN if needed, tries CIMA by `cn` first, then falls back to name search.
- **Pros**: All detection logic centralized, client stays simple, easy to test detection rules server-side
- **Cons**: Requires a new API route or significant refactoring of `/api/cima`, mixes concerns in the server handler
- **Why not chosen**: More server-side changes than needed — the existing `cn` param already works, adding a new endpoint is overkill

### Option C: Separate barcode search field + name field

- **Approach**: Add a second input field specifically for barcode/CN, each routing to the appropriate API call. Both fields visible simultaneously.
- **Pros**: Explicit, no ambiguity about what the user is searching for
- **Cons**: Clutters the UI, contradicts the "single smart field" preference, two submit buttons is confusing for a simple app
- **Why not chosen**: User explicitly chose single smart field — this contradicts that decision

## Agreed Approach

**Option A: Client-side detection with fallback.** A new utility `detectQueryType()` on the client determines if the input is a CN/barcode or a name. The search bar calls the appropriate existing API parameter (`cn` or `nombre`). If a CN search returns no results, it transparently falls back to name search. No server-side changes beyond what already exists.

The approach is minimal because the `/api/cima` route already supports `cn` as a query parameter, so the only changes are client-side detection logic and fallback behavior in the search bar component.

## Key Decisions

1. **Single smart search field** — no toggle, no separate barcode input
2. **Auto-detect by format** — all digits + 6-7 chars = CN; all digits + 13 chars = EAN-13; otherwise = name
3. **EAN-13 support** — extract CN from EAN-13 barcode digits
4. **Transparent fallback** — if CN lookup returns no results, fall back to name search without additional messaging
5. **Same result card** — no changes to result display, same component regardless of search method
6. **Placeholder update** — search input placeholder should hint that CN/barcode input works

## Open Questions

- ~~Exact CN extraction position from EAN-13~~ — Will be researched and documented in the design phase. The CIMA docs confirm CN is 6-7 digits and found on physical packaging barcodes. EAN-13 parsing algorithm to be specified during design.
