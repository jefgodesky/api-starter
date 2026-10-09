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

    const res = await app.request('/nope')
    const body = await res.json()

    expect(res.status).toBe(HTTP_NOT_FOUND)
    expect(body.errors).toHaveLength(1)
    expect(body.errors[0].detail).toBe(t('errors.notFound'))
  })
})
