## Why

The project has no Node.js version management, leading to inconsistencies across developer machines. Without a pinned version, collaborators may run into incompatibilities (e.g., React 19 / Next.js 16 require Node 18+). NVM with a `.nvmrc` file provides a lightweight, standard way to ensure all developers use the same Node version.

## What Changes

- Add a `.nvmrc` file pinning the project's Node.js version
- Add an `engines` field to `package.json` to enforce the Node version range at install time
- Update project documentation to mention NVM setup steps

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `project-setup`: Add Node.js version pinning and NVM setup requirements

## Impact

- `package.json`: new `engines` field
- `.nvmrc`: new file at project root
- `openspec/specs/project-setup/spec.md`: updated requirements for Node version enforcement
