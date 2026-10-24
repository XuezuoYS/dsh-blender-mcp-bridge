/**
 * Concurrency gate tests: cap, FIFO handoff, timeout, abort and slot release.
 *
 * The gate is the plugin-side answer to the Blender add-on's small listen
 * backlog; these tests use plain promises, no Blender and no sockets.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSendGate, SendGateError } from '../lib/sendGate.js'

/** @param {number} ms - delay */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test('the gate caps concurrent tasks and hands slots over in order', async () => {
  const gate = createSendGate({ limitOf: () => 2, acquireTimeoutMs: 1000 })
  let active = 0
  let maxActive = 0
  /** @type {number[]} */
  const order = []
  const results = await Promise.all(
    Array.from({ length: 5 }, (_, index) =>
      gate.run(async () => {
        active += 1
        maxActive = Math.max(maxActive, active)
        order.push(index)
        await sleep(5)
        active -= 1
        return index
      }),
    ),
  )
  assert.equal(maxActive, 2)
  assert.deepEqual(results, [0, 1, 2, 3, 4])
  assert.deepEqual(order, [0, 1, 2, 3, 4], 'slots are handed over in arrival order')
  assert.equal(gate.stats().active, 0)
  assert.equal(gate.stats().waiting, 0)
  assert.equal(gate.stats().peak, 2)
})

test('the limit is read on every acquisition', async () => {
  let limit = 1
  const gate = createSendGate({ limitOf: () => limit, acquireTimeoutMs: 500 })
  /** @type {() => void} */
  let release = () => {}
  const running = gate.run(() => new Promise((resolve) => {
    release = () => resolve('first')
  }))
  await sleep(5)
  limit = 2
  assert.equal(await gate.run(async () => 'second'), 'second')
  release()
  assert.equal(await running, 'first')
})

test('a waiter gives up when no slot frees in time', async () => {
  const gate = createSendGate({ limitOf: () => 1, acquireTimeoutMs: 30 })
  /** @type {(value: string) => void} */
  let release = () => {}
  const running = gate.run(
    () =>
      new Promise((resolve) => {
        release = resolve
      }),
  )
  await sleep(5)
  await assert.rejects(
    gate.run(async () => 'never'),
    (error) => error instanceof SendGateError && error.kind === 'busy' && /No free Blender connection slot/.test(error.message),
  )
  assert.equal(gate.stats().waiting, 0)
  release('done')
  assert.equal(await running, 'done')
  assert.equal(gate.stats().active, 0)
})

test('an aborted waiter leaves the queue immediately', async () => {
  const gate = createSendGate({ limitOf: () => 1, acquireTimeoutMs: 1000 })
  /** @type {(value: string) => void} */
  let release = () => {}
  const running = gate.run(
    () =>
      new Promise((resolve) => {
        release = resolve
      }),
  )
  await sleep(5)
  const controller = new AbortController()
  const waiting = gate.run(async () => 'never', controller.signal)
  controller.abort()
  await assert.rejects(waiting, (error) => error instanceof SendGateError && error.kind === 'aborted')
  assert.equal(gate.stats().waiting, 0)
  release('ok')
  assert.equal(await running, 'ok')
})

test('an already aborted signal is refused without queueing', async () => {
  const gate = createSendGate({ limitOf: () => 1, acquireTimeoutMs: 1000 })
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(
    gate.run(async () => 'never', controller.signal),
    (error) => error instanceof SendGateError && error.kind === 'aborted',
  )
  assert.equal(gate.stats().active, 0)
  assert.equal(gate.stats().waiting, 0)
})

test('a failed task frees its slot', async () => {
  const gate = createSendGate({ limitOf: () => 1, acquireTimeoutMs: 100 })
  await assert.rejects(
    gate.run(async () => {
      throw new Error('boom')
    }),
    /boom/,
  )
  assert.equal(gate.stats().active, 0)
  assert.equal(await gate.run(async () => 'ok'), 'ok')
})
