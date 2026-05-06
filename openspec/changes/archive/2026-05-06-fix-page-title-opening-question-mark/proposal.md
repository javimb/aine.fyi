## Why

The page `<title>` metadata is `"Es un AINE?"` — missing the Spanish opening question mark (¿). The visible `<h1>` correctly reads "¿Es un AINE?", so there is an inconsistency. Proper Spanish orthography requires both opening and closing question marks, and this affects browser tabs, search engine results, and Open Graph share cards.

## What Changes

- Fix the `title` value in `layout.tsx` metadata from `"Es un AINE?"` to `"¿Es un AINE?"`

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `i18n-lang`: Add requirement that the page `<title>` SHALL use correct Spanish punctuation (opening ¿ and closing ?) for interrogative titles

## Impact

- `src/app/layout.tsx` — single-line change to the `metadata.title` string
- Browser tab titles, search results, and OG share previews will render correctly
