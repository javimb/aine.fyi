## MODIFIED Requirements

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

---

## ADDED Requirements

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
