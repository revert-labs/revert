# Learning path — how this team levels up

This repo is deliberately built as a classroom. The product teaches distributed
systems, event sourcing, and safety engineering; the workflow teaches git, review,
and writing things down. Here's the map.

## The concepts → where they live

| Concept | Where it lives | Exercise |
|---|---|---|
| Event sourcing | `src/sdk.js` — `createLedger()` | Add a new event type; replay a run from `at(seq)` |
| Idempotency | issue #2 | Implement key injection; prove retry safety with a test |
| Compensation / sagas | `docs/research/compensation-and-rollback.md` | Write ADR-0002 about a compensable action you chose |
| Reversibility tiers | `docs/vision.md` | Classify 5 real APIs into tiers 1–5 |
| Replay-or-fork (ACRFence) | `docs/research/` + issue #5 | Write the test that proves replay is byte-identical |
| Git & review discipline | this org's own PR flow | Do a good-first-issue, get a teaching review, squash |

## How to learn here

1. **Read an ADR before writing code.** The "why" is always written down.
2. **Pick a good-first-issue.** Small, scoped, acceptance criteria included. That's
   the homework.
3. **Review others' PRs.** Explaining your thinking is how you find the holes in it.
4. **Write things down.** If it took you an hour to figure out, it's worth a doc
   line. Future-you and future-them will thank you.
5. **Ask in Discussions.** No question is too basic — this whole company is learning.

## The meta-skill

Everything in this org models what we build: **auditable, reversible, reviewed.**
The history of this repo is the first ledger we ship. Treat every commit like an
action that might need to be undone — because in this product, that's literally true.
