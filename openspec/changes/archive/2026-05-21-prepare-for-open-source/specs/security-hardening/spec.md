## ADDED Requirements

### Requirement: No hardcoded secrets or tokens in source code

The source code in `src/`, `scripts/`, `data/`, and configuration files SHALL NOT contain hardcoded secrets, API keys, tokens, or passwords. Any sensitive values MUST be loaded from environment variables or external configuration.

#### Scenario: Source code scan finds no secrets

- **WHEN** the codebase is scanned with a pattern matching common secret formats (token, secret, password, api_key, api.key)
- **THEN** no hardcoded sensitive values SHALL be found in source or config files

#### Scenario: Hardcoded HTTPS URLs are only public endpoints

- **WHEN** the codebase is scanned for hardcoded `https://` URLs
- **THEN** all found URLs SHALL be either the CIMA API public endpoint (`cima.aemps.es`) or other known public resources — no internal or authenticated endpoints

### Requirement: Gitignore covers sensitive patterns

The `.gitignore` file SHALL include patterns that prevent sensitive files from being committed: `.env*` (environment files), `*.pem` (certificate/key files), `/coverage` (coverage output), `.vercel` (Vercel local config), and `*.tsbuildinfo` (TypeScript build artifacts).

#### Scenario: Environment files are ignored

- **WHEN** a developer creates a `.env` or `.env.local` file
- **THEN** git SHALL NOT track the file

#### Scenario: PEM key files are ignored

- **WHEN** a developer adds a `.pem` file to the project directory
- **THEN** git SHALL NOT track the file

#### Scenario: Existing gitignore patterns are verified present

- **WHEN** `.gitignore` is reviewed
- **THEN** it SHALL contain patterns for `.env*`, `*.pem`, `/coverage`, `.vercel`, and `*.tsbuildinfo`
