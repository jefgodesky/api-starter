import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { HTTPException } from '@hono/hono/http-exception'
import { getNestedValue } from '@revolutionarygamesco/common'
import getErrorCause from './cause.ts'
import createError from './create.ts'

describe('createError', () => {
  it('creates an HTTPException', () => {
    const cause = { context: { req: { path: '/test' } } }
    const err = createError('notFound', cause)
    const path = getNestedValue(getErrorCause(err), 'context.req.path')

    expect(path).toBe('/test')
    expect(err).toBeInstanceOf(HTTPException)
  })
})
