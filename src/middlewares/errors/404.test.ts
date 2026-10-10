import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { Hono } from '@hono/hono'
import { HTTP_NOT_FOUND } from '../../constants/http-status.ts'
import t from '../../utils/intl.ts'
import notFound from './404.ts'

describe('notFound', () => {
  it('handles 404', async () => {
    const app = new Hono()
    app.notFound(notFound)

    const path = '/nope'
    const res = await app.request(path)
    const body = await res.json()
    const { title, detail, code, source, status } = body.errors[0]

    expect(res.status).toBe(HTTP_NOT_FOUND)
    expect(body.errors).toHaveLength(1)
    expect(title).toBe(t('errors.notFound.title', { path }).trim())
    expect(detail).toBe(t('errors.notFound.detail', { path }).trim())
    expect(code).toBe('notFound')
    expect(source.pointer).toBe(path)
    expect(status).toBe(HTTP_NOT_FOUND.toString())
  })
})
