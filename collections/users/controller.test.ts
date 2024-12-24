import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type Response from '../../types/response.ts'
import type UserResource from '../../types/user-resource.ts'
import DB from '../../DB.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import stringToReadableStream from '../../utils/transformers/string-to-readable-stream.ts'
import expectUsersAccountsTokens from '../../utils/testing/expect-users-accounts-tokens.ts'
import UserController from './controller.ts'

describe('UserController', () => {
  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  const user = {
    id: crypto.randomUUID(),
    name: 'John Doe',
    username: 'john',
  }

  describe('get', () => {
    const ctx = createMockContext({ state: { user } })

    it('returns the user', () => {
      UserController.get(ctx)
      const data = (ctx.response.body as Response)?.data as UserResource
      expect(ctx.response.status).toBe(200)
      expect(data).toBeDefined()
      expect(data.type).toBe('users')
      expect(data.attributes).toHaveProperty('name', name)
    })

    it('returns a sparse fieldset', () => {
      const fieldsets = [
        ['name', user.name, undefined],
        ['username', undefined, user.username],
        ['name,username', user.name, user.username]
      ]

      for (const [q, name, username] of fieldsets) {
        const url = new URL(`http://localhost:8001/v1/users/${user.id}?fields[users]=${q}`)
        UserController.get(ctx, url)
        const data = (ctx.response.body as Response)?.data as UserResource
        expect(ctx.response.status).toBe(200)
        expect(data.attributes.name).toBe(name)
        expect(data.attributes.username).toBe(username)
      }
    })
  })

  describe('patch', () => {
    it('updates the fields provided', async () => {
      const name = 'Jonathan Dauex'
      const update = {
        data: {
          type: 'users',
          id: user.id,
          attributes: { name }
        }
      }

      const body = stringToReadableStream(JSON.stringify(update))
      const ctx = createMockContext({ body, state: { user } })
      await UserController.patch(ctx)
      const data = (ctx.response.body as Response)?.data as UserResource

      expect(ctx.response.status).toBe(200)
      expect(data.attributes.name).toBe(name)
      expect(data.attributes.username).toBe(user.username)
      expect(data.id).toBe(user.id)
    })
  })

  describe('destroy', () => {
    it('deletes the user', async () => {
      const { user } = await setupUser()
      const ctx = createMockContext({ state: { user } })
      await UserController.destroy(ctx)

      expect(ctx.response.status).toBe(204)
      await expectUsersAccountsTokens({ users: 0, accounts: 0, tokens: 0 })
    })
  })
})
