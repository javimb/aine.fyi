## Context

The repository uses OpenSpec for spec-driven development: 12 main specs under `openspec/specs/**` are the canonical contract, and in-flight changes live under `openspec/changes/**`. Quality is currently enforced at the merge gate only for code — `.github/workflows/ci.yml` runs two parallel jobs (`check`: build/lint/typecheck/unit tests with 80% coverage; `e2e`: Playwright smoke + exhaustive) — but OpenSpec artifacts are never validated. Invalid changes or specs can reach `main` undetected. The OpenSpec CLI is installed globally on developers' machines as `@fission-ai/openspec@1.8.0`.

## Goals / Non-Goals

**Goals:**

- Add a parallel `openspec` job to `.github/workflows/ci.yml` that validates all specs and in-flight changes on every PR to `main` and push to `main`.
- Enforce strict validation (`openspec validate --all --strict`), failing on ERROR-level issues.
- Mirror the local developer setup (global CLI, pinned version) and keep the job fast (no project dependency install).
- Make the job a required status check for `main` branch protection, gating merges alongside `check` and `e2e`.

**Non-Goals:**

- Changing how developers run the OpenSpec CLI locally (stays a global install, not a `devDependency`).
- Introducing a separate workflow file.
- Failing on INFO-level warnings (e.g., long requirement text) — those remain advisory.
- Automating the GitHub branch-protection UI update.
- Rewriting existing specs to clear their INFO-level warnings.

## Decisions

**D1: New parallel job in `ci.yml` (over separate workflow file or a step in `check`)**

- Rationale: the repo already expresses its parallel quality gates as jobs inside `ci.yml`; a dedicated `openspec` job keeps validation isolated from the heavier build job and is discoverable alongside `check`/`e2e`.
- Alternatives: separate `openspec.yml` workflow (rejected: extra file/status check to maintain, no benefit); step inside `check` (rejected: couples validation timing/caching with the app build).

**D2: Global CLI install pinned to `@fission-ai/openspec@1.8.0` (over `devDependency`)**

- Rationale: matches the local workflow exactly, avoids a full `npm ci` of the application for a validation-only job, and keeps the app dependency tree clean. Pinning guarantees reproducibility as the CLI evolves.
- Alternatives: `devDependency` + `openspec:validate` npm script (rejected: heavier job, pollutes app deps, though version would live in `package-lock.json`).

**D3: Validate both specs and changes with `--all` on every trigger (over split PR-vs-main scopes)**

- Rationale: `openspec validate --all --strict` covers `openspec/specs/**` and `openspec/changes/**` in one command; both are touched by PRs (changes in-flight, specs at archive time), so gating both on every PR is simple and comprehensive.
- Alternatives: changes only on PRs and specs only on `main` (rejected: more complex triggers, and archived-spec edits already arrive via PRs in this workflow).

**D4: Strict mode enabled**

- Rationale: the repo's `openspec/config.yaml` rules (TDD mandatory, conventional commits, per-change branches) are behavioral contracts; `--strict` enforces the schema rules, not just structural validity.
- Alternatives: non-strict (rejected: weaker guarantee; schema rules would not be enforced as failures).

## Risks / Trade-offs

- **Pinned version drift** → If a future OpenSpec release changes validation semantics, the pinned 1.8.0 keeps CI stable; upgrade deliberately like any dependency (matches the existing "upgrade OpenSpec workflows" maintenance pattern).
- **New required check can block merges during rollout** → Add the job and branch-protection rule together; the job passes on the current repo state (all specs valid, only INFO warnings), so no existing PR is unexpectedly blocked.
- **Global install failure / network flakiness in CI** → The job is quick to re-run; no app deps are involved so the failure surface is small. Optionally cache the global npm install later if it becomes slow.
- **This change's own spec delta must be valid** → The new job validates the merged result; artifacts for this change must pass `openspec validate --all --strict` before merge.

## Migration Plan

1. Add the `openspec` job to `.github/workflows/ci.yml` (checkout → setup Node 22 → `npm i -g @fission-ai/openspec@1.8.0` → `openspec validate --all --strict --json`).
2. Merge the change; the job runs on the merged `main` and passes against current repo state.
3. In the GitHub UI, add `openspec` as a required status check on `main` branch protection.
4. Rollback if needed: remove the job and the branch-protection requirement.

## Open Questions

None blocking. Branch protection must be updated in the GitHub UI to require the new `openspec` check (cannot be done from the workflow file alone).
