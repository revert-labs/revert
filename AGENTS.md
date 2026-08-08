# AGENTS.md — conventions for AI agents in this repo

This file governs how agentic tools (Claude Code, Codex, Cursor, etc.) work in `revert`.
If you are an agent, follow these rules; humans review them too.

## Workflow (PR-driven, always)

1. Every change starts from an issue or a clear task description.
2. Create a branch: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, `chore/<slug>`.
3. Work in small, reviewable commits. Never push directly to `main`.
4. Open a PR with a description explaining **why** (not just what).
5. Wait for review + CI green before merge. Squash on merge.

## Commit style

- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- One logical change per commit. No unrelated edits, no `git add -A` broad staging.
- Keep commits small enough to review in under five minutes.

## Definition of done

- Code ships with tests (`node --test` must pass).
- New public API surface is documented in JSDoc and reflected in `docs/`.
- No secrets, keys, or tokens in code, commits, or logs.
- No new dependencies without discussion — this project is deliberately zero-dependency.

## Correctness rules (the product is about trust)

- This product records agent actions. The repo's own history must model that:
  every change is auditable, atomic, and reversible (that's what branches + PRs are for).
- When in doubt about an undo/inverse semantic, write the test first that proves it.
- Never "fix" a test by weakening it. Fix the code.

## Scope discipline

- The open core lives here. Anything touching cross-service compensation, compliance
  exports, or the hosted control plane belongs in the **private** `revert-enterprise`
  repo — never commit it here.
- Keep the dependency footprint at zero. If you must add a dep, argue it in the PR.
