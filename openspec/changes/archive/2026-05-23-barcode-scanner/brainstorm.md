## Design Summary

Add camera-based barcode scanning to the aine.fyi medication lookup app using a **Scanner Overlay pattern**: an icon-only scan button (barcode icon, no visible text label) next to the search input opens a full-screen camera overlay. When a barcode is detected, the overlay auto-closes, the barcode populates the search field, and the existing search flow (detectQueryType → API call with CN/EAN-13 fallback) runs unchanged.

The scanning targets **general users** on both **mobile and desktop** platforms. On unsupported devices or when camera permission is denied, the scan button is hidden or a graceful message is shown, falling back to manual typed input (existing flow).

**Library chosen**: `@ericblade/quagga2` (maintained QuaggaJS fork) for in-browser EAN-13 barcode detection via live camera stream.

## Alternatives Considered

### Option A: Scanner Overlay Component

- **Approach**: Add a scan button (BarcodeScannerButton) next to the search input. Tapping it opens a full-screen ScannerOverlay with live camera feed and viewfinder frame. On successful detection, auto-close the overlay, populate the search input, and auto-submit the existing search flow.
- **Pros**: Clean separation of concerns; full-screen overlay gives maximum camera area for reliable scanning; typed input still works naturally with no mode switching; easy to show scan feedback (detection frame, success animation)
- **Cons**: More UI state to manage (overlay open/close); slightly more code than inline approach
- **Chosen** — best UX for mobile scanning, matches user preference for "button opens scanner overlay"

### Option B: Inline Viewfinder Toggle

- **Approach**: Add a toggle that switches the search input area into a camera viewfinder inline. Same space transforms between text input and camera feed.
- **Pros**: No overlay; stays within existing layout; less UI infrastructure
- **Cons**: Small camera viewfinder makes aiming harder; mode switching complexity; camera feed + search form cramped on mobile; harder to show scan guidance/feedback
- **Why not chosen**: Cramped viewport on mobile, mode switching adds UX friction

### Option C: Dedicated Scanner Route

- **Approach**: A separate /scan page with a full camera viewfinder. Scanning redirects back to results on the main page.
- **Pros**: Maximum screen real estate; complete UI freedom
- **Cons**: Page navigation disrupts flow; loses search context; two pages to maintain; feels disconnected from main search experience
- **Why not chosen**: Navigation breaks the seamless lookup flow users expect

## Agreed Approach

**Option A: Scanner Overlay Component** — The scan button opens a full-screen camera overlay that provides ample viewport for aiming at barcodes, keeps the typed input flow untouched, and offers clean component boundaries. On barcode detection, the overlay closes and the detected code flows into the existing SearchBar → detectQueryType → API call pipeline.

## Key Decisions

1. **Scanner Overlay pattern** over inline or separate route — best mobile UX, clean separation
2. **@ericblade/quagga2** for EAN-13 detection — well-maintained fork, in-browser, no server needed
3. **EAN-13 only** (`ean_reader`) — Spanish medication barcodes are EAN-13; no need for other formats
4. **Auto-submit on detection** — after barcode is detected and input populated, automatically trigger search (reduces friction)
5. **2-second detection debounce** — prevent duplicate scans from the same barcode
6. **Graceful camera fallback** — hide scan button on unsupported devices; show permission-denied message with retry/dismiss in overlay; manual typing is the fallback
7. **No new global state** — scanning state lives in SearchBar component; detected barcode populates `query` state and calls `handleSearch`
8. **Full accessibility** — aria labels, focus trapping, Escape to close, aria-live announcements for screen readers
9. **Both mobile and desktop** — rear camera on mobile, webcam on desktop, same overlay UI

## Open Questions

None — all design decisions resolved during brainstorming.
