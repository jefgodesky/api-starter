import { describe,it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import UserRouter from '../collections/users/router.ts'
import addRouteParams from './add-route-params.ts'

describe('addRouteParams', () => {
  it('adds route params to state', async () => {
    const middleware = addRouteParams({ users: UserRouter })
    const ctx = createMockContext({
      path: '/v1/users/test'
    })
    await middleware(ctx, createMockNext())
    expect(ctx.state.params.userId).toBe('test')
  })
})
