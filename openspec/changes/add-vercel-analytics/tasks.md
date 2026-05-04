## 1. Install dependency

- [x] 1.1 Install `@vercel/analytics` as a production dependency

## 2. Add Analytics component to layout

- [x] 2.1 Write a failing test that verifies the `<Analytics />` component is rendered inside `<body>` in the root layout
- [x] 2.2 Import `Analytics` from `@vercel/analytics/react` and add it to `src/app/layout.tsx` inside `<body>` after `{children}`
- [x] 2.3 Verify the test passes
- [x] 2.4 Commit: `feat(analytics): add Vercel Analytics component to root layout`

## 3. Enable Web Analytics on Vercel project

- [x] 3.1 Run `vercel analytics enable` (or enable via Vercel Dashboard)
- [x] 3.2 Commit: `chore(analytics): enable Web Analytics on Vercel project`

## 4. Verify end-to-end

- [x] 4.1 Deploy to Vercel and confirm analytics data appears in the Vercel Dashboard after visiting the site

## 5. Push and Create PR

- [x] 5.1 Push branch to remote
- [x] 5.2 Create pull request via `gh` CLI
