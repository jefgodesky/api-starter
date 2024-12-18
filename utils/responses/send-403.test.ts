import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import send403 from './send-403.ts'

describe('send403', () => {
  it('sends a 403 error response', () => {
    const ctx = createMockContext()
    send403(ctx)
    expect(ctx.response.status).toBe(403)
    expect(ctx.response.type).not.toBeDefined()
  })
})
