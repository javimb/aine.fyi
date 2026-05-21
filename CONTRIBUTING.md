# Contributing to ¿Es un AINE?

Thanks for your interest in contributing! This document covers the basics for getting started.

## Development Setup

See the [Development Setup](README.md#development-setup) section in the README for prerequisites and instructions.

## OpenSpec Spec Changes

The `.opencode/` directory and `AGENTS.md` are optional tooling for AI-assisted development — you can safely ignore them.

However, any PR that introduces or modifies behavior **must** include corresponding OpenSpec spec changes. Spec files live under `openspec/specs/` and change proposals under `openspec/changes/`. If your PR adds or changes behavior, include the relevant spec updates alongside your code.

## Pull Requests

- Submit PRs against the `main` branch.
- Use [conventional commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `chore:`, `docs:`).
- Pre-commit hooks enforce linting, type checking, and tests — make sure they pass before pushing.

## License

By contributing, you agree that your contributions will be licensed under the GPL-3.0 license. See the [LICENSE](LICENSE) file for details.
