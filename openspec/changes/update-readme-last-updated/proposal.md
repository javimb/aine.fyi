## Why

The README doesn't reflect the live project (aine.fyi is now deployed) and there's no way to tell how fresh the principios activos data is. Visitors and auditors need to see when the AINE classification was last updated, and the script should maintain this timestamp automatically.

## What Changes

- Restructure README.md: project description and live URL (aine.fyi) first, development setup moved to a final section
- Add a `lastUpdated` date export to the auto-generated `data/aine-classification.ts`
- Update `scripts/generate-aine-classification.ts` to write the current date into the generated file and update a `<!-- last-updated: YYYY-MM-DD -->` marker in `README.md`
- Update the GitHub Action workflow to account for the README being modified alongside the data file

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `readme`: Requirements changing — restructure to lead with live project info, add data freshness indicator, move dev setup to its own section
- `aine-classification-generation`: Requirements changing — script must also write `lastUpdated` export and update README marker
- `aine-data`: Requirements changing — generated file must include `lastUpdated` export

## Impact

- `README.md` — restructured content and new HTML comment marker for date injection
- `scripts/generate-aine-classification.ts` — adds date stamping logic (file header and README marker)
- `data/aine-classification.ts` — new `lastUpdated` export in auto-generated file
- `.github/workflows/update-aines.yml` — PR will now include README changes alongside data changes