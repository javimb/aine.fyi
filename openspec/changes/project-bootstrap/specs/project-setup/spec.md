## ADDED Requirements

### Requirement: Next.js App Router project with TypeScript strict
The project SHALL be a Next.js application using App Router with TypeScript strict mode enabled in tsconfig.json.

#### Scenario: Project starts and serves a page
- **WHEN** the project is started with `npm run dev`
- **THEN** Next.js dev server SHALL start and serve the default page on localhost

#### Scenario: TypeScript strict mode is enforced
- **WHEN** a TypeScript file with type errors is saved
- **THEN** the build SHALL fail with type errors reported

### Requirement: ESLint configuration
The project SHALL include ESLint with Next.js recommended rules and strict configuration.

#### Scenario: Linting catches issues
- **WHEN** `npm run lint` is executed
- **THEN** ESLint SHALL analyze source files and report violations according to the configured ruleset

### Requirement: Prettier configuration
The project SHALL include Prettier with a consistent configuration file.

#### Scenario: Code formatting is enforced
- **WHEN** `npm run format` is executed
- **THEN** Prettier SHALL format all source files according to the configured rules

### Requirement: Pre-commit hooks
The project SHALL use lint-staged to run lint and format checks on staged files before each commit.

#### Scenario: Committing code with lint errors
- **WHEN** a developer commits code that fails ESLint checks
- **THEN** the commit SHALL be rejected

#### Scenario: Committing code with formatting issues
- **WHEN** a developer commits code with formatting inconsistencies
- **THEN** Prettier SHALL auto-format the staged files before the commit proceeds

### Requirement: Vitest setup
The project SHALL have Vitest installed and configured with a `npm run test` command, requiring zero test files to be present.

#### Scenario: Running tests with no test files
- **WHEN** `npm run test` is executed
- **THEN** Vitest SHALL run successfully with a "no tests found" summary (not an error)

### Requirement: Vercel deployment configuration
The project SHALL be configured for deployment on Vercel's free tier with no additional infrastructure.

#### Scenario: Deploying to Vercel
- **WHEN** the project is pushed to the main branch of a connected repository
- **THEN** Vercel SHALL build and deploy the application automatically