import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import send400 from './send-400.ts'

describe('send400', () => {
  it('sends a 400 error response', () => {
    const ctx: MockContext = { response: {} }
    send400(ctx)
    expect(ctx.response.status).toBe(400)
    expect(ctx.response.type).not.toBeDefined()
  })
})
