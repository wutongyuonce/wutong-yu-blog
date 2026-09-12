import assert from 'node:assert/strict'
import test from 'node:test'

import { formatRecentPostDate } from '../src/utils/recent-post-date.js'

const now = new Date('2026-09-12T00:30:00+08:00')

test('uses relative labels through the 30-day boundary', () => {
  assert.equal(formatRecentPostDate('2026-09-12', now), '今天')
  assert.equal(formatRecentPostDate('2026-09-11', now), '1天前')
  assert.equal(formatRecentPostDate('2026-08-13', now), '30天前')
})

test('uses a full Chinese date and weekday after 30 days', () => {
  assert.equal(formatRecentPostDate('2026-08-12', now), '2026年8月12日星期三')
})

test('does not describe future publication dates as days ago', () => {
  assert.equal(formatRecentPostDate('2026-09-13', now), '2026年9月13日星期日')
})
