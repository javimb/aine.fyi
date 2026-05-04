## Context

Es un AINE? is a Next.js 16 app deployed on Vercel (cdg1 region). It currently has no traffic analytics. The site is a public medicine lookup tool (Spanish CIMA API) that needs visitor insights without the overhead of a cookie consent banner. Vercel Web Analytics is cookieless, GDPR-friendly, and requires zero infrastructure beyond adding a React component and enabling the feature in the Vercel project.

## Goals / Non-Goals

**Goals:**

- Gain visibility into page views, visitors, referrers, and top pages
- Avoid any cookie consent banner or GDPR complications
- Minimal implementation effort — single component, no custom events for now

**Non-Goals:**

- Custom event tracking (button clicks, search queries, etc.)
- Speed Insights / Web Vitals monitoring
- Server-side analytics or log analysis
- A/B testing or feature flags

## Decisions

**1. Use `@vercel/analytics` (not third-party analytics)**

- _Why_: Zero-config integration with Vercel deployment, cookieless by design, no consent required. Alternatives like Plausible or Umami would need a separate hosting/service even though they're also cookieless.
- _Alternatives considered_: Plausible (self-hosted), Umami (self-hosted), Google Analytics (requires cookie consent — ruled out).

**2. Add `<Analytics />` to root layout (`src/app/layout.tsx`)**

- _Why_: Ensures every page is tracked automatically. The component is a React Server Component by default in Next.js App Router — no client-side wrapper needed.
- _Placement_: Inside `<body>`, after `{children}` — standard Vercel recommendation.

**3. Enable Web Analytics via Vercel CLI (`vercel analytics enable`)**

- _Why_: The feature must be activated at the project level before data is collected. Can also be done in the Vercel Dashboard, but CLI is reproducible and documented.

**4. No cookie consent banner**

- _Why_: Vercel Analytics uses a daily-reset hash of request metadata instead of cookies. No cookies are set, no personal data is stored, no cross-site tracking is possible. This falls below the GDPR threshold for consent requirements.

## Risks / Trade-offs

- **[Vercel platform lock-in]** → Acceptable trade-off. The app is already on Vercel; analytics is read-only and easily replaced.
- **[IP-derived hash could be argued as personal data under strict GDPR interpretation]** → Vercel's design explicitly avoids this by discarding the raw IP and only storing a daily hash. In practice, no EU authority has challenged cookieless analytics of this type.
- **[No custom events initially]** → We start with page views only. Custom events (searches, interactions) can be layered on later without breaking changes.
