## MODIFIED Requirements

### Requirement: HTML lang attribute declares es-ES

The root `<html>` element SHALL declare `lang="es-ES"` to indicate that the page content is in Spanish as used in Spain. The next-intl configuration SHALL provide the locale value, and the layout SHALL derive the `lang` attribute from the next-intl locale configuration rather than hardcoding it.

#### Scenario: Screen reader language announcement

- **WHEN** a screen reader encounters the page
- **THEN** it SHALL announce content using Spanish (Spain) pronunciation rules

#### Scenario: Browser spell-check language

- **WHEN** a user types in the search input
- **THEN** the browser SHALL apply Spanish spell-check conventions by default

#### Scenario: Layout renders with lang from locale config

- **WHEN** the root layout is rendered
- **THEN** the `<html>` element SHALL have the attribute `lang` set to the locale configured in next-intl (`es-ES`)

### Requirement: og:locale metadata declares es_ES

The page metadata SHALL include `openGraph.locale` set to the locale from next-intl configuration so that social platforms and search engines identify the page locale as Spanish (Spain).

#### Scenario: Metadata includes og:locale from locale config

- **WHEN** the page metadata is rendered
- **THEN** the Open Graph metadata SHALL include `locale` set to the locale configured in next-intl (currently `es_ES`)

#### Scenario: Social sharing uses correct locale

- **WHEN** a social platform crawls the page
- **THEN** it SHALL interpret the content locale as es_ES

### Requirement: Page title and description from message catalog

The page `<title>` and `description` metadata, including Open Graph variants, SHALL be sourced from the next-intl message catalog (`app.title` and `app.description`) via `generateMetadata` with `getTranslations`, ensuring the metadata strings are centralized alongside all other UI strings.

#### Scenario: Browser tab displays title from message catalog

- **WHEN** the page is loaded in a browser
- **THEN** the `<title>` element SHALL contain the value from `messages/es-ES.json` under `app.title`

#### Scenario: Open Graph title from message catalog

- **WHEN** a social platform or search engine reads the page metadata
- **THEN** the `openGraph.title` SHALL be the value from `messages/es-ES.json` under `app.title`
