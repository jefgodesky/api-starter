import { describe, it, expect } from 'vitest'
import { HTTP_NOT_FOUND } from '@revolutionarygamesco/common'
import t from '../../utils/strings/intl.ts'
import createAPI from '../../utils/routers/api.ts'
import captureLogs from '../../utils/testing/logs.js'

describe('notFound', () => {
  it('handles 404', async () => {
    const { logger } = captureLogs()
    const api = createAPI(logger, { autoLogging: false })
    const path = '/nope'
    const data = { context: { req: { path } } }
    const res = await api.request(path)
    const { title, detail, instance } = await res.json()

    expect(res.status).toBe(HTTP_NOT_FOUND)
    expect(title).toBe(t('errors.notFound.title', data).trim())
    expect(detail).toBe(t('errors.notFound.detail', data).trim())
    expect(instance).toBe(path)
  })
})
