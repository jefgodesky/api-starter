import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import can from './can.ts'

describe('can', () => {
  it('proceeds if user has all necessary permissions', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['read', 'write'],
        user: { name: 'John Doe' }
      }
    })

    const middleware = can('read', 'write')
    await middleware(ctx, createMockNext())

    expect(ctx.response.status).not.toBe(401)
    expect(ctx.response.status).not.toBe(403)
  })

  it('returns 401 if anonymous user lacks permissions', async () => {
    const ctx = createMockContext({
      state: { permissions: ['read'] }
    })

    const middleware = can('read', 'write')
    await middleware(ctx, createMockNext())

    expect(ctx.response.status).toBe(401)
  })

  it('returns 403 if authenticated user lacks permissions', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['read'],
        user: { name: 'John Doe' }
      }
    })

    const middleware = can('read', 'write')
    await middleware(ctx, createMockNext())

    expect(ctx.response.status).toBe(403)
  })
})