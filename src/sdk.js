// revert — the open-core SDK (v0.1 stub).
//
// This is the seed of the product. Currently real: an append-only,
// replayable action ledger (the heart of the event-sourcing design).
// Planned next: wrapAction() capturing before-images + idempotency
// keys, then the tiered undo engine (see docs/vision.md and docs/adr).

/**
 * Create an append-only action ledger.
 * Events are immutable once recorded; you can replay the stream
 * to reconstruct any point in history.
 *
 * @returns {{record: (event: object) => string, events: () => object[], at: (seq: number) => object[]}}
 */
export function createLedger() {
  const events = [];
  let seq = 0;

  return {
    /**
     * Append an event. `event` is frozen on write and stamped with
     * its sequence number. Returns the event's id.
     */
    record(event) {
      const id = `evt-${++seq}`;
      const stamped = Object.freeze({ id, seq, ts: Date.now(), ...event });
      events.push(stamped);
      return id;
    },

    /** All events, in order (a copy — never hand out the internal array). */
    events() {
      return events.map((e) => e);
    },

    /** Events up to and including a sequence number (replay point). */
    at(seqN) {
      return events.filter((e) => e.seq <= seqN).map((e) => e);
    },
  };
}

/**
 * Placeholder for the tool-call wrapper (the Intercept layer).
 * Design target: wrap an agent tool call so every invocation records
 * a deterministic action event — endpoint, payload, before-image,
 * idempotency key, response — into the ledger.
 *
 * @param {string} name
 * @param {(args: any) => Promise<any>} fn
 * @param {{ ledger?: object, capture?: (args: any) => object }} [opts]
 * @returns {(args: any) => Promise<any>}
 */
export function wrapAction(name, fn, opts = {}) {
  return async function wrapped(args) {
    // v0.2: record before-image, inject idempotency key, capture
    // response, support replay-or-fork restore. For now: passthrough.
    return fn(args);
  };
}
