# Prepare for Open Source — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `es-un-aine` repo legally and practically ready for public open-source release under GPL-3.0.

**Architecture:** Repo-hygiene change only — no code behavior changes. Adds license, community files, and security hardening; renames the npm package; restructures docs; cleans merged branches.

**Tech Stack:** Git, npm, bash (rg/grep for scanning)

---

## Task 1: Security Audit

**Files:**

- Review: `src/**/*.ts`, `src/**/*.tsx`, `scripts/**/*.ts`, `data/**/*.ts`, `.github/**/*.yml`, `*.json`, `*.ts`, `*.mjs`
- Modify: `.gitignore` (if patterns missing)

- [ ] **Step 1: Scan for hardcoded secrets/tokens/passwords**

Run:

```bash
rg -i 'token|secret|password|api_key|api\.key' --type ts --type tsx --type js --type json --type yml src/ scripts/ data/ .github/ || echo "No secrets found"
```

Expected: No matches in source code. If matches found, inspect each one to determine if it's a hardcoded secret vs. a variable name or comment.

- [ ] **Step 2: Scan for hardcoded HTTPS URLs**

Run:

```bash
rg 'https://' --type ts --type tsx --type js --type json src/ scripts/ data/ || true
```

Expected: All URLs are public endpoints — primarily `https://cima.aemps.es/cima/rest/`. No internal or authenticated endpoints.

- [ ] **Step 3: Verify `.gitignore` patterns**

Run:

```bash
rg '\.env\*|\.pem|/coverage|\.vercel|tsbuildinfo' .gitignore || echo "Missing patterns"
```

Expected: All 5 patterns present. Current `.gitignore` at line 36 has `.env*`, line 27 has `*.pem`, line 5 has `/coverage`, line 39 has `.vercel`, line 42 has `*.tsbuildinfo`. If any are missing, add them.

- [ ] **Step 4: Fix any findings**

If scans in Steps 1-2 found actual secrets: remove them, move values to environment variables, and update the code to read from `process.env`. If `.gitignore` is missing patterns from Step 3, add them.

- [ ] **Step 5: Verify build and tests still pass**

Run:

```bash
npm run build && npm run test
```

Expected: Both succeed with exit code 0.

- [ ] **Step 6: Commit**

```bash
git add .gitignore
git commit -m "chore: audit for hardcoded secrets and harden .gitignore"
```

Only commit if changes were made. If no findings and no `.gitignore` changes needed, skip this commit.

---

## Task 2: Add LICENSE file (GPL-3.0)

**Files:**

- Create: `LICENSE`

- [ ] **Step 1: Create the LICENSE file**

Download the official GPL-3.0 text:

```bash
curl -s https://www.gnu.org/licenses/gpl-3.0.txt -o LICENSE
```

Then add the standard GPL header block at the top with the project name and year:

```
¿Es un AINE?
Copyright (C) 2026 Javier Martínez

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

The rest of the file is the standard GPL-3.0 full text from the curl command.

- [ ] **Step 2: Verify LICENSE is valid**

Run:

```bash
head -5 LICENSE
```

Expected: Shows the copyright notice and GPL-3.0 reference.

- [ ] **Step 3: Verify build still passes**

Run:

```bash
npm run build && npm run test
```

Expected: Both succeed (LICENSE doesn't affect code).

- [ ] **Step 4: Commit**

```bash
git add LICENSE
git commit -m "chore: add GPL-3.0 LICENSE"
```

---

## Task 3: Add CODE_OF_CONDUCT.md

**Files:**

- Create: `CODE_OF_CONDUCT.md`

- [ ] **Step 1: Create CODE_OF_CONDUCT.md with Contributor Covenant v2.1**

Write the full Contributor Covenant Code of Conduct v2.1 to `CODE_OF_CONDUCT.md`. The enforcement contact should be the repository owner's email. Use the official template from https://www.contributor-covenant.org/version/2/1/code_of_conduct/. Replace `[Community Name]` with `¿Es un AINE?` and `[INSERT CONTACT METHOD]` with the repo owner's preferred contact (e.g., opening a GitHub issue).

- [ ] **Step 2: Verify file exists and is well-formed**

Run:

```bash
head -5 CODE_OF_CONDUCT.md
```

Expected: Shows "# Contributor Covenant Code of Conduct" heading.

- [ ] **Step 3: Commit**

```bash
git add CODE_OF_CONDUCT.md
git commit -m "chore: add CODE_OF_CONDUCT.md (Contributor Covenant v2.1)"
```

---

## Task 4: Add CONTRIBUTING.md

**Files:**

- Create: `CONTRIBUTING.md`

- [ ] **Step 1: Create CONTRIBUTING.md**

Write the file with these sections:

1. **Contributing to ¿Es un AINE?** — brief intro
2. **Development Setup** — link to README Development Setup section, prerequisites
3. **Making Changes** — create a branch, make changes, run tests
4. **OpenSpec Spec Changes** — explain that `.opencode/` and `AGENTS.md` are optional opencode tooling for AI-assisted development; any PR introducing or modifying behavior MUST include corresponding OpenSpec spec changes (files under `openspec/specs/` or `openspec/changes/`)
5. **Pull Requests** — submit PR against `main`, conventional commits, pre-commit hooks enforce lint/typecheck/tests
6. **License** — contributions are licensed under GPL-3.0

- [ ] **Step 2: Verify file exists**

Run:

```bash
head -5 CONTRIBUTING.md
```

Expected: Shows "## Contributing to ¿Es un AINE?" or similar heading.

- [ ] **Step 3: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "chore: add CONTRIBUTING.md"
```

---

## Task 5: Rename package and restructure docs

**Files:**

- Modify: `package.json:2` (change `name` field)
- Move: `CIMA-API.md` → `docs/cima-api.md`
- Delete: `IDEA.md`

- [ ] **Step 1: Rename package in package.json**

In `package.json`, change line 2 from `"name": "esunaine"` to `"name": "aine.fyi"`. Do not change `"private": true` — it stays.

- [ ] **Step 2: Create docs directory and move CIMA-API.md**

Run:

```bash
mkdir -p docs && git mv CIMA-API.md docs/cima-api.md
```

- [ ] **Step 3: Delete IDEA.md**

Run:

```bash
git rm IDEA.md
```

- [ ] **Step 4: Verify build and tests still pass**

Run:

```bash
npm run build && npm run test
```

Expected: Both succeed. Package rename and doc moves don't affect runtime behavior.

- [ ] **Step 5: Commit**

```bash
git add package.json docs/ IDEA.md
git commit -m "refactor: rename package to aine.fyi, restructure docs"
```

---

## Task 6: Branch Cleanup

**Files:**

- None (git operations only)

- [ ] **Step 1: List and delete merged local branches**

Run:

```bash
git branch --merged main | grep -v '^\*\|main' | xargs git branch -d
```

Expected: All merged local branches deleted. Only `main` and the current development branch remain.

- [ ] **Step 2: List and delete merged remote branches**

Run:

```bash
git branch -r --merged origin/main | grep -v 'origin/main\|origin/HEAD' | sed 's/origin\///' | xargs -I{} git push origin --delete "{}"
```

Expected: All merged remote branches deleted. Only `origin/main` and `origin/HEAD` remain.

- [ ] **Step 3: Verify only expected branches remain**

Run:

```bash
git branch && echo "---" && git branch -r
```

Expected: Locally only `main` and the current development branch. Remotely only `origin/main` and `origin/HEAD`.

---

## Task 7: Push and Create PR

- [ ] **Step 1: Push branch to remote**

Run:

```bash
git push -u origin javimb/prepare-for-open-source
```

(Use the actual current branch name if different.)

- [ ] **Step 2: Create pull request**

Run:

```bash
gh pr create --title "chore: prepare repository for open-source release" --body "$(cat <<'EOF'
## Summary

- Add GPL-3.0 LICENSE, CODE_OF_CONDUCT.md (Contributor Covenant v2.1), CONTRIBUTING.md
- Rename npm package from `esunaine` to `aine.fyi`
- Move `CIMA-API.md` to `docs/cima-api.md`, delete `IDEA.md`
- Audit for hardcoded secrets/tokens and harden `.gitignore`
- Clean up all merged local and remote branches

## Test plan

- [ ] `npm run build` passes
- [ ] `npm run test` passes
- [ ] `npm run lint` passes
- [ ] GitHub detects GPL-3.0 license in repo sidebar
- [ ] No hardcoded secrets in source code
- [ ] `.gitignore` covers all sensitive patterns
EOF
)"
```
