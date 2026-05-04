## 1. Install dependency

- [ ] 1.1 Install `@vercel/analytics` as a production dependency

## 2. Add Analytics component to layout

- [ ] 2.1 Write a failing test that verifies the `<Analytics />` component is rendered inside `<body>` in the root layout
- [ ] 2.2 Import `Analytics` from `@vercel/analytics/react` and add it to `src/app/layout.tsx` inside `<body>` after `{children}`
- [ ] 2.3 Verify the test passes
- [ ] 2.4 Commit: `feat(analytics): add Vercel Analytics component to root layout`

## 3. Enable Web Analytics on Vercel project

- [ ] 3.1 Run `vercel analytics enable` (or enable via Vercel Dashboard)
- [ ] 3.2 Commit: `chore(analytics): enable Web Analytics on Vercel project`

## 4. Verify end-to-end

- [ ] 4.1 Deploy to Vercel and confirm analytics data appears in the Vercel Dashboard after visiting the site

## 5. Push and Create PR

- [ ] 5.1 Push branch to remote
- [ ] 5.2 Create pull request via `gh` CLI
