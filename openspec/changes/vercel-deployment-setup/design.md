## Context

es-un-aine is a Next.js 16 app that proxies the Spanish CIMA medication API and enriches responses with AINE (anti-inflammatory) classification. It currently runs locally and has a full CI pipeline via GitHub Actions (lint, typecheck, unit tests, E2E tests). There is no deployment target configured yet.

The app is simple: one API route (`/api/cima`), one page, and in-memory data. No database, no environment secrets (no API keys needed — CIMA is public).

Vercel's Hobby (free) tier is sufficient. The CIMA API is hosted in Madrid (`cima.aemps.es`), making the `mad1` region optimal for latency.

## Goals / Non-Goals

**Goals:**

- Deploy the app to Vercel with zero config on the Dashboard (beyond repo connection)
- Ensure all build configuration is version-controlled in code
- Minimize Vercel build time by skipping redundant checks (CI already validates)
- Deploy serverless functions to `mad1` for proximity to the CIMA API
- Enforce CI quality gates via GitHub branch protection

**Non-Goals:**

- Custom domain setup (deferred)
- Production monitoring/alerting
- Multi-region deployment
- CDN caching configuration (Vercel defaults are fine)
- CI/CD pipeline changes (current GH Actions workflow is sufficient)

## Decisions

### 1. Vercel Git integration (not prebuilt CLI deployment)

**Choice**: Use Vercel's built-in Git integration for auto-deploys on push to `main`.

**Rationale**: The app builds in ~15-20s. The `--prebuilt` approach adds workflow complexity (token management, custom deploy step) for negligible savings on a personal project with generous build minute limits (6000/month on Hobby).

**Alternative considered**: GH Actions builds + `vercel deploy --prebuilt`. Rejected because it loses preview deploy URLs on PRs and adds significant workflow complexity.

### 2. Region: `mad1` (Madrid)

**Choice**: Deploy functions to `mad1`.

**Rationale**: The CIMA API (`cima.aemps.es`) is a Spanish government API hosted in Spain. Madrid is the closest Vercel region, minimizing proxy latency.

### 3. Skip TypeScript during Vercel build

**Choice**: Set `typescript.ignoreBuildErrors: true` in `next.config.ts`.

**Rationale**: GH Actions already runs `npx tsc --noEmit` as a quality gate. Running it again in Vercel is redundant and wastes build time. GitHub branch protection ensures it passes before merge. Note: Next.js 16 no longer runs ESLint during builds, so `eslint.ignoreDuringBuilds` is unnecessary.

**Alternative considered**: Keep type checks in Vercel build. Rejected because it doubles CI time for no quality benefit.

### 4. Quality enforcement via GitHub branch protection

**Choice**: Require `check` job to pass before merging to `main`.

**Rationale**: This is the actual enforcement mechanism. Vercel builds are not a quality gate — they're a deployment mechanism. GitHub branch protection makes the CI check mandatory.

### 5. No `vercel.json` build/install command overrides

**Choice**: Let Vercel auto-detect `npm run build` from the Next.js framework preset.

**Rationale**: Next.js is auto-detected. No custom build steps needed.

## Risks / Trade-offs

- **[CIMA API latency on Vercel]** → The 10s serverless function timeout on Hobby could be hit if CIMA is slow. Mitigation: monitor; upgrade to Pro (300s timeout) if needed. For now, acceptable risk since CIMA responses are typically fast.

- **[Skipping type checks in Vercel build]** → A type error that passes CI's `tsc --noEmit` but differs from Next.js's build-time check could theoretically slip through. Mitigation: both use the same TypeScript version; effectively zero risk.

- **[Vercel Hobby is for non-commercial use]** → This is a personal project. If it becomes commercial, upgrade to Pro ($20/mo).

- **[`.vercel/` directory]** → Already in `.gitignore`. The `vercel pull` step for local development creates this directory; it must never be committed.
