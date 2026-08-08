// Smoke tests for the ledger (zero deps — node:test built-in).
// Run: npm test  (or: node --test)

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createLedger, wrapAction } from '../src/index.js';

test('ledger records events in order with sequence numbers', () => {
  const ledger = createLedger();
  const a = ledger.record({ type: 'action', tool: 'update_record', payload: { id: 1 } });
  const b = ledger.record({ type: 'action', tool: 'send_email', payload: { to: 'x' } });

  assert.equal(a, 'evt-1');
  assert.equal(b, 'evt-2');
  assert.deepEqual(ledger.events().map((e) => e.seq), [1, 2]);
});

test('ledger events are immutable (frozen) after recording', () => {
  const ledger = createLedger();
  ledger.record({ type: 'action', tool: 'delete_row' });
  const evt = ledger.events()[0];
  assert.ok(Object.isFrozen(evt));
});

test('ledger supports replay points (at seq N)', () => {
  const ledger = createLedger();
  ledger.record({ type: 'action', tool: 'create_invoice' });
  ledger.record({ type: 'action', tool: 'charge_card' });
  const beforeCharge = ledger.at(1);
  assert.equal(beforeCharge.length, 1);
  assert.equal(beforeCharge[0].tool, 'create_invoice');
});

test('wrapAction currently passes through (v0.1 stub)', async () => {
  const fn = async (x) => x * 2;
  const wrapped = wrapAction('double', fn);
  assert.equal(await wrapped(21), 42);
});
