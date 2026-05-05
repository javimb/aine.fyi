## Context

The project is a Next.js app deployed at **aine.fyi** via Vercel. It uses an auto-generated `data/aine-classification.ts` file (3490+ lines, ~3500 principio activo entries) that's refreshed monthly by a GitHub Action (`update-aines.yml`). The action downloads AEMPS data, runs the generation script, and creates a PR if the data changed.

Currently:
- The README describes the project but doesn't link to the live site
- There's no timestamp on the data — no way to tell how fresh the principios activos list is
- The README mixes user-facing info (what the app does) with developer info (setup instructions) in a flat structure

## Goals / Non-Goals

**Goals:**
- Add a `lastUpdated` date export to the generated data file so consumers (current: README; future: app UI) know data freshness
- Have the generation script automatically update a date marker in the README
- Restructure README to lead with the live project (aine.fyi), and move dev setup to a dedicated final section
- Keep the GitHub Action working — it should still create a PR, now including any README date changes

**Non-Goals:**
- Showing `lastUpdated` in the app UI (tracked separately for future work)
- Changing the AEMPS download logic or classification algorithm
- Altering the update-aines workflow trigger schedule

## Decisions

### 1. Timestamp format: ISO date string (`YYYY-MM-DD`)

The `lastUpdated` export will be a plain string like `"2026-05-05"`. Rationale:
- Date-only is sufficient (AEMPS data updates on a monthly schedule, not intraday)
- Easy to read in code, diff, and git blame
- No timezone ambiguity

### 2. Timestamp delivery: `lastUpdated` export in generated `.ts` file

Options considered:
- **Separate JSON file** — clean separation but another file to manage in the data workflow
- **HTML comment in README only** — simple but no programmatic access
- **Export in generated `.ts` file** — single source of truth, auto-maintained, importable by the app later

Chosen: `lastUpdated` export in the generated file. The script already writes this file; adding one more export is minimal overhead and sets up the future UI use case.

### 3. README date injection: HTML comment marker

The README will contain `<!-- last-updated: YYYY-MM-DD -->` on a dedicated line. The script uses find-and-replace on this marker. Rationale:
- Unambiguous, won't collide with prose changes
- Easy regex replacement: `/<!-- last-updated: \d{4}-\d{2}-\d{2} -->/` → new date
- The first run will insert the marker since it won't exist yet

### 4. README restructure: top-down audience priority

New section order:
1. **Title + one-liner + live URL** (aine.fyi) — first thing visitors see
2. **Color legend** — what the risk levels mean
3. **Data freshness** — "Principios activos last updated: YYYY-MM-DD" line
4. **Disclaimer** — medical notice
5. **Development Setup** — prerequisites, getting started, scripts, tech stack

The top half is for users/auditors. The bottom half is for developers.

### 5. Script updates README in the same run

The `generate-aine-classification.ts` script will:
1. Download and parse AEMPS data (existing)
2. Write `data/aine-classification.ts` with `lastUpdated` export (modified)
3. Update the `<!-- last-updated -->` marker in `README.md` (new)

This keeps the workflow unchanged — the PR already includes all file changes from the script run.

## Risks / Trade-offs

- **[README merge conflicts]** → If the README marker line is edited manually, the script's regex replace won't match. Mitigation: On first run, the script inserts the marker. On subsequent runs, it replaces the date. If the marker is deleted, the script will re-insert it on the next line matching a known pattern (the "Principios activos last updated" line).
- **[Date represents generation time, not AEMPS freshness]** → The date will be when the script ran, which is a good proxy for data freshness since the AEMPS source is checked each run. If no data changed, no PR is created and the date stays as-is.
- **[Tight coupling between generation script and README]** → The script now modifies two files instead of one. This is acceptable since both are auto-managed and committed together in the workflow PR.