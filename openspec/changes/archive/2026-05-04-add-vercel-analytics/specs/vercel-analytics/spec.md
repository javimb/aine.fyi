## ADDED Requirements

### Requirement: Vercel Analytics component in root layout

The application SHALL render the `<Analytics />` component from `@vercel/analytics/react` inside the root layout's `<body>` element, after `{children}`, to enable cookieless traffic tracking on all pages.

#### Scenario: Analytics component is present in root layout

- **WHEN** the root layout renders
- **THEN** the `<Analytics />` component SHALL be rendered inside `<body>` after `{children}`

#### Scenario: No cookie consent banner is shown

- **WHEN** a user visits any page on the site
- **THEN** no cookie consent dialog or banner SHALL be displayed, as Vercel Analytics does not use cookies

### Requirement: Vercel Analytics package dependency

The `@vercel/analytics` package SHALL be listed as a production dependency in `package.json`.

#### Scenario: Package is installed as a production dependency

- **WHEN** `npm install` is run
- **THEN** `@vercel/analytics` SHALL be present in `dependencies` (not `devDependencies`) in `package.json`

### Requirement: Web Analytics enabled on Vercel project

Web Analytics SHALL be enabled on the Vercel project so that page view and visitor data is collected and visible in the Vercel Dashboard.

#### Scenario: Analytics data is available in Vercel Dashboard

- **WHEN** a user visits the site after deployment
- **THEN** page views, visitors, referrers, and demographics SHALL be visible in the Vercel project's Web Analytics dashboard
