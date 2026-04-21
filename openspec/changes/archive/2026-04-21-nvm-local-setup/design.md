## Context

The esunaine project is a Next.js 16 application using React 19, TypeScript, Tailwind CSS 4, and Vitest. There is currently no `.nvmrc` file or `engines` field in `package.json`, so there is no mechanism to enforce or recommend a consistent Node.js version across developer machines. The current development environment runs Node 23.1.0.

## Goals / Non-Goals

**Goals:**

- Pin a specific Node.js version via `.nvmrc` so all developers and CI use the same runtime
- Add `engines` to `package.json` to warn/block installs on incompatible Node versions
- Update the `project-setup` spec to codify NVM and Node version requirements

**Non-Goals:**

- Switching to a different Node version manager (e.g., fnm, volta)
- Adding CI pipeline configuration (Vercel handles CI)
- Changing the package manager (npm stays the default)

## Decisions

1. **Use `.nvmrc` with a semantic version string (e.g., `22`)**
   - Pinning to a major version gives flexibility for patch updates while preventing breaking incompatibilities. Using a major-only version like `22` avoids constant `.nvmrc` churn for minor/patch bumps while still constraining the runtime.
   - Alternative: Pin to exact version (e.g., `22.14.0`). Rejected because it creates maintenance burden and developers on slightly different patches would be fine.

2. **Target Node 22 (LTS)**
   - Node 22 is the current active LTS release. Node 23 is a current (non-LTS) release. Using LTS ensures stability and long-term support for production deployments.
   - Alternative: Stay on Node 23. Rejected because it's not LTS and may have instability.

3. **Add `engines` field with `>=22` range**
   - A `>=22` range allows developers on newer compatible versions to proceed while warning those on too-old versions. Using `npm config set engine-strict true` or a `preinstall` script can enforce this strictly if desired later.
   - Alternative: Exact version match in engines. Too strict for a team with different OS packages.

## Risks / Trade-offs

- **[Risk] Developers currently on Node 23 may need to switch** → Mitigation: `nvm use` handles this seamlessly; Node 22 LTS is a drop-in replacement for this project's dependencies.
- **[Risk] `engines` field is advisory by default** → Mitigation: npm warns on mismatch; teams can enable `engine-strict` if they want hard enforcement.
