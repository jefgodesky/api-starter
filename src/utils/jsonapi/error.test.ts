import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import t from '../intl.ts'
import { HTTP_NOT_FOUND } from '../../constants/http-status.ts'
import createError from './error.ts'

describe('createError', () => {
  it('creates a JSON:API error object', () => {
    const data = { path: '/test' }
    const { body, status } = createError('notFound', data)
    const { detail, status: stat, code, title, source } = body.errors[0]

    expect(body.errors).toHaveLength(1)
    expect(stat).toBe(HTTP_NOT_FOUND.toString())
    expect(code).toBe('notFound')
    expect(title).toBe(t('errors.notFound.title', data).trim())
    expect(detail).toBe(t('errors.notFound.detail', data).trim())
    expect(source?.pointer).toBe(data.path)
    expect(status).toBe(HTTP_NOT_FOUND)
  })
})
