## 1. Update generation script to emit `lastUpdated`

- [ ] 1.1 Add a failing test: `generateTsFile` output includes `lastUpdated` export with current date string in `YYYY-MM-DD` format
- [ ] 1.2 Update `generateTsFile` in `scripts/generate-aine-classification.ts` to accept a date parameter and include `export const lastUpdated = "<date>";` in the generated file
- [ ] 1.3 Update the `main()` function to pass `new Date().toISOString().slice(0, 10)` as the date to `generateTsFile`
- [ ] 1.4 Verify all existing spot checks and tests still pass (`npm run test`, `npm run test:coverage`)
- [ ] 1.5 Commit: `feat: add lastUpdated export to generated aine-classification`

## 2. Update generation script to inject date into README

- [ ] 2.1 Add a failing test: `updateReadmeMarker` function finds and replaces `<!-- last-updated: YYYY-MM-DD -->` in README content
- [ ] 2.2 Add a failing test: `updateReadmeMarker` function inserts the marker and date when it doesn't exist in README content
- [ ] 2.3 Implement `updateReadmeMarker` in `scripts/classify-utils.ts` — regex replace on `<!-- last-updated: \d{4}-\d{2}-\d{2} -->` and adjacent human-readable date; insert if not found
- [ ] 2.4 Update `main()` in `generate-aine-classification.ts` to call `updateReadmeMarker` after writing the `.ts` file, using `path.resolve(scriptDir, "../README.md")`
- [ ] 2.5 Verify tests pass (`npm run test`, `npm run test:coverage`)
- [ ] 2.6 Commit: `feat: update README last-updated marker from generation script`

## 3. Restructure README.md

- [ ] 3.1 Restructure `README.md`: move project description + live URL (aine.fyi) to the top, add color legend, add data freshness line with `<!-- last-updated: YYYY-MM-DD -->` marker, keep disclaimer, move prerequisites/scripts/tech stack under a `## Development Setup` heading at the bottom
- [ ] 3.2 Run `npm run generate-aines` to verify the script updates the README marker correctly
- [ ] 3.3 Verify `npm run build` and `npm run lint` still pass
- [ ] 3.4 Commit: `refactor: restructure README with live URL, data freshness, and dev setup section`

## 4. Verify GitHub Action workflow

- [ ] 4.1 Review `.github/workflows/update-aines.yml` — confirm it will pick up README changes in the PR (the `peter-evans/create-pull-request` action commits all changes, so no workflow modification needed)
- [ ] 4.2 Commit any workflow changes (if needed): `chore: update workflow for README date changes`

## 5. Push and Create PR

- [ ] 5.1 Push the branch to remote
- [ ] 5.2 Create pull request via `gh pr create`