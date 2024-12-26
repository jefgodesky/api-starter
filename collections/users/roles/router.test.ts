import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type User from '../../../types/user.ts'
import DB from '../../../DB.ts'
import RoleRepository from './repository.ts'
import authTokenToJWT from '../../../utils/transformers/auth-token-to-jwt.ts'
import getSupertestRoot from '../../../utils/testing/get-supertest-root.ts'
import setupUser from '../../../utils/testing/setup-user.ts'

describe('/users/:userId/roles', () => {
  let user: User
  let repository: RoleRepository
  let jwt: string

  beforeEach(async () => {
    repository = new RoleRepository()
    const data = await setupUser()
    user = data.user

    const admin = await setupUser({ username: 'admin' })
    admin.token!.user.roles = ['active', 'listed', 'admin']
    jwt = await authTokenToJWT(admin.token!)
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  describe('Resource [/users/:userId/roles/:role]', () => {
    describe('POST', () => {
      const role = 'test'

      it('returns 404 if the user ID cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/${crypto.randomUUID()}/roles/${role}`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        const check = await repository.has(user.id!, role)
        expect(res.status).toBe(404)
        expect(check).toBe(false)
      })

      it('returns 404 if the username cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/lol-nope/roles/${role}`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        const check = await repository.has(user.id!, role)
        expect(res.status).toBe(404)
        expect(check).toBe(false)
      })

      it('grants role by user ID', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/${user.id}/roles/${role}`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        const check = await repository.has(user.id!, role)
        expect(res.status).toBe(204)
        expect(check).toBe(true)
      })

      it('grants role by username', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/${user.username}/roles/${role}`)
          .set({
            Authorization: `Bearer ${jwt}`
          })

        const check = await repository.has(user.id!, role)
        expect(res.status).toBe(204)
        expect(check).toBe(true)
      })
    })
  })
})
