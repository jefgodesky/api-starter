import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import authTokenToJWT from '../../utils/transformers/auth-token-to-jwt.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import expectUsersAccountsTokens from '../../utils/testing/expect-users-accounts-tokens.ts'

describe('/users', () => {
  let user: User
  let jwt: string

  beforeEach(async () => {
    const data = await setupUser()
    user = data.user
    jwt = await authTokenToJWT(data.token!)
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  // deno-lint-ignore no-explicit-any
  const expectUser = (res: any, name: string): void => {
    expect(res.status).toBe(200)
    expect(res.body.data).toBeDefined()
    expect(res.body.data.type).toBe('users')
    expect(res.body.data.attributes).toHaveProperty('name', name)
  }

  describe('Resource [/users/:userId]', () => {
    describe('GET', () => {
      it('returns 404 if the user ID cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .get(`/users/${crypto.randomUUID()}`)

        expect(res.status).toBe(404)
      })

      it('returns 404 if the username cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .get(`/users/lol-nope`)

        expect(res.status).toBe(404)
      })

      it('returns user by ID', async () => {
        const res = await supertest(getSupertestRoot())
          .get(`/users/${user.id}`)

        expectUser(res, user.name)
      })

      it('returns user by username', async () => {
        const res = await supertest(getSupertestRoot())
          .get(`/users/${user.username}`)

        expectUser(res, user.name)
      })

      it('supports sparse fieldsets with ID', async () => {
        const fieldsets = [
          ['name', user.name, undefined],
          ['username', undefined, user.username],
          ['name,username', user.name, user.username]
        ]

        for (const [q, name, username] of fieldsets) {
          const url = `/users/${user.id}?fields[users]=${q}`
          const res = await supertest(getSupertestRoot()).get(url)
          expect(res.body.data.attributes.name).toBe(name)
          expect(res.body.data.attributes.username).toBe(username)
        }
      })

      it('supports sparse fieldsets with username', async () => {
        const fieldsets = [
          ['name', user.name, undefined],
          ['username', undefined, user.username],
          ['name,username', user.name, user.username]
        ]

        for (const [q, name, username] of fieldsets) {
          const url = `/users/${user.username}?fields[users]=${q}`
          const res = await supertest(getSupertestRoot()).get(url)
          expect(res.body.data.attributes.name).toBe(name)
          expect(res.body.data.attributes.username).toBe(username)
        }
      })
    })

    describe('PATCH', () => {
      const name = 'Jean Deaux'

      it('returns 404 if the user ID cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .patch(`/users/${crypto.randomUUID()}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({ data: { type: 'users', attributes: { name } } })

        expect(res.status).toBe(404)
      })

      it('returns 404 if the username cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .patch(`/users/lol-nope`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({ data: { type: 'users', attributes: { name } } })

        expect(res.status).toBe(404)
      })

      it('updates user found by ID', async () => {
        const res = await supertest(getSupertestRoot())
          .patch(`/users/${user.id}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({ data: { type: 'users', attributes: { name } } })

        expectUser(res, name)
      })

      it('updates user found by username', async () => {
        const res = await supertest(getSupertestRoot())
          .patch(`/users/${user.username}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({ data: { type: 'users', attributes: { name } } })

        expectUser(res, name)
      })
    })

    describe('DELETE', () => {
      it('returns 404 if the user ID cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/${crypto.randomUUID()}`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        expect(res.status).toBe(404)
      })

      it('returns 404 if the username cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/lol-nope`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        expect(res.status).toBe(404)
      })

      it('deletes user found by ID', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/${user.id}`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        expect(res.status).toBe(204)
        await expectUsersAccountsTokens({ users: 0, accounts: 0, tokens: 0 })
      })

      it('deletes user found by username', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/${user.username}`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        expect(res.status).toBe(204)
        await expectUsersAccountsTokens({ users: 0, accounts: 0, tokens: 0 })
      })
    })
  })
})
