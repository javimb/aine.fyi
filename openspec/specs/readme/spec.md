## ADDED Requirements

### Requirement: README.md exists at project root

A `README.md` file SHALL exist at the project root containing the following sections in order: project description, prerequisites, getting started (install & run), available scripts, tech stack, and a legal disclaimer.

#### Scenario: Visitor opens the repository

- **WHEN** a visitor navigates to the repository on GitHub
- **THEN** GitHub SHALL render the README.md on the repository landing page

### Requirement: Project description section

The README SHALL contain a project description section that explains the application identifies whether commercial medications contain NSAID (AINE) compounds by querying the CIMA API, and displays the result via a color-coded risk indicator.

#### Scenario: New visitor reads the project description

- **WHEN** a new visitor reads the project description
- **THEN** they SHALL understand the app's purpose: helping people with NSAID allergies check medication safety

### Requirement: Local development setup instructions

The README SHALL contain a `Getting Started` section with prerequisites (Node.js version), installation steps (`npm install`), and the command to start the dev server (`npm run dev`).

#### Scenario: Developer clones the repo and follows instructions

- **WHEN** a developer clones the repository and follows the Getting Started section
- **THEN** they SHALL be able to run the application locally on `npm run dev`

### Requirement: Available scripts documentation

The README SHALL list all npm scripts from `package.json` (`dev`, `build`, `start`, `lint`, `format`, `test`) with a one-line description for each.

#### Scenario: Developer looks up available commands

- **WHEN** a developer reads the scripts section
- **THEN** they SHALL know what each npm script does without opening `package.json`

### Requirement: Tech stack overview

The README SHALL list the key technologies: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, and the CIMA API.

#### Scenario: Developer reviews dependencies

- **WHEN** a developer reads the tech stack section
- **THEN** they SHALL know the primary frameworks and libraries used in the project

### Requirement: Legal disclaimer

The README SHALL include a disclaimer stating the application is an informational tool based on public data and does not replace professional medical advice.

#### Scenario: User sees medical disclaimer

- **WHEN** a user reads the disclaimer section
- **THEN** they SHALL be informed that the tool does not substitute professional medical consultation
