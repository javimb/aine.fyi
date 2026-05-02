## MODIFIED Requirements

### Requirement: Playwright project configuration

The Playwright configuration SHALL define two projects: `smoke` (serial, single worker, 30-second timeout, fast-fail gate) and `exhaustive` (parallel, multiple workers, comprehensive). In CI, both projects SHALL run sequentially in the same job with smoke first as a fast-fail gate.

#### Scenario: Smoke project runs serially

- **WHEN** Playwright is run with the `--project=smoke` flag
- **THEN** tests SHALL run serially with a single worker and a 30-second timeout

#### Scenario: Exhaustive project runs in parallel

- **WHEN** Playwright is run with the `--project=exhaustive` flag
- **THEN** tests SHALL run with multiple workers for parallel execution

#### Scenario: CI runs smoke before exhaustive

- **WHEN** the `e2e` CI job runs
- **THEN** it SHALL execute `npm run test:e2e:smoke` before `npm run test:e2e:exhaustive`, and SHALL NOT run exhaustive E2E if smoke fails
