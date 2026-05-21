## Overview

Prepare the `es-un-aine` repo for public open-source release under GPL-3.0, with the npm package renamed to `aine.fyi`.

## Capabilities

1. **LICENSE** — Add GPL-3.0 license file at repo root.
2. **Package rename** — Change `package.json` `name` from `esunaine` to `aine.fyi`. Keep `"private": true` (app, not library).
3. **CONTRIBUTING.md** — English-language contributor guide. Explain that `.opencode/` and `AGENTS.md` are optional opencode tooling, but spec changes via OpenSpec are mandatory in PRs.
4. **CODE_OF_CONDUCT.md** — Contributor Covenant v2.1.
5. **Docs restructure** — Move `CIMA-API.md` to `docs/cima-api.md`. Delete `IDEA.md`.
6. **Branch cleanup** — Delete all merged local and remote branches.
7. **Security audit** — Scan source for hardcoded URLs, tokens, secrets. Ensure `.gitignore` covers sensitive patterns (`.env*`, `*.pem`, coverage, etc.).

## Architecture

No architectural changes. This is a repo-hygiene change only — no code behavior changes.

## Implementation Notes

- Branch cleanup should run last to avoid disrupting work on other capabilities.
- The security audit should cover `src/`, `scripts/`, `data/`, and config files. Use `rg` or `grep` for patterns like `token`, `secret`, `password`, `api_key`, hardcoded `https://` URLs that aren't the CIMA API or public endpoints.
- The GitHub repo name (`es-un-aine`) must be changed separately via GitHub Settings → General → Repository name. This is outside the scope of code changes.
