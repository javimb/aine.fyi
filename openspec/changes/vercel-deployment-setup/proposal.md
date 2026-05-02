## Why

The app needs to be deployed for real users. Vercel's Hobby (free) tier is sufficient for a personal project and provides automatic deployments from Git. We want CI/CD quality gates enforced through GitHub branch protection, with a minimal Vercel build that skips redundant linting/type-checking (already done in GH Actions).

## What Changes

- Add `vercel.json` with region configuration (`mad1` — Madrid, closest to the CIMA API)
- Update `next.config.ts` to skip TypeScript checks during build (CI already handles this; Next.js 16 no longer runs ESLint during builds)
- Document the one-time Vercel Dashboard setup (repo connection, branch protection)
- Add `.vercel/` to `.gitignore` (already present)

## Capabilities

### New Capabilities

- `vercel-deployment`: Configuration and setup for deploying the app to Vercel's free tier, including region selection, build optimization, and CI/CD integration

### Modified Capabilities

- `ci-pipeline`: Branch protection enforcement and CI as the quality gate before deployment
- `project-setup`: Vercel as a deployment target added to project infrastructure

## Impact

- `next.config.ts` — adds `typescript.ignoreBuildErrors`
- New `vercel.json` — platform configuration
- `.github/workflows/ci.yml` — no changes needed (already runs all quality checks)
- One-time manual step: connect repo to Vercel Dashboard, set GitHub branch protection on `main`
