## Context

"Es un AINE?" is a new project — no code exists yet. This change establishes the foundational layer that all future features will build on. The project is a Next.js web app that helps people with NSAID allergies check whether a commercial drug contains hidden NSAIDs. It will call the CIMA API (Spanish Medicines Agency) and cross-reference results against a curated AINE blacklist.

The project targets Vercel's free tier for deployment. The developer is backend-oriented, comfortable with TypeScript, and values simplicity and correctness for a health-related tool.

## Goals / Non-Goals

**Goals:**

- Scaffold a production-ready Next.js App Router project with TypeScript strict mode
- Establish consistent code style and formatting enforced by tooling (ESLint, Prettier)
- Set up a component library foundation (Tailwind + shadcn/ui) for the search-centric UI
- Create a typed, version-controlled AINE blacklist data model with validation
- Provide a server-side proxy to the CIMA API (avoiding CORS and enabling future caching)
- Configure Vitest for future testing with zero tests required now
- Ensure the project deploys cleanly to Vercel free tier

**Non-Goals:**

- Building the actual search UI — that's a future change
- Implementing CIMA API response parsing or AINE matching logic — future change
- Setting up CI/CD pipelines or deployment automation beyond Vercel's defaults
- E2E testing setup
- Offline/PWA support
- i18n or multi-language support
- Database or external data store (AINE data lives in-code)

## Decisions

### 1. Next.js App Router with TypeScript strict mode

**Choice:** Next.js 14+ with App Router and `strict: true` in tsconfig.

**Rationale:** App Router is the modern standard for Next.js. It provides server components, API routes, and SSR out of the box. TypeScript strict mode catches errors early — critical for a health data application where incorrect matching could have consequences.

**Alternatives considered:**

- _Pages Router_: Legacy approach, no reason to use it for a new project.
- _Remix_: Good fit for backend-minded devs, but Next's Vercel integration and ecosystem are stronger for the reference-site aspiration.
- _Astro_: Tempting for content sites, but the interactive search UX and API proxy needs make it a poor fit once you go beyond landing pages.

### 2. Tailwind CSS + shadcn/ui

**Choice:** Tailwind for utility styling + shadcn/ui for accessible, composable component primitives.

**Rationale:** This is the standard stack in the Next.js ecosystem. shadcn/ui provides copy-paste components (not a dependency) with built-in accessibility. The project's UI is minimalist (search bar → results), so a lightweight approach fits.

**Alternatives considered:**

- _Plain CSS modules_: Too verbose for a search-centric UI.
- _Chakra UI / MUI_: Heavier than needed; adds dependency weight.
- _Radix-only_: shadcn/ui already wraps Radix with better DX for this stack.

### 3. AINE blacklist as typed TypeScript data

**Choice:** Store the AINE blacklist in `data/aines.ts` as typed constants, validated with Zod schemas.

**Rationale:** The list is ~30-50 items of domain knowledge. Keeping it in the repo means it's version-controlled (health data needs an audit trail), has zero latency, and works at build time and runtime. Zod provides runtime validation and type inference. `git log` becomes the changelog for when substances are added.

**Alternatives considered:**

- _JSON file_: Loses type safety without Zod wrapping.
- _Database (SQLite/Postgres)_: Overkill for ~50 entries that rarely change. Adds infra complexity.
- _Remote API_: Introduces a dependency and latency the project doesn't need.

### 4. CIMA API proxy via Next.js API route

**Choice:** Single Next.js API route at `/api/cima` that proxies requests to CIMA.

**Rationale:** The CIMA API doesn't require authentication but has CORS restrictions. A server-side proxy solves CORS and creates a natural insertion point for future caching (Vercel KV) and rate limiting. The proxy also abstracts the CIMA API contract from the frontend, so if CIMA changes, only the proxy needs updating.

**Alternatives considered:**

- _Direct client-side calls_: Blocked by CORS.
- _Separate backend service_: Overkill when Next.js API routes handle this natively.

### 5. Vitest (setup only)

**Choice:** Install and configure Vitest with no test files.

**Rationale:** The highest-risk logic (AINE matching) will need thorough tests, but writing tests before the code they'd test exists is premature. Setting up the runner now means the infrastructure is ready; adding tests is a one-liner later.

### 6. Linting and formatting toolchain

**Choice:** ESLint (Next.js defaults + strict rules) + Prettier + lint-staged for pre-commit hooks.

**Rationale:** Consistent code style from day one prevents retrofitting cost. Pre-commit hooks ensure every commit passes lint and format checks. This is nearly free to set up and pays for itself immediately.

## Risks / Trade-offs

- **[Risk] AINE data in code means deployments to update** → Acceptable trade-off. The list changes rarely, and version control provides an audit trail. When updates become frequent enough, migrating to Vercel KV is straightforward.
- **[Risk] CIMA API instability or schema changes** → The proxy route isolates this. If CIMA changes, only `/api/cima` needs updating. Future caching layer will also buffer against downtime.
- **[Risk] shadcn/ui lock-in** → Minimal risk. shadcn/ui components are copied into the project (not npm dependencies), so they can be modified freely.
- **[Trade-off] No E2E tests yet** → Acceptable for bootstrap. Will be added when the search flow is implemented.

## Open Questions

- None — all key decisions have been made during exploration.
