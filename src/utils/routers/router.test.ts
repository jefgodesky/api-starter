import { describe, beforeEach, it, expect } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { type RouterMeta } from '../../types.ts'
import captureLogs, { type LogCapture } from '../testing/logs.ts'
import createRouter from './router.ts'

describe('createRouter', () => {
  let meta: RouterMeta
  let logs: LogCapture

  beforeEach(() => {
    logs = captureLogs()
    meta = createRouter('test', logs.logger)
    meta.router.get('/', c => { return c.text('/') })
    meta.router.get('/ping', c => { return c.text('ping') })
  })

  it('includes the resource string', () => {
    expect(meta.resource).toBe('test')
  })

  it('includes the path', () => {
    expect(meta.path).toBe('/test')
  })

  it('logs to the provided logger', async () => {
    await meta.router.request('/test')
    expect(logs.records.some(r => r.messages.includes('/')))
  })

  it('keeps different instances’ logs separate', async () => {
    const otherLog = captureLogs()
    createRouter('other', otherLog.logger)
    await meta.router.request('/test')
    expect(otherLog.records).toHaveLength(0)
  })

  it('ignores trailing slashes', async () => {
    const a = await meta.router.request('/test/ping')
    const b = await meta.router.request('/test/ping/')
    expect(a.status).toBe(StatusCodes.OK)
    expect(b.status).toBe(StatusCodes.OK)
    expect(await a.text()).toBe(await b.text())
  })
})
