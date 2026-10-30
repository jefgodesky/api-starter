import { describe, beforeEach, it, expect } from 'vitest'
import { HTTP_OK } from '@revolutionarygamesco/common'

import { type Router } from './types.ts'
import captureLogs, { type LogCapture } from '../testing/logs.ts'
import createRouter from './router.ts'

describe('createRouter', () => {
  let router: Router
  let logs: LogCapture

  beforeEach(() => {
    logs = captureLogs()
    router = createRouter('test', logs.logger)
    router.get('/', c => { return c.text('/') })
    router.get('/ping', c => { return c.text('ping') })
  })

  it('includes the resource string', () => {
    expect(router.resource).toBe('test')
  })

  it('includes the path', () => {
    expect(router.path).toBe('/test')
  })

  it('logs to the provided logger', async () => {
    await router.request('/test')
    expect(logs.records.some(r => r.messages.includes('/')))
  })

  it('keeps different instances’ logs separate', async () => {
    const otherLog = captureLogs()
    createRouter('other', otherLog.logger)
    await router.request('/test')
    expect(otherLog.records).toHaveLength(0)
  })

  it('ignores trailing slashes', async () => {
    const a = await router.request('/test/ping')
    const b = await router.request('/test/ping/')
    expect(a.status).toBe(HTTP_OK)
    expect(b.status).toBe(HTTP_OK)
    expect(await a.text()).toBe(await b.text())
  })
})
