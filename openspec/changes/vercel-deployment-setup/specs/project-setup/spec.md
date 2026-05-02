## MODIFIED Requirements

### Requirement: Vercel deployment configuration

The project SHALL be configured for deployment on Vercel's free (Hobby) tier with no additional infrastructure. Configuration SHALL be version-controlled in code via `vercel.json` and `next.config.ts`. The deployment region SHALL be `mad1` (Madrid). The Next.js build SHALL skip ESLint and TypeScript checks (`eslint.ignoreDuringBuilds: true`, `typescript.ignoreBuildErrors: true`) since these are enforced by the CI pipeline.

#### Scenario: Deploying to Vercel

- **WHEN** the project is pushed to the main branch of a connected repository
- **THEN** Vercel SHALL build and deploy the application automatically to the `mad1` region

#### Scenario: Vercel build optimization

- **WHEN** Vercel runs `next build`
- **THEN** the build SHALL skip ESLint and TypeScript type checking, relying on CI for quality enforcement

#### Scenario: Configuration is version-controlled

- **WHEN** a developer clones the repository
- **THEN** the Vercel region configuration and build optimizations SHALL be present in `vercel.json` and `next.config.ts`
