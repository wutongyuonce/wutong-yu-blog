import assert from 'node:assert/strict'
import test from 'node:test'

import {
  countReadableUnits,
  formatChineseCount,
  getCalendarDaySpan,
} from '../src/utils/blog-stats.js'

test('counts CJK characters and non-CJK words without whitespace', () => {
  assert.equal(countReadableUnits('你好 Astro 5, hello-world!'), 5)
})

test('calculates a calendar-day span independently of time of day', () => {
  assert.equal(
    getCalendarDaySpan([
      new Date('2026-01-01T23:59:59Z'),
      new Date('2026-01-03T00:00:01Z'),
    ]),
    2
  )
  assert.equal(getCalendarDaySpan([new Date('2026-01-01')]), 0)
})

test('formats large Chinese counts in ten-thousands', () => {
  assert.equal(formatChineseCount(9_999), '9,999')
  assert.equal(formatChineseCount(12_300), '1.2万')
  assert.equal(formatChineseCount(1_370_000), '137万')
})
