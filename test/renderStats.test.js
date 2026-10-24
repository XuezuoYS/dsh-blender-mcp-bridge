/**
 * Render estimate tests: work units, engine buckets, smoothing and clearing.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRenderStats, engineFamily, renderCost } from '../lib/renderStats.js'

test('renderCost counts effective pixels times samples', () => {
  assert.equal(renderCost({ width: 100, height: 50, samples: 4 }), 20000)
  assert.equal(renderCost({ width: 100, height: 50, samples: 4, resolutionPercentage: 50 }), 5000)
  assert.equal(renderCost({ width: 0, height: 0, samples: 0 }), 1)
})

test('engineFamily buckets EEVEE and Cycles separately', () => {
  assert.equal(engineFamily('BLENDER_EEVEE_NEXT'), 'eevee')
  assert.equal(engineFamily('BLENDER_EEVEE'), 'eevee')
  assert.equal(engineFamily('CYCLES'), 'cycles')
  assert.equal(engineFamily('BLENDER_WORKBENCH'), 'other')
  assert.equal(engineFamily(undefined), 'other')
})

test('an estimate needs one finished render of the same engine family', () => {
  const stats = createRenderStats()
  const shape = { width: 640, height: 360, samples: 16, engine: 'BLENDER_EEVEE' }
  assert.equal(stats.estimateSeconds('s1', shape), null)
  assert.equal(stats.record('s1', 'job-1', shape, 2000), true)
  assert.equal(stats.estimateSeconds('s1', shape), 2)
  const bigger = { width: 1280, height: 720, samples: 64, engine: 'BLENDER_EEVEE' }
  assert.equal(stats.estimateSeconds('s1', bigger), 32)
  assert.equal(stats.estimateSeconds('s1', { ...bigger, engine: 'CYCLES' }), null)
})

test('the same job id is only recorded once', () => {
  const stats = createRenderStats()
  const shape = { width: 640, height: 360, samples: 16, engine: 'BLENDER_EEVEE' }
  stats.record('s1', 'job-1', shape, 2000)
  assert.equal(stats.estimateSeconds('s1', shape), 2)
  assert.equal(stats.record('s1', 'job-1', shape, 20000), false)
  assert.equal(stats.estimateSeconds('s1', shape), 2)
})

test('new samples are smoothed into the rate and sessions stay separate', () => {
  const stats = createRenderStats()
  const shape = { width: 1000, height: 1000, samples: 1, engine: 'CYCLES' }
  stats.record('s1', 'job-1', shape, 1000)
  stats.record('s1', 'job-2', shape, 2000)
  // 0.6 * 1 + 0.4 * 2 = 1.4 seconds for one million sample-pixels.
  assert.equal(stats.estimateSeconds('s1', shape), 1.4)
  assert.equal(stats.estimateSeconds('s2', shape), null)
  stats.clearSession('s1')
  assert.equal(stats.estimateSeconds('s1', shape), null)
})

test('invalid samples are ignored', () => {
  const stats = createRenderStats()
  const shape = { width: 100, height: 100, samples: 4, engine: 'BLENDER_EEVEE' }
  assert.equal(stats.record('', 'job-1', shape, 1000), false)
  assert.equal(stats.record('s1', 'job-1', shape, 0), false)
  assert.equal(stats.record('s1', 'job-1', shape, Number.NaN), false)
  assert.equal(stats.estimateSeconds('s1', shape), null)
})
