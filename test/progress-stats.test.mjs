import assert from 'node:assert/strict'
import test from 'node:test'

import { getProgressStats } from '../src/utils/progress-stats.js'

test('starts a common year at day one with zero progress', () => {
  assert.deepEqual(getProgressStats(new Date(2025, 0, 1)), {
    dayOfYear: 1,
    yearProgress: 0,
    dayProgress: 0,
  })
})

test('counts leap day and uses the full leap year', () => {
  const stats = getProgressStats(new Date(2024, 1, 29, 12))

  assert.equal(stats.dayOfYear, 60)
  assert.equal(stats.dayProgress, 50)
  assert.ok(stats.yearProgress > 16 && stats.yearProgress < 17)
})

test('tracks fractional progress through the local day', () => {
  const stats = getProgressStats(new Date(2025, 6, 2, 6))

  assert.equal(stats.dayOfYear, 183)
  assert.equal(stats.dayProgress, 25)
  assert.ok(stats.yearProgress > 49 && stats.yearProgress < 51)
})
