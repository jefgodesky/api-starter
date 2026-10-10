import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import t from '../intl.ts'
import { HTTP_NOT_FOUND } from '../../constants/http-status.ts'
import createError from '../errors/create.ts'
import createErrorResponse from './error.ts'

describe('createErrorResponse', () => {
  it('creates a JSON:API error object', () => {
    const cause = { context: { req: { path: '/test' } } }
    const err = createError('notFound', cause)
    const { body, status } = createErrorResponse(err)
    const { detail, status: stat, code, title, source } = body.errors[0]

    expect(body.errors).toHaveLength(1)
    expect(stat).toBe(HTTP_NOT_FOUND.toString())
    expect(code).toBe('notFound')
    expect(title).toBe(t('errors.notFound.title', cause).trim())
    expect(detail).toBe(t('errors.notFound.detail', cause).trim())
    expect(source?.pointer).toBe(cause.context.req.path)
    expect(status).toBe(HTTP_NOT_FOUND)
  })
})
