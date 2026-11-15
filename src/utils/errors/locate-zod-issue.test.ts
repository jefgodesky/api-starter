import { describe, it, expect } from 'vitest'
import { type ValidationTargets } from 'hono'
import locateZodIssue, { type ZodIssueLocation } from './locate-zod-issue.ts'

describe('locateZodIssue', () => {
  const cases: Array<[string, keyof ValidationTargets, ZodIssueLocation]> = [
    ['JSON', 'json', { target: 'body', pointer: '/path/to/issue' }],
    ['a form', 'form', { target: 'body', pointer: '/path/to/issue' }],
    ['the query', 'query', { target: 'query', pointer: 'path' }],
    ['a URL param', 'param', { target: 'path', pointer: 'path' }],
    ['a header', 'header', { target: 'header', pointer: 'path' }],
    ['a cookie', 'cookie', { target: 'cookie', pointer: 'path' }]
  ]

  it.each(cases)('can locate an issue in %s', (description, target, expected) => {
    expect(locateZodIssue(target, ['path', 'to', 'issue'])).toEqual(expected)
  })
})
