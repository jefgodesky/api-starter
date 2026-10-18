import { describe, it, expect } from 'vitest'
import { HTTP_NOT_FOUND } from '@revolutionarygamesco/common'
import t from '../../utils/intl.ts'
import createTestApp from '../../utils/testing/app.js'
import notFound from './404.ts'

describe('notFound', () => {
  it('handles 404', async () => {
    const { app } = createTestApp()
    app.notFound(notFound)

    const path = '/nope'
    const data = { context: { req: { path } } }
    const res = await app.request(path)
    const body = await res.json()
    const { title, detail, code, source, status } = body.errors[0]

    expect(res.status).toBe(HTTP_NOT_FOUND)
    expect(body.errors).toHaveLength(1)
    expect(title).toBe(t('errors.notFound.title', data).trim())
    expect(detail).toBe(t('errors.notFound.detail', data).trim())
    expect(code).toBe('notFound')
    expect(source.pointer).toBe(path)
    expect(status).toBe(HTTP_NOT_FOUND.toString())
  })
})
