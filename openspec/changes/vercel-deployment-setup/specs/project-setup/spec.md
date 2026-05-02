## MODIFIED Requirements

### Requirement: Vercel deployment configuration

The project SHALL be configured for deployment on Vercel's free (Hobby) tier with no additional infrastructure. Configuration SHALL be version-controlled in code via `vercel.json` and `next.config.ts`. The deployment region SHALL be `mad1` (Madrid). The Next.js build SHALL skip TypeScript checks (`typescript.ignoreBuildErrors: true`) since these are enforced by the CI pipeline. Note: Next.js 16 no longer runs ESLint during builds, so `eslint.ignoreDuringBuilds` is unnecessary.

#### Scenario: Deploying to Vercel

- **WHEN** the project is pushed to the main branch of a connected repository
- **THEN** Vercel SHALL build and deploy the application automatically to the `mad1` region

#### Scenario: Vercel build optimization

- **WHEN** Vercel runs `next build`
- **THEN** the build SHALL skip TypeScript type checking, relying on CI for quality enforcement (ESLint is not run by Next.js 16 builds by default)

#### Scenario: Configuration is version-controlled

- **WHEN** a developer clones the repository
- **THEN** the Vercel region configuration and build optimizations SHALL be present in `vercel.json` and `next.config.ts`
