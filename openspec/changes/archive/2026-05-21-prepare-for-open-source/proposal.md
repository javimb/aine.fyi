## Why

The repo is being prepared for public open-source release. Currently it lacks a license, contributor guide, code of conduct, and has internal-only docs at the root. Merged branches clutter the repo and there has been no security audit for hardcoded secrets. These gaps must be resolved before making the repo publicly visible to ensure legal compliance, contributor onboarding, and clean repo hygiene.

## What Changes

**License**

- From: No LICENSE file
- To: GPL-3.0 license file at repo root
- Reason: Legally required for open-source release; GPL-3.0 ensures derivatives remain open
- Impact: Non-breaking

**Package identity**

- From: `package.json` name `esunaine`
- To: `package.json` name `aine.fyi`
- Reason: Package name should match the live domain
- Impact: Non-breaking (app, not library; `"private": true` stays)

**Contributor guide**

- From: No CONTRIBUTING.md
- To: English CONTRIBUTING.md explaining opencode/OpenSpec as optional tooling, mandating spec changes in PRs
- Impact: Non-breaking

**Code of conduct**

- From: No CODE_OF_CONDUCT.md
- To: Contributor Covenant v2.1
- Impact: Non-breaking

**Docs structure**

- From: CIMA-API.md and IDEA.md at repo root
- To: CIMA-API.md moved to docs/cima-api.md; IDEA.md deleted
- Reason: Root should only contain standard open-source files; CIMA API reference is useful for contributors
- Impact: Non-breaking

**Branch hygiene**

- From: 20+ merged local and remote branches
- To: All merged branches deleted
- Reason: Clean repo history for new contributors
- Impact: Non-breaking

**Security hardening**

- From: No audit for hardcoded secrets/tokens; .gitignore may have gaps
- To: Source scanned and cleaned; .gitignore covers all sensitive patterns
- Impact: Non-breaking

## Capabilities

### New Capabilities

- `open-source-compliance`: GPL-3.0 LICENSE, CODE_OF_CONDUCT.md, CONTRIBUTING.md — the legal and community files required for public open-source release
- `security-hardening`: Audit for hardcoded URLs/tokens/secrets and ensure .gitignore covers all sensitive patterns

### Modified Capabilities

- `project-setup`: Package name changes from `esunaine` to `aine.fyi`; docs restructured (CIMA-API.md moved to docs/, IDEA.md removed); merged branches cleaned up

## Impact

- `package.json`: `name` field change only
- Root directory: New files (LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md), one file moved, one file deleted
- `docs/`: New directory with cima-api.md
- `.gitignore`: Possible additions for sensitive patterns
- No code behavior changes, no API changes, no dependency changes
