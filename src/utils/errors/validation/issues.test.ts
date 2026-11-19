import { describe, it, expect } from 'vitest'
import { HTTPException } from 'hono/http-exception'
import { StatusCodes } from 'http-status-codes'
import { type Issue } from './schemas.ts'
import getIssues from './issues.ts'

describe('getIssues', () => {
  const issue: Issue = {
    detail: 'Invalid input: expected number, received string',
    code: 'invalid_type',
    target: 'body',
    pointer: '/num'
  }

  const createException = (cause?: unknown): HTTPException => {
    return new HTTPException(StatusCodes.UNPROCESSABLE_ENTITY, { message: 'validation', cause })
  }

  it.each([
    ['there is no cause', undefined],
    ['there are no issues', { context: {} }],
    ['issues isn’t an array', { issues: false }],
    ['issues is an empty array', { issues: [] }],
    ['an issue is malformed', { issues: [issue, { detail: true }] }],
    ['an issue has an unknown target', { issues: [{ ...issue, target: 'json' }] }]
  ] as Array<[string, unknown]>)('returns null when %s', (_description, cause) => {
    expect(getIssues(createException(cause))).toBeNull()
  })

  it('returns the issues', () => {
    expect(getIssues(createException({ issues: [issue] }))).toEqual([issue])
  })

  it('strips unknown properties', () => {
    expect(getIssues(createException({ issues: [{ ...issue, extra: true }] }))).toEqual([issue])
  })
})
