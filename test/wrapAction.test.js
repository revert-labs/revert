// Tests for the Intercept layer: wrapAction records deterministic
// action events with before/after images. Zero deps (node:test).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createLedger, wrapAction } from '../src/index.js';

test('wrapAction records an action event with before/after images', async () => {
  const ledger = createLedger();
  const fn = async (args) => ({ ok: true, id: args.id });
  const wrapped = wrapAction('update_record', fn, { ledger });

  const result = await wrapped({ id: 7, name: 'ada' });

  assert.deepEqual(result, { ok: true, id: 7 });
  const events = ledger.events();
  assert.equal(events.length, 1);

  const evt = events[0];
  assert.equal(evt.type, 'action');
  assert.equal(evt.tool, 'update_record');
  // payload is deep-cloned: mutating the caller's args later must not leak in
  assert.deepEqual(evt.payload, { id: 7, name: 'ada' });
  assert.deepEqual(evt.before, { id: 7, name: 'ada' });
  assert.deepEqual(evt.response, { ok: true, id: 7 });
  assert.ok(evt.idempotencyKey, 'has an idempotency key');
  assert.equal(typeof evt.ts, 'number');
});

test('wrapAction uses a custom capture function for the before/after state', async () => {
  const ledger = createLedger();
  let state = { balance: 100 };
  const capture = () => structuredClone(state);
  const wrapped = wrapAction('charge', async () => { state = { balance: state.balance - 40 }; }, {
    ledger,
    capture,
  });

  await wrapped({});

  const evt = ledger.events()[0];
  assert.deepEqual(evt.before, { balance: 100 });
  assert.deepEqual(evt.after, { balance: 60 });
  // before/after differ — the delta an undo engine can verify against
  assert.notDeepEqual(evt.before, evt.after);
});

test('wrapAction records failures and rethrows them', async () => {
  const ledger = createLedger();
  const wrapped = wrapAction('send_email', async () => { throw new Error('smtp down'); }, { ledger });

  await assert.rejects(() => wrapped({ to: 'x' }), /smtp down/);

  const evt = ledger.events()[0];
  assert.equal(evt.tool, 'send_email');
  assert.equal(evt.error.message, 'smtp down');
  assert.equal(evt.response, undefined);
});

test('wrapAction supports an explicit idempotency key and context', async () => {
  const ledger = createLedger();
  const wrapped = wrapAction('create_invoice', async (a) => a, {
    ledger,
    idempotencyKey: 'invoice-42',
    context: { workflowId: 'wf-1' },
  });

  await wrapped({ amount: 99 });

  const evt = ledger.events()[0];
  assert.equal(evt.idempotencyKey, 'invoice-42');
  assert.deepEqual(evt.context, { workflowId: 'wf-1' });
});

test('wrapAction without a ledger creates one (events still recorded)', async () => {
  const fn = async (x) => x * 2;
  const wrapped = wrapAction('double', fn);
  assert.equal(await wrapped(21), 42);
});
