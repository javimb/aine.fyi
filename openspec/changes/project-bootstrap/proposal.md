## Why

The project has no code yet. Before building any features, we need a solid foundation: a Next.js application scaffold with TypeScript, tooling, and project conventions that every future change will build on. Doing this first ensures consistent code style, type safety, and developer experience from day one — retro-fitting these into 50+ files is painful and error-prone.

## What Changes

- Scaffold a Next.js app with App Router and TypeScript strict mode
- Add Tailwind CSS + shadcn/ui for styling and component primitives
- Configure ESLint + Prettier with consistent rules
- Set up Zod for runtime data validation (starting with the AINE blacklist schema)
- Add Vitest for testing (setup only, no tests yet)
- Add pre-commit hooks (lint + format) via simple git hooks or lint-staged
- Create the initial AINE blacklist as a typed TypeScript data file (`data/aines.ts`)
- Create a CIMA API proxy route (`/api/cima`) to avoid CORS and prepare for future caching
- Set up Vercel-ready deployment configuration

## Capabilities

### New Capabilities
- `project-setup`: Next.js App Router scaffold, TypeScript config, linting, formatting, pre-commit hooks, Vitest setup
- `ui-framework`: Tailwind CSS + shadcn/ui integration and component library setup
- `aine-data`: Typed AINE blacklist data model with Zod validation schema
- `cima-proxy`: Server-side API route to proxy CIMA API requests

### Modified Capabilities

(none — this is the first change)

## Impact

- New Next.js project in repository root
- New dependencies: next, react, tailwindcss, shadcn/ui, zod, vitest, eslint, prettier
- New directory structure: `src/app/`, `src/components/`, `src/lib/`, `data/`
- Vercel deployment required (free tier)