# Roadmap — first 90 days

**The one-line product:** git for AI agent actions — every action is a commit,
anything can be rolled back.

**The plan:** validate before we build, ship a working SDK as the moat, take three
pilots, and make a go/no-go decision with evidence — not vibes.

---

## The budget reality

| Input | Value |
|---|---|
| Raw hours (2 people × 12h × 90d) | ~2,160h |
| Reality tax (rest days, degraded hours, chaos buffer) | ~−30–35% |
| **Productive hours** | **~1,400–1,500h** |

That buys a real, pilot-ready SDK — and *only just*. It does not buy SOC2, a timeline
UI, a Python SDK, and enterprise sales. Every hour on a non-core thing is an hour
stolen from the moat.

> **Score every task:** value = impact on closing the pilot ÷ hours. There is no
> "nice to have" — only *closes the pilot* or *doesn't*.

## Phases

### Phase 0 — Weeks 1–2 · Validate before you build
- **Seller:** 15–20 interviews with teams running agents that touch money, health, or
  prod config. Collect 10 real incident stories — they become content *and* validation.
- **Builder:** the fake demo (mock ledger + mock undo), landing page, repo, branding.
- **Output:** 3 validated use cases + 3 pilot prospects on the hook.
- **Gate:** continue or stop — decided with interviews, not optimism.

### Phase 1 — Weeks 3–6 · The SDK MVP (the moat, working)
- Tool-call wrapper (Node first): every agent action → immutable event (endpoint,
  payload, **before-image**, idempotency key, response, timestamp).
- Undo executor for reversibility tiers 1–3 (`POST→DELETE`, `PUT→PUT-back`,
  verify-by-read-back).
- Replay-or-fork restore semantics (never re-synthesize on restore).
- SQLite append-only ledger + CLI: `revert undo <run-id> --step N`.
- **Output:** a working SDK that wraps a real agent loop and undoes a real side
  effect. OSS v0.1 shipped, built in public.

### Phase 2 — Weeks 7–9 · Pilot-ready
- Audit export (SOC2-ready JSON/CSV) — the CISO wedge.
- Security one-pager + demo script ("this agent just emailed the wrong person —
  watch the compensation fire").
- 3 pilots: instrument one workflow each; deliver the ledger + one successful rollback.
- Publish the incident studies + "why sandboxes can't unsend an email".
- **Output:** 3 pilots live, 1 written letter of intent, a real feedback list.

### Phase 3 — Weeks 10–12 · Harden + decide
- Fix the top pilot pain points; Python SDK only if a pilot demands it.
- Compliance-readiness doc + pricing draft.
- **Decision gate:** LOI / paid pilot → raise a small round or bootstrap on.
  No pilot → pivot or stop. No ego.

## Workstreams (cap them hard)

| Workstream | Owner | When | Cap |
|---|---|---|---|
| SDK + undo engine (the moat) | Builder | W3–12 | **The whole game — protect it** |
| Interviews + follow-ups | Seller | W1–12 | ~80h |
| Pilots (instrument + deliver + iterate) | Both | W7–12 | ~200h |
| Content (2 posts/week) | Seller | W1–12 | ~50h |
| Entity, license, founder terms | Both | W1–4 | ~30h |
| Audit export + security one-pager | Builder | W7–9 | ~60h |
| Community (issues, PRs, docs) | Both | W1–12 | ~3h/week |

## Not in the budget (say no now)

- ❌ SOC2 certification (150–250h + $20–50k + 3–6 months calendar — "compliant-ready"
  is the positioning, not the cert)
- ❌ Timeline UI product (one dashboard page yes; a product no)
- ❌ Python SDK / gateway plugin before a pilot demands one

## Decision gates

1. **End of Phase 0** — 3 validated use cases + 3 prospects, or we don't build.
2. **End of Phase 2** — 3 pilots live + 1 LOI, or we don't scale the sales motion.
3. **End of Phase 3** — go/no-go on the company with evidence.

## On GitHub

- Milestone [`v0.1 — SDK MVP`](https://github.com/revert-labs/revert/milestones)
  — the build.
- Milestone `v0.2 — Pilot-ready` — the sell.
- [Roadmap board](https://github.com/orgs/revert-labs/projects/1) — the live kanban.
- Issues tagged `good first issue` are the homework — the repo is the classroom
  (see [learning-path.md](learning-path.md)).
