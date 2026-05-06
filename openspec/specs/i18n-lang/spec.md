# I18N Lang

## Purpose

Declare Spanish (Spain) as the page language via the HTML `lang` attribute and Open Graph locale metadata.

## Requirements

### Requirement: HTML lang attribute declares es-ES

The root `<html>` element SHALL declare `lang="es-ES"` to indicate that the page content is in Spanish as used in Spain.

#### Scenario: Screen reader language announcement

- **WHEN** a screen reader encounters the page
- **THEN** it SHALL announce content using Spanish (Spain) pronunciation rules

#### Scenario: Browser spell-check language

- **WHEN** a user types in the search input
- **THEN** the browser SHALL apply Spanish spell-check conventions by default

#### Scenario: Layout renders with correct lang attribute

- **WHEN** the root layout is rendered
- **THEN** the `<html>` element SHALL have the attribute `lang="es-ES"`

### Requirement: og:locale metadata declares es_ES

The page metadata SHALL include `openGraph.locale` set to `"es_ES"` so that social platforms and search engines identify the page locale as Spanish (Spain).

#### Scenario: Metadata includes og:locale

- **WHEN** the page metadata is rendered
- **THEN** the Open Graph metadata SHALL include `locale: "es_ES"`

#### Scenario: Social sharing uses correct locale

- **WHEN** a social platform crawls the page
- **THEN** it SHALL interpret the content locale as es_ES

### Requirement: Page title uses correct Spanish punctuation

The page `<title>` metadata SHALL use correct Spanish orthography for interrogative sentences, including the opening question mark (¿) and closing question mark (?). The title SHALL match the visible `<h1>` heading text exactly.

#### Scenario: Browser tab displays correct title

- **WHEN** the page is loaded in a browser
- **THEN** the `<title>` element SHALL contain `"¿Es un AINE?"` with both opening and closing question marks

#### Scenario: Open Graph title is correct

- **WHEN** a social platform or search engine reads the page metadata
- **THEN** the `openGraph.title` SHALL be explicitly set to `"¿Es un AINE?"` with proper Spanish punctuation
