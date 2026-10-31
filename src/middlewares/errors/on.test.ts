import { describe, it, expect } from 'vitest'
import {
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR
} from '@revolutionarygamesco/common'
import createAPI from '../../utils/routers/api.ts'
import captureLogs from '../../utils/testing/logs.js'
import t from '../../utils/strings/intl.ts'

describe('onError', () => {
  const errorPath = '/error'
  const data = { context: { req: { path: errorPath } } }
  const runError = async (msg: string) => {
    const logs = captureLogs()
    const api = createAPI(logs.logger, { autoLogging: false })
    api.get('/error', () => {
      throw new Error(msg)
    })

    const res = await api.request(errorPath)
    return { res, logs }
  }

  it('handles specific errors', async () => {
    const { res } = await runError('forbidden')
    const { title, detail, instance } = await res.json()

    expect(res.status).toBe(HTTP_FORBIDDEN)
    expect(res.headers.get('Content-Type')).toBe('application/problem+json')
    expect(title).toBe(t('errors.http.forbidden.title', data).trim())
    expect(detail).toBe(t('errors.http.forbidden.detail', data).trim())
    expect(instance).toBe(errorPath)
  })

  it('maps unknown to internal server errors', async () => {
    const { res } = await runError('WTF is this?')
    const { title, detail, instance } = await res.json()

    expect(res.status).toBe(HTTP_INTERNAL_SERVER_ERROR)
    expect(res.headers.get('Content-Type')).toBe('application/problem+json')
    expect(title).toBe(t('errors.http.other.title', data).trim())
    expect(detail).toBe(t('errors.http.other.detail', data).trim())
    expect(instance).toBe(errorPath)
  })

  it('logs unknown errors', async () => {
    const msg = 'WTF is this?'
    const { logs } = await runError(msg)
    const [record] = logs.at('error')
    expect(logs.records).toHaveLength(1)
    expect(record.error?.message).toBe(msg)
  })

  it('doesn’t log expected “errors“', async () => {
    const { logs } = await runError('forbidden')
    expect(logs.at('error')).toHaveLength(0)
  })
})
