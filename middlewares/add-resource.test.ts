import { describe, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import DB from '../DB.ts'
import setupUser from '../utils/testing/setup-user.ts'
import addResource from './add-resource.ts'

describe('addResource', () => {
  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  it('adds the user requested by ID', async () => {
    const { user } = await setupUser({ createAccount: false, createToken: false })
    const ctx = createMockContext({
      state: { params: { userId: user.id } }
    })
    await addResource(ctx, createMockNext())

    expect(ctx.state.user).toBeDefined()
    expect(ctx.state.user.id).toBe(user.id)
    expect(ctx.state.user.name).toBe(user.name)
  })

  it('adds the user requested by username', async () => {
    const { user } = await setupUser({ createAccount: false, createToken: false })
    const ctx = createMockContext({
      state: { params: { userId: user.username } }
    })
    await addResource(ctx, createMockNext())

    expect(ctx.state.user).toBeDefined()
    expect(ctx.state.user.id).toBe(user.id)
    expect(ctx.state.user.name).toBe(user.name)
  })
})
