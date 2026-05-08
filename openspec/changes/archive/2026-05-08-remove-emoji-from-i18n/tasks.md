## 1. WarningIcon Component

- [x] 1.1 Write failing test: WarningIcon renders a `<span>` with ⚠️ and `aria-hidden="true"`
- [x] 1.2 Implement `WarningIcon` component in `src/components/warning-icon.tsx` — renders `<span aria-hidden="true">⚠️</span>`
- [x] 1.3 Verify test passes
- [x] 1.4 Commit: `feat: add WarningIcon presentational component`

## 2. Update Message Catalog

- [x] 2.1 Remove all emoji characters from `messages/es-ES.json`: strip 🔴🟠🟢🟡 from status banner strings and ⚠️ from status message strings and `disclaimer.heading`
- [x] 2.2 Commit: `refactor: remove emoji from i18n message catalog`

## 3. Update ResultCard to Use WarningIcon

- [x] 3.1 Write failing test: RED result card renders `<WarningIcon />` before the message text in a flex container with `gap-1`
- [x] 3.2 Write failing test: AMBER result card renders `<WarningIcon />` before the message text
- [x] 3.3 Write failing test: YELLOW result card renders `<WarningIcon />` before the message text
- [x] 3.4 Write failing test: GREEN result card does NOT render `<WarningIcon />`
- [x] 3.5 Update `result-card.tsx` — import `WarningIcon`, wrap RED/AMBER/YELLOW message text in `<p className="..."><span className="flex items-start gap-1"><WarningIcon />{translated message}</span></p>`, leave GREEN message as plain `<p>`
- [x] 3.6 Update `result-card.test.tsx` — remove emoji from mock messages, update assertions to check for WarningIcon presence/absence instead of emoji in text
- [x] 3.7 Update `result-list.test.tsx` — remove emoji from mock status banners/messages
- [x] 3.8 Verify all result card and result list tests pass
- [x] 3.9 Commit: `feat: add WarningIcon to RED/AMBER/YELLOW result card messages`

## 4. Update Disclaimer to Use WarningIcon

- [x] 4.1 Write failing test: Disclaimer renders `<WarningIcon />` before the heading text in a flex container with `gap-1`
- [x] 4.2 Write failing test: WarningIcon in disclaimer has `aria-hidden="true"` and is not announced by screen readers
- [x] 4.3 Update `disclaimer.tsx` — import `WarningIcon`, wrap heading text in `<span className="flex items-start gap-1"><WarningIcon />{heading text}</span>`
- [x] 4.4 Update `disclaimer.test.tsx` — remove ⚠️ from mock heading, update assertions
- [x] 4.5 Verify disclaimer tests pass
- [x] 4.6 Commit: `feat: add WarningIcon to disclaimer heading`

## 5. Update Page-Level Tests and E2E Tests

- [x] 5.1 Update `page.test.tsx` — remove ⚠️ from mock disclaimer heading and Disclaimer mock
- [x] 5.2 Update e2e test assertions that match emoji in banner/message text (search for 🔴🟠🟢🟡⚠️ patterns in `e2e/` directory)
- [x] 5.3 Verify all unit and e2e tests pass
- [x] 5.4 Commit: `test: update test mocks and assertions for emoji-free i18n strings`

## 6. Update Specs

- [x] 6.1 Sync delta specs to main specs: `i18n-messages`, `result-cards`, `home-page-content` — update existing requirements to reflect no-emoji strings and WarningIcon usage
- [x] 6.2 Commit: `docs: update specs for emoji-free i18n and WarningIcon`

## 7. Push

- [x] 7.1 Push branch to remote
