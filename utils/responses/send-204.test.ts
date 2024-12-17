import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import send204 from './send-204.ts'

describe('send204', () => {
  it('sends a 204 response', () => {
    const ctx = createMockContext()
    send204(ctx)
    expect(ctx.response.status).toBe(204)
    expect(ctx.response.type).not.toBeDefined()
  })
})
