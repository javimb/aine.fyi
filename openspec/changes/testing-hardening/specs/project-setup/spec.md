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
