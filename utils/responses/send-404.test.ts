import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import send404 from './send-404.ts'

describe('send404', () => {
  it('sends a 404 error response', () => {
    const ctx = createMockContext()
    send404(ctx)
    expect(ctx.response.status).toBe(404)
    expect(ctx.response.type).not.toBeDefined()
  })
})
