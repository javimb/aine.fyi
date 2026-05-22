# Retrospective: search-by-barcode

> Written: 2026-05-22 (after verify passed)
> Commit range: `04ace59..97c0b7c`
> Worktree: main checkout (feature branch `search-by-barcode`)

---

## 0. Evidence

- **Commit range**: `04ace59..97c0b7c` (4 commits)
- **Diff size**: +391 / -10 lines across 5 files
- **Tasks done**: 16/18
- **Active hours**: ~1 (estimated, single session with subagent dispatches)
- **Subagent dispatches**: 3 (one per implementation batch: Tasks 1-2, Tasks 3-4, Task 5)
- **New external dependencies**: none
- **Bugs encountered post-merge**: none (branch not yet merged)
- **OpenSpec validate state at archive**: pass (change validates; 2 pre-existing spec issues unrelated)
- **Test coverage signal**: vitest — 211 tests passing across 24 test files (12 new tests added for query-detection + 6 new search-bar tests)

Commit chain (chronological):

```
39ef8de feat: add detectQueryType and extractCnFromEan13 utilities
3e276fc feat: integrate query detection and fallback in search bar
570406c feat: update search placeholder to indicate CN and barcode support
97c0b7c fix: add numeric validation to extractCnFromEan13 per spec
```

---

## 1. Wins

- [evidence: `39ef8de`] Clean utility extraction — `detectQueryType()` and `extractCnFromEan13()` isolated in `src/lib/query-detection.ts` with 12 focused unit tests, fully decoupled from UI
- [evidence: `3e276fc`] Single-component integration — all fallback logic fits inside `search-bar.tsx` with no hook extraction needed, matching design decision #5 ("Search bar component changes")
- [evidence: `97c0b7c`] Spec-driven fix — the numeric validation in `extractCnFromEan13` was caught by spec comparison during verify and fixed in a dedicated commit, not left as tech debt
- [evidence: 211 tests] No regressions — full test suite passes after every commit; coverage maintained
- [evidence: brainstorm.md §Agreed Approach] Minimal scope honored — zero server-side changes, exactly as brainstormed

## 2. Misses

- 🟡 [painful | evidence: tasks.md §6] Push and PR tasks (6.1, 6.2) remain incomplete — manual steps requiring user action outside agent workflow. Not blocking archive but represent incomplete delivery.
- 🟡 [painful | evidence: verify.md §3] Delta specs not yet synced to `openspec/specs/` — `query-detection` spec is entirely new and `search-form` needs merging. Requires `/opsx-sync-specs` before archive.
- 📌 [nit | evidence: verify.md §4] search-form spec has two slightly different placeholder text values across scenarios. Implementation uses the correct one (the longer value matching `messages/es-ES.json`), but spec inconsistency should be cleaned up on sync.

## 3. Plan deviations

| Plan task     | What changed                                                                                 | Why                                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Task 4 Step 1 | `handleSearch` implementation includes a `processResponse` helper nested inside the function | Slight deviation from plan's inline logic — extracting `processResponse` reduced duplication between main path and fallback path |
| Task 6        | Push and PR not yet executed                                                                 | Manual action steps outside automated implementation scope                                                                       |

## 4. Skill / workflow compliance

| Skill                                            | Used |
| ------------------------------------------------ | ---- |
| superpowers:brainstorming                        | ✓    |
| superpowers:writing-plans                        | ✓    |
| superpowers:using-git-worktrees                  | ✗    |
| superpowers:subagent-driven-development          | ✓    |
| (transitive) superpowers:test-driven-development | ✓    |
| (transitive) superpowers:requesting-code-review  | ✗    |
| superpowers:finishing-a-development-branch       | ✗    |

### Deliberately Skipped Skills

- **`superpowers:using-git-worktrees`**
  - **What was skipped**: entire skill (working in main checkout instead of isolated worktree)
  - **Why this cycle**: The feature branch `search-by-barcode` already existed in the repository at checkout time. The agent was working directly on that branch in the main worktree. No conflict risk existed since only one feature was in progress. Commit `39ef8de` (first commit) shows branch was already set up.
  - **How to prevent recurrence**: `scope-judgment rule` — for single-feature branches with no parallel work, working in the main checkout is acceptable. For parallel changes or when the repo has active PRs on other branches, the worktree skill should be invoked. Add this judgment rule to AGENTS.md.

- **`(transitive) superpowers:requesting-code-review`**
  - **What was skipped**: entire skill
  - **Why this cycle**: PR has not been created yet (tasks 6.1, 6.2 are incomplete). Code review will naturally happen in the PR review flow once the branch is pushed and PR is opened. Skipping at this point avoids a redundant review cycle — the real review will occur on the PR.
  - **How to prevent recurrence**: `schema boundary case, no prevention possible` — the code review skill is meant to run before PR creation, but the PR creation tasks themselves are manual user actions. When branch push + PR creation are automated (task 6 executed), this skill will naturally be invoked. The boundary is that manual-action tasks create a gap where code review can't be requested in the normal flow.

- **`superpowers:finishing-a-development-branch`**
  - **What was skipped**: entire skill
  - **Why this cycle**: Branch has not been pushed or PR created yet (tasks 6.1, 6.2 incomplete). The finishing skill requires a remote branch and PR to operate on. Commit `97c0b7c` is the latest but hasn't been pushed.
  - **How to prevent recurrence**: `scope-judgment rule` — finishing-a-development-branch should be invoked after tasks 6.1 and 6.2 are completed. This is a natural sequencing dependency, not a workflow skip. The apply phase produced implementation commits; finishing is a post-apply step that will execute at PR time.

## 5. Surprises

- The `extractCnFromEan13` function initially lacked numeric validation — the implementation used `ean13.slice(6, 12)` without checking that the extracted substring was all digits. The spec's scenario "Extract CN from EAN-13 barcode" implied validation ("The extracted substring SHALL be validated as numeric before being returned"), and commit `97c0b7c` fixed this. The plan's code sample didn't include this validation either, so the gap was between spec requirement and plan code.
- The search-form spec contained two different placeholder text values — this wasn't caught until the verify phase. The implementation correctly used the longer, more descriptive version matching `messages/es-ES.json`.

## 6. Promote candidates → long-term learning

- [ ] 🟡 **Plan code samples should be cross-checked against spec requirements** → **Promote to memory** (type: feedback)

  > **Why**: The plan.md code sample for `extractCnFromEan13` omitted numeric validation that the spec required, causing a follow-up fix commit.
  > **How to apply**: When writing plan.md, after drafting code samples, explicitly cross-reference each against spec requirements and note any gaps before implementation begins.

- [ ] 📌 **Manual-action tasks at end of plan create a natural gap for code-review and finishing skills** → **Promote to AGENTS.md** (`Workflow routing` section)

  > **Why**: Tasks like "push branch" and "create PR" are manual user actions that block downstream skills (code-review, finishing) from executing in the automated apply flow.
  > **How to apply**: When the last N tasks in a plan are manual-action items (push, PR, deploy), note in the plan that `requesting-code-review` and `finishing-a-development-branch` should be invoked by the user after completing those manual steps, not skipped.

- [ ] 📌 **Delta spec sync should be done before verify, not left as post-verify cleanup** → **One-off** (record only, no promotion)
  > **Why**: Verify §3 flagged both delta specs as "pending sync", which could have caused confusion if the main specs were used as the verification source instead of delta specs.
  > **How to apply**: Consider adding a pre-verify step that syncs delta specs, or adjusting the verify checklist to explicitly compare against delta specs (which it already does, but the sync state is still a manual follow-up).
