## Why

The site has no traffic analytics. We need visibility into visitor behavior — which pages are visited, where traffic comes from, and how many visitors we get — without adding a cookie consent banner. Vercel Web Analytics is cookieless and GDPR-friendly by design.

## What Changes

- Add `@vercel/analytics` package as a dependency
- Add the `<Analytics />` component to the root layout (`src/app/layout.tsx`)
- Enable Web Analytics in the Vercel project (project settings / CLI)

## Capabilities

### New Capabilities

- `vercel-analytics`: Traffic analytics for the site using Vercel's cookieless, privacy-friendly Web Analytics

### Modified Capabilities

- `vercel-deployment`: Deployment config now includes analytics enablement

## Impact

- **Dependencies**: New package `@vercel/analytics`
- **Code**: `src/app/layout.tsx` — add `<Analytics />` component inside `<body>`
- **Vercel project**: Web Analytics must be enabled in project settings or via CLI
- **No cookie banner needed**: Vercel Analytics doesn't use cookies, so no consent UI required
