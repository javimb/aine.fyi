## Context

The project currently has no README.md at the root. It is a Next.js 16 App Router application (TypeScript, Tailwind CSS v4, shadcn/ui) that helps people with NSAID (AINE) allergies check if medications contain NSAID compounds by querying the CIMA API. Onboarding a new developer requires reading IDEA.md, package.json, and the openspec specs piecemeal.

## Goals / Non-Goals

**Goals:**

- Provide a single, discoverable entry point for the project
- Document local development setup (prerequisites, install, scripts)
- Summarize the project's purpose so visitors understand it immediately
- List the tech stack and key dependencies

**Non-Goals:**

- Replacing the openspec specs or IDEA.md as the source of truth for requirements
- Documenting deployment procedures (already covered by the `project-setup` spec for Vercel)
- Writing API documentation (that belongs in dedicated specs)

## Decisions

**1. Single README.md at project root**

- Standard convention; GitHub/Gitlab render it automatically on the repository landing page.
- Alternative: a `docs/` folder — overkill for this project size; one README is sufficient.

**2. Content structure follows standard open-source template**

- Badge/header → description → getting started → scripts → tech stack → license
- Keeps navigation predictable for any developer.

**3. Link to openspec specs for detailed requirements**

- Avoid duplicating information that already lives in `openspec/specs/`.
- The README points to specs for deeper reading.

## Risks / Trade-offs

- **README may drift out of sync with actual scripts/config** → Mitigate by keeping commands generic and referencing `npm run` scripts that already exist in `package.json`, so changes to scripts are reflected automatically.
