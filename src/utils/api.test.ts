import { describe, beforeEach, it, expect } from 'vitest'
import {
  HTTP_OK,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR
} from '@revolutionarygamesco/common'

import captureLogs, { type LogCapture } from './testing/logs.js'
import createAPI, { type API } from './api.js'

describe('createAPI', () => {
  let api: API
  let logs: LogCapture

  beforeEach(() => {
    logs = captureLogs()
    api = createAPI(logs.logger)
    api.get('/', c => { return c.text('/') })
    api.get('/ping', c => { return c.text('/ping') })
    api.get('/error', c => { throw new Error('oh no') })
  })

  it('logs to the provided logger', async () => {
    await api.request('/')
    expect(logs.records.some(r => r.messages.includes('/')))
  })

  it('keeps different instances’ logs separate', async () => {
    const otherLog = captureLogs()
    createAPI(otherLog.logger)
    await api.request('/')
    expect(otherLog.records).toHaveLength(0)
  })

  it('returns 404 when a route can’t be found', async () => {
    const { status } = await api.request('/nope')
    expect(status).toBe(HTTP_NOT_FOUND)
  })

  it('returns 500 on an internal server error', async () => {
    const { status } = await api.request('/error')
    expect(status).toBe(HTTP_INTERNAL_SERVER_ERROR)
  })

  it('ignores trailing slashes', async () => {
    const a = await api.request('/ping')
    const b = await api.request('/ping/')
    expect(a.status).toBe(HTTP_OK)
    expect(b.status).toBe(HTTP_OK)
    expect(await a.text()).toBe(await b.text())
  })
})
