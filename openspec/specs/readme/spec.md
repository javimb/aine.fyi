## Purpose

README — project documentation with live URL, data freshness, and development setup.

## Requirements

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
