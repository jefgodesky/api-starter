import { describe, it, expect } from 'vitest'
import {
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR
} from '@revolutionarygamesco/common'
import createTestApp from '../../utils/testing/app.ts'
import t from '../../utils/intl.ts'
import onError from './on.ts'

describe('onError', () => {
  const errorPath = '/error'
  const data = { context: { req: { path: errorPath } } }
  const runError = async (msg: string) => {
    const { app, logs } = createTestApp()
    app.onError(onError)
    app.get(errorPath, () => {
      throw new Error(msg)
    })

    const res = await app.request(errorPath)
    return { res, logs }
  }

  it('handles specific errors', async () => {
    const { res } = await runError('forbidden')
    const body = await res.json()
    const { title, detail, code, source, status } = body.errors[0]

    expect(res.status).toBe(HTTP_FORBIDDEN)
    expect(body.errors).toHaveLength(1)
    expect(title).toBe(t('errors.forbidden.title', data).trim())
    expect(detail).toBe(t('errors.forbidden.detail', data).trim())
    expect(code).toBe('forbidden')
    expect(source.pointer).toBe(errorPath)
    expect(status).toBe(HTTP_FORBIDDEN.toString())
  })

  it('maps unknown to internal server errors', async () => {
    const { res } = await runError('WTF is this?')
    const body = await res.json()
    const { title, detail, code, source, status } = body.errors[0]

    expect(res.status).toBe(HTTP_INTERNAL_SERVER_ERROR)
    expect(body.errors).toHaveLength(1)
    expect(title).toBe(t('errors.other.title', data).trim())
    expect(detail).toBe(t('errors.other.detail', data).trim())
    expect(code).toBe('other')
    expect(source.pointer).toBe(errorPath)
    expect(status).toBe(HTTP_INTERNAL_SERVER_ERROR.toString())
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
