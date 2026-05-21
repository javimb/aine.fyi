## Design Summary

Prepare the `es-un-aine` repo for public open-source release under GPL-3.0, renaming the package to `aine.fyi`. The focus is on legal compliance, repo hygiene, and contributor onboarding — not rebranding or cosmetic polish.

## Alternatives Considered

### Option A: Minimal Compliance

- **Approach**: Only what's legally and practically required — license, contributing guide, code of conduct, branch cleanup, security audit, package rename, docs restructure.
- **Pros**: Small scope, fast to complete, low risk of breakage.
- **Cons**: Doesn't improve README or add security policy.
- **Why not chosen**: Superseded by augmented approach below.

### Option B: Full Polish

- **Approach**: Everything in Option A plus README rewrite with badges/screenshots, SECURITY.md, FUNDING.yml, detailed audit.
- **Pros**: Professional appearance, more contributor-friendly.
- **Cons**: More work, some items (screenshots, funding) not needed yet.
- **Why not chosen**: Scope creep — extras can be separate changes later.

### Option C: Repackage & Rebrand

- **Approach**: Everything in Option B plus repo rename, GitHub Discussions, release tags, internationalized docs.
- **Pros**: Maximum discoverability.
- **Cons**: Breaks existing deployments, premature optimization.
- **Why not chosen**: Renaming and branding are premature; current identity (aine.fyi domain) is sufficient.

## Agreed Approach

Option A augmented with: security audit (hardcoded URLs/tokens scan, `.gitignore` hardening) and package rename to `aine.fyi`. This gives legal compliance + clean repo hygiene without over-engineering. The GitHub repo name (`es-un-aine`) changes separately via GitHub Settings — not part of this code change.

## Key Decisions

- **License**: GPL-3.0 (copyleft, requires derivatives to also be open source).
- **Package name**: `aine.fyi` (matches the live domain).
- **`"private": true` stays** — it's an app, not a library; prevents accidental npm publish.
- **Documentation language**: English only, even though primary audience is Spanish devs.
- **IDEA.md**: Deleted (internal design doc, superseded by specs and README).
- **CIMA-API.md**: Moved to `docs/` directory (useful API reference for contributors).
- **`.opencode/` and `AGENTS.md`**: Kept with a note in CONTRIBUTING.md explaining they're optional tooling but spec changes via OpenSpec are mandatory in PRs.
- **`openspec/` directory**: Kept as-is (specs, changes, schemas are useful project documentation).
- **GitHub issue/PR templates**: Not included — no recurrent contributions expected.
- **Branch cleanup**: Delete all merged local + remote branches.

## Open Questions

None — all resolved during brainstorming.
