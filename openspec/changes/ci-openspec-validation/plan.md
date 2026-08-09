# CI OpenSpec Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a parallel `openspec` job to `.github/workflows/ci.yml` that validates all specs and in-flight changes in strict mode on every PR and push to `main`.

**Architecture:** A third parallel job in the existing CI workflow installs the pinned OpenSpec CLI (`@fission-ai/openspec@1.8.0`) globally and runs `openspec validate --all --strict --json`, failing on any ERROR-level issue. No project dependencies are installed, keeping the job fast. A Vitest regression-guard test asserts the job's shape.

**Tech Stack:** GitHub Actions, Node 22, OpenSpec CLI (`@fission-ai/openspec@1.8.0`), Vitest.

---

## Task 1: Add a regression-guard test for the `openspec` job (TDD)

**Files:**

- Create: `ci-openspec-validation.test.ts`
- Reference: `vitest-config.test.ts` (existing pattern for config regression guards)

- [ ] **Step 1: Write the failing test**

Create `ci-openspec-validation.test.ts` at the repo root:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("ci.yml openspec validation job", () => {
  const workflowPath = resolve(__dirname, ".github/workflows/ci.yml");
  const workflowContent = readFileSync(workflowPath, "utf-8");

  it("defines an openspec job", () => {
    expect(workflowContent).toContain("openspec:");
  });

  it("installs the pinned OpenSpec CLI globally", () => {
    expect(workflowContent).toContain("npm i -g @fission-ai/openspec@1.8.0");
  });

  it("runs strict validation of all specs and changes", () => {
    expect(workflowContent).toContain("openspec validate --all --strict");
  });

  it("does not install project dependencies", () => {
    const jobStart = workflowContent.indexOf("openspec:");
    const rest = workflowContent.slice(jobStart);
    expect(rest).not.toContain("npm ci");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run ci-openspec-validation.test.ts`
Expected: FAIL — `workflowContent` does not contain `openspec:` (job not yet defined).

- [ ] **Step 3: Commit the failing test**

```bash
git add ci-openspec-validation.test.ts
git commit -m "test(ci): add openspec validation job regression guard"
```

## Task 2: Add the `openspec` job to ci.yml

**Files:**

- Modify: `.github/workflows/ci.yml` (append a new job after the `e2e` job)

- [ ] **Step 1: Add the job**

Append this job to `.github/workflows/ci.yml`:

```yaml
openspec:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: 22

    - name: Install OpenSpec CLI
      run: npm i -g @fission-ai/openspec@1.8.0

    - name: Validate specs and changes
      run: openspec validate --all --strict --json
```

Place it after the `e2e:` job's closing, at the same indentation level as the `check:` and `e2e:` job keys.

- [ ] **Step 2: Run the test to verify it passes**

Run: `npx vitest run ci-openspec-validation.test.ts`
Expected: PASS — all four assertions satisfied.

- [ ] **Step 3: Verify the workflow is valid YAML with the new job**

Run: `openspec validate --all --strict`
Expected: PASS (exit 0; only INFO-level warnings, no errors).

- [ ] **Step 4: Run the full pre-commit gate**

Run: `npm run test && npx tsc --noEmit`
Expected: PASS (all existing unit tests + typecheck succeed; coverage ≥ 80%).

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat(ci): add openspec validation job"
```

## Task 3: Push and Create PR

**Files:** none (remote + GitHub)

- [ ] **Step 1: Push the branch to remote**

```bash
git push -u origin ci-openspec-validation
```

- [ ] **Step 2: Create a pull request**

```bash
gh pr create --base main --head ci-openspec-validation \
  --title "feat(ci): add openspec validation job" \
  --body "Adds a parallel openspec job to CI that runs \`openspec validate --all --strict\` on every PR and push to main, gating merges on OpenSpec artifact validity. Branch protection must be updated to require the new check."
```

- [ ] **Step 3: Note the manual follow-up**

After merge, add `openspec` as a required status check on `main` in the GitHub repo settings (branch protection UI).
