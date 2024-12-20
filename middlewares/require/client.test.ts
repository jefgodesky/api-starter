import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import requireClient from './client.ts'

describe('requireClient', () => {
  it('proceeds if there is an authenticated client user', async () => {
    const ctx = createMockContext({
      state: { client: { name: 'John Doe' } }
    })
    await requireClient(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(401)
  })

  it('returns 401 if there is no user', async () => {
    const ctx = createMockContext()
    await requireClient(ctx, createMockNext())
    expect(ctx.response.status).toBe(401)
  })
})
