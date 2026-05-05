## Purpose

TBD

## Requirements

### Requirement: Tailwind CSS integration

The project SHALL include Tailwind CSS configured as the primary styling utility with Next.js.

#### Scenario: Using Tailwind classes in components

- **WHEN** a component uses Tailwind utility classes (e.g., `flex`, `p-4`, `text-lg`)
- **THEN** the styles SHALL be applied correctly in the rendered output

#### Scenario: Tailwind IntelliSense in editor

- **WHEN** a developer edits a file with Tailwind classes
- **THEN** IDE autocompletion SHALL suggest available Tailwind classes

### Requirement: shadcn/ui setup

The project SHALL have shadcn/ui initialized with its CLI, making composable, accessible component primitives available. All interactive UI elements (inputs, buttons, cards) SHALL use shadcn/ui components rather than raw HTML elements.

#### Scenario: Adding a shadcn/ui component

- **WHEN** a developer runs the shadcn/ui CLI to add a component (e.g., `npx shadcn@latest add input`)
- **THEN** the component source SHALL be copied into the project under `src/components/ui/` and be importable in pages

#### Scenario: shadcn/ui components render correctly

- **WHEN** a shadcn/ui component is rendered in a page
- **THEN** it SHALL display with correct styling (using the updated color tokens) and include proper ARIA attributes

#### Scenario: Search input uses shadcn/ui Input component

- **WHEN** the search form renders
- **THEN** the text input SHALL use the shadcn/ui `Input` component from `src/components/ui/input` rather than a raw `<input>` element

#### Scenario: Search button uses shadcn/ui Button component

- **WHEN** the search form renders
- **THEN** the submit button SHALL use the shadcn/ui `Button` component rather than a raw `<button>` element
