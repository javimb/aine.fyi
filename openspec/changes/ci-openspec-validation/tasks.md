> **For agentic workers:** Follow apply's instructions and don't implement these tasks directly. Instead, use superpowers:subagent-driven-development to implement the plan.md.

## 1. Add OpenSpec validation job to CI (TDD)

- [x] 1.1 Write a failing regression-guard test (e.g. `scripts/ci-openspec-validation.test.ts` or alongside `vitest-config.test.ts`) that reads `.github/workflows/ci.yml` and asserts an `openspec` job exists, installs `@fission-ai/openspec@1.8.0` globally, runs `openspec validate --all --strict`, and does NOT run `npm ci`
- [x] 1.2 Add the `openspec` job to `.github/workflows/ci.yml` (checkout → setup Node 22 → global CLI install pinned to 1.8.0 → `openspec validate --all --strict --json`) so the new test passes
- [x] 1.3 Commit: `feat(ci): add openspec validation job`

## 2. Verify and Push and Create PR

- [x] 2.1 Run `openspec validate --all --strict` locally and confirm it passes
- [x] 2.2 Run `npm run test` and `npx tsc --noEmit` to confirm pre-commit gates pass
- [ ] 2.3 Commit: `chore(opsx): add ci-openspec-validation artifacts`

## 3. Push and Create PR

- [ ] 3.1 Push the branch to remote
- [ ] 3.2 Create a pull request via `gh` CLI
