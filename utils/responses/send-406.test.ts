import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import send406 from './send-406.ts'

describe('send406', () => {
  it('sends a 406 error response', () => {
    const ctx = createMockContext()
    send406(ctx)
    expect(ctx.response.status).toBe(406)
    expect(ctx.response.type).not.toBeDefined()
  })
})
