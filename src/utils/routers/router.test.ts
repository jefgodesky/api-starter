import { describe, beforeEach, it, expect } from 'vitest'
import { HTTP_OK } from '@revolutionarygamesco/common'

import captureLogs, { type LogCapture } from '../testing/logs.js'
import createRouter, { type Router } from './router.js'

describe('createRouter', () => {
  let router: Router
  let logs: LogCapture

  beforeEach(() => {
    logs = captureLogs()
    router = createRouter(logs.logger)
    router.get('/', c => { return c.text('/') })
    router.get('/ping', c => { return c.text('/ping') })
  })

  it('logs to the provided logger', async () => {
    await router.request('/')
    expect(logs.records.some(r => r.messages.includes('/')))
  })

  it('keeps different instances’ logs separate', async () => {
    const otherLog = captureLogs()
    createRouter(otherLog.logger)
    await router.request('/')
    expect(otherLog.records).toHaveLength(0)
  })

  it('ignores trailing slashes', async () => {
    const a = await router.request('/ping')
    const b = await router.request('/ping/')
    expect(a.status).toBe(HTTP_OK)
    expect(b.status).toBe(HTTP_OK)
    expect(await a.text()).toBe(await b.text())
  })
})
