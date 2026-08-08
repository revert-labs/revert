# Research — compensation correctness & rollback for agent actions

Sourced synthesis (2025–2026). The hard problem is not "compute the inverse" — it's
**trustworthy compensation**. Three sub-problems, each with a found answer.

## Sub-problem 1: can you even compute the inverse?

No, in general. The literature is blunt:

- *"Saga only works if you can write reliable inverses"* — Swfte, "6 AI Workflow
  Orchestration Patterns" (May 2026).
- *"The hardest part of saga design for agents is deciding what is compensable and what
  is not"* — Tian Pan, "Durable Agents" (Apr 2026).

**Answer: derive inverses from declared contracts, don't compute them.**
Idempotency keys are the substrate (the Stripe pattern): every mutating call carries a
client-generated key; compensation is a *new* operation with a *new* key — never a replay.
OpenAPI CRUD pairs declare inverses (`POST /invoices` ⇄ `DELETE /invoices/{id}`);
everything else is "requires a compensation template."

## Sub-problem 2: is the inverse the same as the original? (The discovery)

**No — and that's an attack.** *ACRFence: Preventing Semantic Rollback Attacks in Agent
Checkpoint-Restore* (arXiv:2603.20625, 2026) identifies the failure mode unique to
LLM-based agents: on restore from a checkpoint, an agent **re-synthesizes** tool calls
rather than mechanically replaying them. The re-synthesized calls are semantically
similar but not identical — external services cannot distinguish them from new legitimate
requests. Attack surfaces: **action replay** (duplicate payments, repeated resource
consumption) and **authority resurrection** (reuse of credentials that should be consumed).

**Answer (from the paper):** record irreversible effects *before* execution, and enforce
**replay-or-fork semantics** on restoration — the agent either replays the exact recorded
calls or forks; it never re-approximates them.

## Sub-problem 3: did the undo actually work?

**Answer: verify by read-back, never assume.** Undo is complete only when current state
matches the before-image (captured via CDC preimages / request-response deltas).
Reconciliation loops catch everything else: periodically scan for resources in terminal
states that were never cleaned up (CockroachDB "DORA Database Requirements for AI
Agents", 2026; Zylos Research synthesis, May 2026).

## Convergent best-practice stack

From Zylos Research ("Compensation and Rollback Patterns for AI Agent Lifecycle
Operations", May 2026), Temporal, CockroachDB, and AWS Bedrock AgentCore docs:

- **Compensation = forward-moving event.** *"You cannot unsend a Slack message; you can
  only issue a delete command."* Undo appends state; it never erases history. The log is
  the audit trail.
- **Rollback as a pointer update.** Immutable runtime versions + endpoint indirection
  (Bedrock AgentCore's pattern): revert = point the endpoint at the old version.
- **JIT credential brokers.** Short-lived, task-scoped tokens; revoking an agent = one
  broker operation.
- **Orchestration for create/delete, choreography for status, reconcilers for the gaps.**
- **Idempotent retry everywhere** — Temporal logs workflow decisions durably so replay
  re-evaluates deterministically without re-executing side effects.

## What this means for revert

1. The SDK injects **idempotency keys** on every mutating tool call.
2. The ledger stores **before-images** (deltas, not full states) and the exact
   request/response pair.
3. **Replay-or-fork** is the only restore semantic — never re-synthesize.
4. Undo completes only after **verify-by-read-back**; reconciliation runs as best-effort
   fallback.
5. The enterprise layer owns cross-service sagas + compensation correctness — the crown
   jewel that gateways won't build.

## Sources

- ACRFence, *Semantic Rollback Attacks in Agent Checkpoint-Restore* — arXiv:2603.20625
- Zylos Research, *Compensation and Rollback Patterns for AI Agent Lifecycle Operations* — 2026-05-29
- CockroachDB, *DORA Database Requirements for AI Agents* — 2026
- Swfte, *6 AI Workflow Orchestration Patterns* — 2026-05-06
- Tian Pan, *Durable Agents: Async Queues Break for Long-Running AI Workflows* — 2026-04-23
- IBM Research, *An 'undo-and-retry' mechanism for agents* — 2025-11
- Temporal, *Compensating Actions with Sagas* — 2023 (foundational)
- Azure Architecture Center, *Compensating Transaction Pattern*
