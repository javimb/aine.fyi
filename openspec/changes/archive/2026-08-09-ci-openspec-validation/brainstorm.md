## Design Summary

Add a new parallel `openspec` job to `.github/workflows/ci.yml` that validates the repository's OpenSpec specs and in-flight changes in strict mode on every pull request to `main` and every push to `main`. The job installs the OpenSpec CLI globally (pinned to `@fission-ai/openspec@1.8.0`), runs `openspec validate --all --strict`, and fails the build on any ERROR-level issue, blocking the merge. It becomes a required status check for branch protection alongside `check` and `e2e`.

## Alternatives Considered

### Option A: Global CLI in ci.yml job

- **Approach**: Add a third parallel job to `.github/workflows/ci.yml` that runs `npm i -g @fission-ai/openspec@1.8.0` then `openspec validate --all --strict --json`. No project dependencies are installed; the job mirrors the local development setup where the CLI is installed globally.
- **Pros**: Fastest job (no `npm ci`); matches how developers run the CLI locally; pinned version is reproducible; single-file change.
- **Cons**: Requires a separate global install step per run; new job must be added to GitHub branch protection as a required check.

### Option B: devDependency + npm script

- **Approach**: Add `@fission-ai/openspec` to `devDependencies` and define an `openspec:validate` npm script (`openspec validate --all --strict`). The new CI job runs `npm ci` then `npm run openspec:validate`.
- **Pros**: Version pinned in `package-lock.json`; single dependency source of truth; script is runnable locally via `npm run`.
- **Cons**: Heavier CI job (full `npm ci` of the application just to validate specs); adds a global-style CLI to the project's dependency tree; more moving parts.
- **Why not chosen**: The extra cost of a full `npm ci` is not justified for a validation-only job, and keeping the CLI out of `package.json` keeps the app dependency tree clean.

### Option C: Separate workflow file

- **Approach**: Create a dedicated `.github/workflows/openspec.yml` with its own checkout/Node/install and validation steps, independent of `ci.yml`.
- **Pros**: Clear separation from the build pipeline; triggers can be adjusted independently.
- **Cons**: Extra status check name to track; more files to maintain; the existing `check`/`e2e` jobs already set the parallel-job precedent in `ci.yml`.
- **Why not chosen**: The repository already expresses its parallel quality gates as jobs inside `ci.yml`; a separate file adds maintenance surface without benefit.

## Agreed Approach

Option A: add a new parallel `openspec` job to `.github/workflows/ci.yml`.

- Runs on the same triggers as `check`/`e2e` (PRs to `main`, pushes to `main`).
- Steps: checkout → setup Node 22 → `npm i -g @fission-ai/openspec@1.8.0` → `openspec validate --all --strict --json`.
- Non-zero exit on any ERROR-level issue fails the job and blocks the merge; INFO-level warnings (e.g., long requirement text) do not fail.
- No `npm ci`, no app dependencies — the fastest of the three jobs.
- The job is added as a required status check for `main` branch protection.

## Key Decisions

- **Scope**: Validate both main specs (`openspec/specs/**`) and in-flight changes (`openspec/changes/**`) with `--all`.
- **Trigger**: Every pull request to `main` and every push to `main` (mirrors existing CI triggers).
- **Strictness**: `--strict` mode is enabled to enforce the schema's rules (TDD ordering, conventional commits, etc.).
- **Installation**: Global install of the CLI pinned to `@fission-ai/openspec@1.8.0`, matching the local environment (v1.8.0, Node 22 satisfies the ≥ 20.19.0 requirement).
- **Placement**: New parallel job in `ci.yml`, not a separate workflow file or a step inside `check`.
- **Failure semantics**: ERROR-level issues fail the job; INFO-level issues pass.
- **Branch protection**: The `openspec` job becomes a required status check on `main` alongside `check`/`e2e` (GitHub UI setting).

## Open Questions

None blocking. Branch protection must be updated in the GitHub UI to require the new `openspec` check.
