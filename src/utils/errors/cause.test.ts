import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import createError from './create.ts'
import getErrorCause from './cause.ts'

describe('getErrorContext', () => {
  it('returns the error context', () => {
    const cause = { context: { req: { path: '/test' } } }
    const err = createError('notFound', cause)
    const actual = getErrorCause(err)
    expect(actual).toEqual(cause)
  })

  it('returns an empty object if there is no cause', () => {
    const err = createError('notFound')
    const actual = getErrorCause(err)
    expect(actual).toEqual({})
  })
})
