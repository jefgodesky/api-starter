import { describe, it, expect } from 'vitest'
import { HTTP_NOT_FOUND } from '@revolutionarygamesco/common'
import t from '../../utils/intl.ts'
import createAPI from '../../utils/api.ts'
import captureLogs from '../../utils/testing/logs.js'

describe('notFound', () => {
  it('handles 404', async () => {
    const { logger } = captureLogs()
    const api = createAPI(logger, { autoLogging: false })
    const path = '/nope'
    const data = { context: { req: { path } } }
    const res = await api.request(path)
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
