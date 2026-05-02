## ADDED Requirements

### Requirement: TDD mandate in OpenSpec configuration

The `openspec/config.yaml` context SHALL include the following testing rules: TDD is mandatory (write failing test before implementation), every tasks.md must include test tasks before implementation tasks, pre-commit gates must pass before committing, and coverage must not decrease between changes.

#### Scenario: OpenSpec config contains TDD rules

- **WHEN** the `openspec/config.yaml` file is read
- **THEN** it SHALL contain context lines mandating TDD, test-first task ordering, pre-commit gate enforcement, and coverage non-regression

#### Scenario: Change proposal references TDD rules

- **WHEN** a new OpenSpec change is created
- **THEN** the process context SHALL reflect the TDD mandate for all generated artifacts

### Requirement: Test-first task ordering in tasks.md

Every OpenSpec change `tasks.md` SHALL list test tasks (writing failing tests) before corresponding implementation tasks. No implementation task SHALL appear without a preceding test task that validates it.

#### Scenario: Tasks with test-first ordering

- **WHEN** a tasks.md is generated for a change
- **THEN** for each implementation task, there SHALL be a preceding test task that defines the expected behavior the implementation must satisfy

#### Scenario: Implementation task without preceding test

- **WHEN** a tasks.md contains an implementation task without a preceding test task for the same behavior
- **THEN** the tasks.md SHALL be considered incomplete

### Requirement: Coverage non-regression enforcement

The project SHALL enforce that code coverage does not decrease between changes. If a change causes coverage to drop below the established threshold, the CI check job SHALL fail.

#### Scenario: Change maintains or increases coverage

- **WHEN** a change is submitted and the coverage is at or above the 80% threshold
- **THEN** the CI check job SHALL pass the coverage step

#### Scenario: Change decreases coverage below threshold

- **WHEN** a change is submitted that reduces coverage below 80% for lines or branches
- **THEN** the CI check job SHALL fail on the coverage step
