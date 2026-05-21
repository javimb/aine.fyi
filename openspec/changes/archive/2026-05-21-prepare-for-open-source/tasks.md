## 1. Security Audit

- [x] 1.1 Scan `src/`, `scripts/`, `data/`, and config files for hardcoded secrets, API keys, tokens, or passwords (patterns: `token`, `secret`, `password`, `api_key`, `api.key`)
- [x] 1.2 Scan codebase for hardcoded `https://` URLs and verify all are public endpoints (CIMA API at `cima.aemps.es` or other known public resources)
- [x] 1.3 Verify `.gitignore` contains patterns for `.env*`, `*.pem`, `/coverage`, `.vercel`, and `*.tsbuildinfo` — add any missing patterns
- [x] 1.4 Fix any findings from scans (remove secrets, move to env vars, add gitignore patterns)
- [x] 1.5 Verify `npm run build` and `npm run test` still pass after any fixes
- [x] 1.6 Commit: `chore: audit for hardcoded secrets and harden .gitignore`

## 2. License and Community Files

- [x] 2.1 Add `LICENSE` file with full GPL-3.0 text at repository root
- [x] 2.2 Verify GitHub will detect the license (standard filename `LICENSE` with GPL-3.0 header)
- [x] 2.3 Add `CODE_OF_CONDUCT.md` with Contributor Covenant v2.1 including enforcement guidelines and contact email
- [x] 2.4 Add `CONTRIBUTING.md` in English covering: project setup, how to submit PRs, opencode/OpenSpec as optional tooling (`.opencode/` and `AGENTS.md`), mandatory spec changes via OpenSpec in PRs
- [x] 2.5 Verify `npm run build` and `npm run test` still pass
- [x] 2.6 Commit: `chore: add LICENSE (GPL-3.0), CODE_OF_CONDUCT.md, and CONTRIBUTING.md`

## 3. Package Rename and Docs Restructure

- [x] 3.1 Change `package.json` `name` field from `esunaine` to `aine.fyi`
- [x] 3.2 Create `docs/` directory and move `CIMA-API.md` to `docs/cima-api.md`
- [x] 3.3 Delete `IDEA.md` from repository root
- [x] 3.4 Verify `npm run build` and `npm run test` still pass
- [x] 3.5 Commit: `refactor: rename package to aine.fyi, restructure docs`

## 4. Branch Cleanup

- [x] 4.1 Delete all local branches merged into `main` (excluding `main` and current development branch)
- [x] 4.2 Delete all remote branches merged into `origin/main` (excluding `origin/main` and `origin/HEAD`)
- [x] 4.3 Verify only `main` and active development branches remain locally and remotely

## 5. Push and Create PR

- [ ] 5.1 Push branch to remote
- [ ] 5.2 Create pull request via `gh` CLI
