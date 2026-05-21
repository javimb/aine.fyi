## ADDED Requirements

### Requirement: GPL-3.0 license file

The repository SHALL contain a `LICENSE` file at the root with the full text of the GNU General Public License v3.0.

#### Scenario: Repository root contains LICENSE file

- **WHEN** a visitor clones the repository
- **THEN** a `LICENSE` file SHALL be present at the repository root containing the full GPL-3.0 license text

#### Scenario: GitHub detects the license

- **WHEN** the repository is viewed on GitHub
- **THEN** GitHub SHALL display "GPL-3.0 license" in the repository metadata sidebar

### Requirement: Code of Conduct

The repository SHALL contain a `CODE_OF_CONDUCT.md` file at the root adopting the Contributor Covenant v2.1, with contact information for reporting conduct issues.

#### Scenario: Contributor reads the Code of Conduct

- **WHEN** a contributor opens `CODE_OF_CONDUCT.md`
- **THEN** they SHALL find the full Contributor Covenant v2.1 text including the enforcement guidelines and contact information

#### Scenario: GitHub detects the Code of Conduct

- **WHEN** the repository is viewed on GitHub
- **THEN** GitHub SHALL link to the Code of Conduct in the repository metadata

### Requirement: Contributing guide

The repository SHALL contain a `CONTRIBUTING.md` file at the root written in English. The guide SHALL explain that `.opencode/` and `AGENTS.md` are optional opencode tooling for AI-assisted development, and that spec changes via OpenSpec are mandatory in PRs.

#### Scenario: Contributor reads the Contributing guide

- **WHEN** a contributor opens `CONTRIBUTING.md`
- **THEN** they SHALL find instructions for contributing including how to set up the project, submit PRs, and the requirement to include OpenSpec spec changes

#### Scenario: Contributing guide documents opencode tooling as optional

- **WHEN** a contributor reads the opencode/OpenSpec section of `CONTRIBUTING.md`
- **THEN** they SHALL see that `.opencode/` and `AGENTS.md` are optional tooling for AI-assisted development, not required for contribution

#### Scenario: Contributing guide mandates spec changes in PRs

- **WHEN** a contributor reads the OpenSpec section of `CONTRIBUTING.md`
- **THEN** they SHALL see that any PR introducing or modifying behavior MUST include corresponding OpenSpec spec changes
