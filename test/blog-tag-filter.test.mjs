import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildTagSummary,
  matchesAllTags,
  normalizePostTags,
  truncateTagLabel,
} from '../src/utils/blog-tag-filter.js'

test('normalizes whitespace, empty values, and duplicates per post', () => {
  assert.deepEqual(normalizePostTags([' Agent ', '', 'Agent', 'RAG']), [
    'Agent',
    'RAG',
  ])
})

test('counts posts once per tag and sorts by count then name', () => {
  assert.deepEqual(
    buildTagSummary([['RAG', 'Agent', 'Agent'], ['Agent', '测试'], ['RAG']]),
    [
      { tag: 'Agent', count: 2 },
      { tag: 'RAG', count: 2 },
      { tag: '测试', count: 1 },
    ]
  )
})

test('matches empty, single, and multiple AND selections', () => {
  const tags = ['Agent', 'RAG', '测试']

  assert.equal(matchesAllTags(tags, []), true)
  assert.equal(matchesAllTags(tags, ['Agent']), true)
  assert.equal(matchesAllTags(tags, ['Agent', 'RAG']), true)
  assert.equal(matchesAllTags(tags, ['Agent', 'Java']), false)
})

test('truncates by Unicode code point without changing short labels', () => {
  assert.equal(truncateTagLabel('Context Engineering'), 'Context Engi…')
  assert.equal(truncateTagLabel('Agent'), 'Agent')
  assert.equal(truncateTagLabel('😀😀😀', 2), '😀😀…')
})
