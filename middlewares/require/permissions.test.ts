import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import requirePermissions from './permissions.ts'

describe('requirePermissions', () => {
  it('proceeds if user has all necessary permissions', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['read', 'write'],
        client: { name: 'John Doe' }
      }
    })

    const middleware = requirePermissions('read', 'write')
    await middleware(ctx, createMockNext())

    expect(ctx.response.status).not.toBe(401)
    expect(ctx.response.status).not.toBe(403)
  })

  it('grants all permissions to someone with *', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['*'],
        client: { name: 'John Doe' }
      }
    })

    const middleware = requirePermissions('read', 'write')
    await middleware(ctx, createMockNext())

    expect(ctx.response.status).not.toBe(401)
    expect(ctx.response.status).not.toBe(403)
  })

  it('returns 401 if anonymous user lacks permissions', async () => {
    const ctx = createMockContext({
      state: { permissions: ['read'] }
    })

    const middleware = requirePermissions('read', 'write')
    await middleware(ctx, createMockNext())

    expect(ctx.response.status).toBe(401)
  })

  it('returns 403 if authenticated user lacks permissions', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['read'],
        client: { name: 'John Doe' }
      }
    })

    const middleware = requirePermissions('read', 'write')
    await middleware(ctx, createMockNext())

    expect(ctx.response.status).toBe(403)
  })
})
