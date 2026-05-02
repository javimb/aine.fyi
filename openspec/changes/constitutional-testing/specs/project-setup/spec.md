## MODIFIED Requirements

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
