import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import requireUser from './user.ts'

describe('requireUser', () => {
  it('proceeds if there is a user', async () => {
    const ctx = createMockContext({
      state: { user: { name: 'John Doe' } }
    })
    await requireUser(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(401)
  })

  it('returns 401 if there is no user', async () => {
    const ctx = createMockContext()
    await requireUser(ctx, createMockNext())
    expect(ctx.response.status).toBe(401)
  })
})
