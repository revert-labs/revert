# Vision — Revert Labs

> **Git for AI agent actions. Every action is a commit. Anything can be rolled back.**

## The problem, sharpened

AI agents don't fail with a stack trace. They do something *plausible but wrong* —
delete the wrong database, email the wrong person, approve the wrong invoice. And when
they do: no rollback, no audit trail, no containment, no learning.

The math is unforgiving: **85% reliability per step × 10 steps ≈ 20% end-to-end
success.** Making agents 90% reliable still fails 65% of 10-step workflows. **You don't
fix this by making agents perfect. You fix it by making failure survivable.**

## The product

An event-sourced action ledger for AI agents, with a rollback engine that actually works.

1. **The Intercept** — SDK wrapping agent tool calls. Every action becomes an immutable
   event: endpoint, payload, **before-image**, idempotency key, response, causal chain.
   Instrumentation, not interception (the OpenTelemetry model) — nothing is rerouted,
   so there's no MITM trust problem.
2. **The Undo Engine** — reversibility tiers (idempotent / self-reversing / compensating /
   side-effect-heavy / irreversible). Auto-inverse for tiers 1–3, human flag for tier 4,
   prevention for tier 5. Compensation is a *forward-moving event* — undo appends, it
   never erases history.
3. **The Timeline** — a git-like debugger for agent actions: branch points, state diffs,
   one-click revert to any step.

## The five design decisions

1. **Instrumentation, not interception.** The OTel model kills the MITM trust objection.
2. **Ledger-first, undo as the killer feature.** Compliance sells the ledger
   (SOC2/HIPAA-ready audit export); rollback makes it indispensable.
3. **Replay-or-fork correctness is the moat.** Before-images + idempotency keys +
   verify-by-read-back. Gateways could add "rollback"; they won't build this depth.
4. **The outside world is the wedge.** Sandboxes/checkpoints can undo in-sandbox state;
   they cannot unsend an email or delete an invoice. External-side-effect compensation
   is unclaimed territory.
5. **Embeddable by default.** Ship as a library + gateway plugin so LiteLLM/Kong can
   embed us. If you can't beat the gateways, be the undo module inside them.

## Open-core split

| Open (this repo, Apache-2.0) | Closed (`revert-enterprise`, private) |
|---|---|
| SDK + tool-call wrapper | Cross-service sagas + reconciliation |
| Action ledger + CLI | Compliance exports (SOC2-ready) |
| Basic undo (tiers 1–3, single service) | Timeline UI / team collaboration |
| Docs, examples, community | Approval/policy workflows, hosted ledger, SLAs |

**The crown-jewel rule:** the high-assurance distributed undo engine stays closed. The
boundary moves only with pilot evidence — never by guess.

## The wedge and the plan

- **Wedge customer:** enterprise teams deploying agents that touch money, health data,
  or production config. The pilot: instrument one workflow, deliver the ledger, prove
  one rollback.
- **90 days (2 people):** validate (wk 1–2) → SDK MVP (wk 3–6) → pilot-ready + 3 pilots
  (wk 7–9) → harden + go/no-go (wk 10–12).
- **Go/no-go:** pilot signed/LOI → continue. No pilot → pivot or stop. Evidence, not vibes.

## Why this wins

1. The problem worsens every month — agents get more autonomous, more incidents occur.
2. Prevention is a losing game — the math forbids 100% reliability.
3. Infrastructure plays compound — every new framework and LLM works through the ledger.
4. The OSS wedge is brutal — `npm install @revert-labs/core` in five minutes.
5. Temporal proved the model — durable execution was unnamed pain; this is the same play
   for agent *actions*.
