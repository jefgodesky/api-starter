import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import send415 from './send-415.ts'

describe('send415', () => {
  it('sends a 415 error response', () => {
    const ctx = createMockContext()
    send415(ctx)
    expect(ctx.response.status).toBe(415)
    expect(ctx.response.type).not.toBeDefined()
  })
})
