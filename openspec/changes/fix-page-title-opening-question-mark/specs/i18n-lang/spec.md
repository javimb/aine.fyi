## MODIFIED Requirements

### Requirement: Page title uses correct Spanish punctuation

The page `<title>` metadata SHALL use correct Spanish orthography for interrogative sentences, including the opening question mark (¿) and closing question mark (?). The title SHALL match the visible `<h1>` heading text exactly.

#### Scenario: Browser tab displays correct title

- **WHEN** the page is loaded in a browser
- **THEN** the `<title>` element SHALL contain `"¿Es un AINE?"` with both opening and closing question marks

#### Scenario: Open Graph title is correct

- **WHEN** a social platform or search engine reads the page metadata
- **THEN** the `openGraph.title` SHALL be explicitly set to `"¿Es un AINE?"` with proper Spanish punctuation
