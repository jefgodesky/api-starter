import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import send401 from './send-401.ts'

describe('send401', () => {
  it('sends a 401 error response', () => {
    const ctx = createMockContext()
    send401(ctx)
    expect(ctx.response.status).toBe(401)
    expect(ctx.response.headers.get('WWW-Authenticate')).toBe('Bearer')
    expect(ctx.response.type).not.toBeDefined()
  })
})
