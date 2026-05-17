# Vercel Deployment

## Purpose

Vercel deployment configuration, analytics, and CI quality gates — ensuring the application deploys to the correct region with cookieless analytics, TypeScript/eslint checks deferred to CI, and branch protection enforcing quality.

## Requirements

### Requirement: Vercel project configuration in code

The project SHALL include a `vercel.json` file at the repository root with region configuration set to `cdg1` (Paris), the closest available Vercel region to Spain, ensuring all serverless functions execute close to the CIMA API data source. The project SHALL also have Web Analytics enabled, either via the Vercel Dashboard or the `vercel analytics enable` CLI command.

#### Scenario: Deploying to the correct region

- **WHEN** Vercel deploys the application
- **THEN** all serverless functions SHALL execute in the `cdg1` region

#### Scenario: Region configuration is version-controlled

- **WHEN** a developer inspects the repository
- **THEN** the region setting SHALL be defined in `vercel.json`, not only in the Vercel Dashboard

#### Scenario: Web Analytics is enabled on the project

- **WHEN** the Vercel project is deployed
- **THEN** Web Analytics SHALL be enabled and collecting page view and visitor data

### Requirement: Minimal Vercel build with CI quality gates

The Next.js build configuration SHALL skip TypeScript checks during Vercel builds by setting `typescript.ignoreBuildErrors: true` in `next.config.ts`. Quality enforcement SHALL rely on the GitHub Actions CI pipeline and branch protection rules. Note: Next.js 16 no longer runs ESLint during builds, so no ESLint config override is needed.

#### Scenario: Vercel build skips TypeScript checks

- **WHEN** Vercel runs `next build`
- **THEN** TypeScript type checking SHALL be skipped and the build SHALL not fail due to type errors

#### Scenario: ESLint is not part of the Vercel build

- **WHEN** Vercel runs `next build`
- **THEN** ESLint SHALL not be run (Next.js 16 does not run ESLint during builds by default), and the build SHALL not fail due to lint errors

#### Scenario: CI pipeline remains the quality gate

- **WHEN** a pull request is opened against main
- **THEN** the GitHub Actions `check` job SHALL run ESLint, TypeScript, unit tests, and smoke E2E tests before the PR can be merged

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

### Requirement: Web Analytics data available in dashboard

Web Analytics SHALL be enabled on the Vercel project so that page view and visitor data is collected and visible in the Vercel Dashboard.

#### Scenario: Analytics data is available in Vercel Dashboard

- **WHEN** a user visits the site after deployment
- **THEN** page views, visitors, referrers, and demographics SHALL be visible in the Vercel project's Web Analytics dashboard

### Requirement: GitHub branch protection enforcement

The `main` branch SHALL require the `check` CI job to pass before merging. This ensures code quality is enforced at the PR level, not at the Vercel build level.

#### Scenario: PR with failing CI cannot merge

- **WHEN** a pull request has a failing `check` status check
- **THEN** GitHub SHALL prevent the pull request from being merged

#### Scenario: PR with passing CI can merge

- **WHEN** a pull request has a passing `check` status check
- **THEN** GitHub SHALL allow the pull request to be merged

### Requirement: Vercel output directory is gitignored

The `.vercel/` directory SHALL remain in `.gitignore` to prevent committing local Vercel configuration and project metadata.

#### Scenario: Running vercel pull locally

- **WHEN** a developer runs `vercel pull` locally
- **THEN** the `.vercel/` directory SHALL be created locally but SHALL NOT be tracked by git
