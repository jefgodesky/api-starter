import { assertSpyCallAsync } from '@std/testing/mock'
import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import requireUser from './user.ts'

describe('requireUser', () => {
  it('proceeds if there is a user resource in state', async () => {
    const ctx = createMockContext({
      state: { user: { name: 'John Doe' } }
    })

    const next = createNextSpy()
    await requireUser(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 404 if there is no user', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()
    await requireUser(ctx, next)
    expect(next.calls).toHaveLength(0)
    expect(ctx.response.status).toBe(404)
  })
})
