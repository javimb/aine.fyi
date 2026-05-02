## ADDED Requirements

### Requirement: Next.js App Router project with TypeScript strict

The project SHALL be a Next.js application using App Router with TypeScript strict mode enabled in tsconfig.json. The project SHALL use Node.js 22 (LTS) as defined in `.nvmrc` and `package.json` engines.

#### Scenario: Project starts and serves a page

- **WHEN** the project is started with `npm run dev`
- **THEN** Next.js dev server SHALL start and serve the default page on localhost

#### Scenario: TypeScript strict mode is enforced

- **WHEN** a TypeScript file with type errors is saved
- **THEN** the build SHALL fail with type errors reported

#### Scenario: Node version is pinned via .nvmrc

- **WHEN** a developer runs `nvm use` in the project root
- **THEN** NVM SHALL switch to the Node.js version specified in `.nvmrc`

#### Scenario: Node version is enforced via package.json engines

- **WHEN** a developer runs `npm install` with a Node version outside the `engines` range
- **THEN** npm SHALL emit a warning about the incompatible Node version

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

The project SHALL use lint-staged to run lint and format checks on staged files before each commit. The pre-commit hook SHALL also run `npx vitest run` and `npx tsc --noEmit` to ensure tests and typechecking pass before a commit is allowed.

#### Scenario: Committing code with lint errors

- **WHEN** a developer commits code that fails ESLint checks
- **THEN** the commit SHALL be rejected

#### Scenario: Committing code with formatting issues

- **WHEN** a developer commits code with formatting inconsistencies
- **THEN** Prettier SHALL auto-format the staged files before the commit proceeds

#### Scenario: Committing code with failing tests

- **WHEN** a developer commits code that causes unit tests to fail
- **THEN** the commit SHALL be rejected

#### Scenario: Committing code with type errors

- **WHEN** a developer commits code that fails TypeScript typechecking
- **THEN** the commit SHALL be rejected

### Requirement: Vitest setup

The project SHALL have Vitest installed and configured with a `npm run test` command. The configuration SHALL use the `jsdom` environment, resolve the `@` alias to `./src`, include coverage configuration with the v8 provider, `text` and `lcov` reporters, and a minimum threshold of 80% for lines and 80% for branches. The `passWithNoTests` option SHALL NOT be present in the configuration.

#### Scenario: Running tests with no test files

- **WHEN** `npm run test` is executed and no test files are found
- **THEN** Vitest SHALL fail with a non-zero exit code

#### Scenario: Running tests with passing test files

- **WHEN** `npm run test` is executed and all test files pass
- **THEN** Vitest SHALL exit with status code 0

#### Scenario: Running tests with coverage enforcement

- **WHEN** `npm run test:coverage` is executed
- **THEN** Vitest SHALL report coverage and fail if lines or branches are below 80%

### Requirement: Vercel deployment configuration

The project SHALL be configured for deployment on Vercel's free tier with no additional infrastructure.

#### Scenario: Deploying to Vercel

- **WHEN** the project is pushed to the main branch of a connected repository
- **THEN** Vercel SHALL build and deploy the application automatically
