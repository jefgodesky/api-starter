import { describe, it, expect } from 'vitest'
import createError from './create.ts'
import createErrorResponse from './response.ts'

describe('createErrorResponse', () => {
  it('creates a response that describes the error', () => {
    const cause = { Type: 'Test', type: 'test', context: { req: { path: '/test' } } }
    const err = createError('notFound', cause)
    const actual = createErrorResponse(err)
    expect(actual).toEqual({
      title: 'Test Not Found',
      detail: 'The requested test at /test could not be found.',
      instance: '/test'
    })
  })
})
