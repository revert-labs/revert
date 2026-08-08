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
 * Wrap an agent tool call so every invocation records a deterministic
 * action event into the ledger (the Intercept layer).
 *
 * Recorded for each call:
 *  - tool name + payload (deep-cloned)
 *  - before-image: a snapshot of the world *before* the call
 *  - after-image: a snapshot of the world *after* the call
 *  - the response (or a serialized error on failure)
 *  - an idempotency key and a timestamp, for replay & undo
 *
 * The wrapped function keeps pass-through semantics: it returns the
 * original result and rethrows failures. The event is still recorded
 * either way — a failure is part of the audit trail.
 *
 * @param {string} name  the tool name (e.g. "update_record")
 * @param {(args: any) => Promise<any>} fn
 * @param {{
 *   ledger?: ReturnType<typeof createLedger>,
 *   capture?: (args: any) => any,
 *   idempotencyKey?: string,
 *   context?: object,
 * }} [opts]
 * @returns {(args: any) => Promise<any>}
 */
export function wrapAction(name, fn, opts = {}) {
  const ledger = opts.ledger ?? createLedger();
  // The before/after image is whatever the caller says "the world" is.
  // Default: a deep snapshot of the call's inputs.
  const capture = opts.capture ?? ((args) => structuredClone(args));

  return async function wrapped(args) {
    const idempotencyKey = opts.idempotencyKey ?? randomId();
    const before = capture(args);
    const startedAt = Date.now();

    let response;
    let thrown;
    let error;
    try {
      response = await fn(args);
    } catch (err) {
      thrown = err;
      error = serializeError(err);
    }

    ledger.record({
      type: 'action',
      tool: name,
      payload: structuredClone(args),
      before,
      after: capture(args),
      response,
      error,
      idempotencyKey,
      durationMs: Date.now() - startedAt,
      context: opts.context,
    });

    if (thrown) throw thrown;
    return response;
  };
}

/** Fresh random idempotency key for a call (crypto.randomUUID when available). */
function randomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Flatten an error into JSON-safe fields for the ledger. */
function serializeError(err) {
  return {
    name: err?.name ?? 'Error',
    message: err?.message ?? String(err),
    stack: err?.stack,
  };
}
