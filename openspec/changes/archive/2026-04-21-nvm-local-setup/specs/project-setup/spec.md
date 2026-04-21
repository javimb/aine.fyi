## MODIFIED Requirements

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
