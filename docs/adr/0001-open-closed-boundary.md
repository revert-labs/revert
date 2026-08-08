# ADR-0001: The open/closed boundary

- **Status:** Accepted (boundary moves only with pilot evidence)
- **Date:** 2026-08-08
- **Deciders:** Revert Labs founders

## Context

Revert is an open-core company: the OSS core is the trust wedge and the distribution
engine; the enterprise layer is the revenue. The line between them is the single most
important business decision. Get it wrong and we either give away the moat or strangle
adoption.

## Decision

| Layer | Open (Apache-2.0) | Closed (revert-enterprise) |
|---|---|---|
| SDK + tool-call wrapper | ✅ | |
| Action ledger + CLI | ✅ | |
| Basic undo (tiers 1–3, single service) | ✅ | |
| Cross-service sagas + reconciliation | | ✅ |
| Compliance exports (SOC2-ready) | | ✅ |
| Timeline UI / team collaboration | | ✅ |
| Approval/policy workflows | | ✅ |
| Hosted ledger + SLAs | | ✅ |

**The crown-jewel rule:** the high-assurance distributed undo engine (cross-service
compensation correctness, replay-or-fork at scale, verification) is never open-sourced
until the category is won.

**Boundary policy:** the line is not fixed forever. It moves — but only with pilot
evidence (a customer explicitly refusing to pay for X, or explicitly demanding Y). Never
by guess, never by convenience.

## Consequences

- Two repositories from birth: `revert` (public) + `revert-enterprise` (private) —
  the boundary is enforced structurally; the paid layer literally cannot leak.
- Community growth may be slower because the deepest work isn't visible. Accepted:
  trust and wedge come from the SDK + ledger + correctness docs, which are open.
- Gateways can fork the OSS SDK. Accepted: the moat (deep compensation) is unforkable,
  and we move fast while the category is unproven.

## Alternatives considered

- **Everything open** — rejected: no revenue, fork risk kills the company.
- **Everything closed** — rejected: the MITM trust objection makes OSS the only credible
  answer for an audit product.
- **AGPL core** — rejected: scares enterprise buyers for marginal fork protection.
