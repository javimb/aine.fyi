## 1. Project Scaffold

- [x] 1.1 Initialize Next.js project with App Router and TypeScript (`npx create-next-app@latest` with App Router, TypeScript, Tailwind options)
- [x] 1.2 Enable TypeScript strict mode in `tsconfig.json` (`strict: true`)
- [x] 1.3 Remove Next.js default boilerplate content from `src/app/page.tsx` and replace with a minimal placeholder

## 2. Code Quality Tooling

- [x] 2.1 Configure ESLint with Next.js recommended rules and strict settings
- [x] 2.2 Install and configure Prettier with `.prettierrc` and `.prettierignore`
- [x] 2.3 Add `npm run format` script to `package.json`
- [x] 2.4 Install lint-staged and configure pre-commit hooks in `package.json` to run ESLint and Prettier on staged files
- [x] 2.5 Install and configure Vitest with `npm run test` script (zero test files required)

## 3. UI Framework

- [x] 3.1 Initialize shadcn/ui with `npx shadcn-ui@latest init` (New York style, Zinc theme)
- [x] 3.2 Verify shadcn/ui components can be added and render correctly by adding the Button component

## 4. AINE Data Layer

- [x] 4.1 Create `data/aines.schema.ts` with Zod schemas for AINE entries (name, aliases, family)
- [x] 4.2 Create `data/aines.ts` with typed AINE blacklist containing the seven initial entries (Ibuprofeno, Ácido Acetilsalicílico, Naproxeno, Diclofenaco, Dexketoprofeno, Indometacina, Piroxicam)
- [x] 4.3 Export TypeScript types derived from the Zod schema
- [x] 4.4 Add runtime validation that the AINE data conforms to the Zod schema (validated at module load or via a build-time check)

## 5. CIMA API Proxy

- [x] 5.1 Create Next.js API route at `src/app/api/cima/route.ts`
- [x] 5.2 Implement GET handler that accepts a `nombre` query parameter
- [x] 5.3 Proxy the request to the CIMA API and return the JSON response
- [x] 5.4 Add input validation: return 400 if `nombre` parameter is missing
- [x] 5.5 Add error handling: return appropriate error responses for CIMA API failures without exposing internal details

## 6. Verification

- [x] 6.1 Run `npm run lint` and confirm zero errors
- [x] 6.2 Run `npm run format` and confirm it completes successfully
- [x] 6.3 Run `npm run test` and confirm Vitest runs (no tests found is acceptable)
- [x] 6.4 Run `npm run build` and confirm the project builds successfully
- [x] 6.5 Start dev server and confirm the placeholder page loads
- [x] 6.6 Test `/api/cima?nombre=ibuprofeno` returns a CIMA API response
