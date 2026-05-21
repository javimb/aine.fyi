# Project Setup

## Purpose

Foundational project scaffolding, tooling, and documentation — Next.js App Router configuration, TypeScript, ESLint, Prettier, pre-commit hooks, Vitest, Vercel deployment, and README.

## Requirements

### Requirement: Next.js App Router project with TypeScript strict

The project SHALL be a Next.js application using App Router with TypeScript strict mode enabled in tsconfig.json. The project SHALL use Node.js 22 (LTS) as defined in `.nvmrc` and `package.json` engines. The npm package name in `package.json` SHALL be `aine.fyi`.

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

#### Scenario: Package name matches the live domain

- **WHEN** a developer inspects `package.json`
- **THEN** the `name` field SHALL be `aine.fyi`

### Requirement: Docs directory with CIMA API reference

The repository SHALL contain a `docs/` directory with a `cima-api.md` file providing the CIMA API technical reference for contributors.

#### Scenario: Contributor finds CIMA API documentation

- **WHEN** a contributor navigates to the `docs/` directory
- **THEN** they SHALL find `cima-api.md` with the full CIMA API technical reference

#### Scenario: CIMA-API.md is no longer at the repository root

- **WHEN** a contributor looks at the repository root
- **THEN** `CIMA-API.md` SHALL NOT be present at the root level

### Requirement: No internal design doc at root

The repository root SHALL NOT contain `IDEA.md`. Internal design notes are superseded by the OpenSpec specs and README.

#### Scenario: IDEA.md is absent from repository root

- **WHEN** a contributor lists files at the repository root
- **THEN** `IDEA.md` SHALL NOT be present

### Requirement: Merged branches cleaned up

All local and remote git branches that have been merged into `main` SHALL be deleted. Only `main` and any active development branches SHALL remain.

#### Scenario: No merged branches remain locally

- **WHEN** `git branch --merged main` is executed locally
- **THEN** only `main` and the current development branch SHALL appear

#### Scenario: No merged branches remain on remote

- **WHEN** `git branch -r --merged origin/main` is executed
- **THEN** only `origin/main` and `origin/HEAD` SHALL appear

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

The project SHALL be configured for deployment on Vercel's free (Hobby) tier with no additional infrastructure. Configuration SHALL be version-controlled in code via `vercel.json` and `next.config.ts`. The deployment region SHALL be `cdg1` (Paris, the closest available Vercel region to Spain). The Next.js build SHALL skip TypeScript checks (`typescript.ignoreBuildErrors: true`) since these are enforced by the CI pipeline. Note: Next.js 16 no longer runs ESLint during builds, so `eslint.ignoreDuringBuilds` is unnecessary.

#### Scenario: Deploying to Vercel

- **WHEN** the project is pushed to the main branch of a connected repository
- **THEN** Vercel SHALL build and deploy the application automatically to the `cdg1` region

#### Scenario: Vercel build optimization

- **WHEN** Vercel runs `next build`
- **THEN** the build SHALL skip TypeScript type checking, relying on CI for quality enforcement (ESLint is not run by Next.js 16 builds by default)

#### Scenario: Configuration is version-controlled

- **WHEN** a developer clones the repository
- **THEN** the Vercel region configuration and build optimizations SHALL be present in `vercel.json` and `next.config.ts`

### Requirement: README.md exists at project root

A `README.md` file SHALL exist at the project root containing the following sections in order: project description with live URL, color-coded risk indicator legend, data freshness indicator, legal disclaimer, and a development setup section at the end.

#### Scenario: Visitor opens the repository

- **WHEN** a visitor navigates to the repository on GitHub
- **THEN** GitHub SHALL render the README.md on the repository landing page

### Requirement: Project description with live URL

The README SHALL contain a project description section that explains the application identifies whether commercial medications contain NSAID (AINE) compounds by querying the CIMA API, displays the result via a color-coded risk indicator, and links to the live deployment at **aine.fyi**.

#### Scenario: New visitor reads the project description

- **WHEN** a new visitor reads the project description
- **THEN** they SHALL understand the app's purpose and see a link to the live site at aine.fyi

### Requirement: Data freshness indicator

The README SHALL include a line showing when the principios activos classification was last updated, using the format `<!-- last-updated: YYYY-MM-DD -->` as an HTML comment alongside a human-readable date string. This line SHALL be automatically maintained by the generation script.

#### Scenario: Visitor checks data freshness

- **WHEN** a visitor reads the data freshness line
- **THEN** they SHALL see the date the principios activos list was last updated

#### Scenario: Generation script updates the freshness marker

- **WHEN** the `generate-aines` script runs
- **THEN** it SHALL update the `<!-- last-updated -->` HTML comment and the human-readable date string in `README.md` with the current date

### Requirement: Development Setup section

The README SHALL contain a `Development Setup` section (at the end of the document) with prerequisites (Node.js version), installation steps (`npm install`), the command to start the dev server (`npm run dev`), available scripts, and tech stack overview.

#### Scenario: Developer clones the repo and follows instructions

- **WHEN** a developer clones the repository and follows the Development Setup section
- **THEN** they SHALL be able to run the application locally on `npm run dev`

### Requirement: Available scripts documentation

The README SHALL list all npm scripts from `package.json` (`dev`, `build`, `start`, `lint`, `format`, `test`) with a one-line description for each, inside the Development Setup section.

#### Scenario: Developer looks up available commands

- **WHEN** a developer reads the scripts section
- **THEN** they SHALL know what each npm script does without opening `package.json`

### Requirement: Tech stack overview

The README SHALL list the key technologies: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, and the CIMA API, inside the Development Setup section.

#### Scenario: Developer reviews dependencies

- **WHEN** a developer reads the tech stack section
- **THEN** they SHALL know the primary frameworks and libraries used in the project

### Requirement: Legal disclaimer

The README SHALL include a disclaimer stating the application is an informational tool based on public data and does not replace professional medical advice.

#### Scenario: User sees medical disclaimer

- **WHEN** a user reads the disclaimer section
- **THEN** they SHALL be informed that the tool does not substitute professional medical consultation
