## 1. NVM Configuration

- [x] 1.1 Create `.nvmrc` file with `22` at project root
- [x] 1.2 Add `engines` field to `package.json` with `"node": ">=22"`

## 2. Spec Update

- [x] 2.1 Sync delta spec changes to `openspec/specs/project-setup/spec.md`

## 3. Verification

- [x] 3.1 Verify `nvm use` reads `.nvmrc` and switches to Node 22
- [x] 3.2 Verify `npm install` warns on incompatible Node version
