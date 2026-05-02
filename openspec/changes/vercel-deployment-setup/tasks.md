## 1. Configuration Files

- [x] 1.1 Create `vercel.json` with `$schema`, `regions: ["cdg1"]`
- [x] 1.2 Update `next.config.ts` to add `typescript: { ignoreBuildErrors: true }` (Note: `eslint.ignoreDuringBuilds` is unnecessary in Next.js 16 — ESLint is no longer run during builds)
- [x] 1.3 Verify `.vercel/` is already in `.gitignore`

## 2. Verification

- [x] 2.1 Run `npm run build` and confirm it succeeds with ESLint/TypeScript skipped
- [x] 2.2 Run `npm run lint` and `npx tsc --noEmit` and confirm they still catch errors (CI quality gate works)
- [x] 2.3 Run `npm run test:coverage` and confirm coverage thresholds are met and not decreased

## 3. Manual Setup (One-Time Dashboard Steps)

- [x] 3.1 Connect the GitHub repository to Vercel via the Dashboard (import project)
- [x] 3.2 Verify Vercel auto-detects Next.js framework preset
- [x] 3.3 Set up GitHub branch protection on `main`: require `check` status check to pass before merging
- [x] 3.4 Trigger first deployment by pushing to `main` and verify it deploys successfully
