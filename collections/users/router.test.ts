import { describe, beforeAll, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../DB.ts'
import { type RouterTest, setupRouterTest, closeRouterTest } from '../../utils/setup-router-test.ts'
import UserRepository from './repository.ts'
import getRoot from '../../utils/get-root.ts'

describe('/users', () => {
  let test: RouterTest
  let repository: UserRepository

  beforeAll(async () => {
    test = await setupRouterTest()
    repository = new UserRepository()
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(() => {
    closeRouterTest(test)
  })

  // deno-lint-ignore no-explicit-any
  const expectUser = (res: any, name: string): void => {
    expect(res.status).toBe(200)
    expect(res.body.data).toBeDefined()
    expect(res.body.data.type).toBe('users')
    expect(res.body.data.attributes).toHaveProperty('name', name)
  }

  describe('Collection [/users]', () => {
    describe('POST', () => {
      it('returns 400 if given bad data', async () => {
        const res = await supertest(getRoot())
          .post('/users')
          .set({ 'Content-Type': 'application/vnd.api+json' })
          .send({ a: 1 })

        expect(res.status).toBe(400)
      })

      it('creates a new user', async () => {
        const payload = {
          data: {
            type: 'users',
            attributes: {
              name: 'John Doe'
            }
          }
        }

        const res = await supertest(getRoot())
          .post('/users')
          .set({ 'Content-Type': 'application/vnd.api+json' })
          .send(payload)

        expectUser(res, payload.data.attributes.name)
      })
    })
  })

  describe('Resource [/users/:id]', () => {
    const user = {
      name: 'John Doe',
      username: 'john'
    }

    describe('GET', () => {
      const fieldsets = [
        ['name', user.name, undefined],
        ['username', undefined, user.username],
        ['name,username', user.name, user.username]
      ]

      it('returns 404 if the user ID cannot be found', async () => {
        const res = await supertest(getRoot())
          .get(`/users/${crypto.randomUUID()}`)

        expect(res.status).toBe(404)
      })

      it('returns 404 if the username cannot be found', async () => {
        const res = await supertest(getRoot())
          .get(`/users/${user.username}`)

        expect(res.status).toBe(404)
      })

      it('returns user by ID', async () => {
        const saved = await repository.save(user)
        const res = await supertest(getRoot())
          .get(`/users/${saved.id}`)

        expectUser(res, user.name)
      })

      it('returns user by username', async () => {
        await repository.save(user)
        const res = await supertest(getRoot())
          .get(`/users/${user.username}`)

        expectUser(res, user.name)
      })

      it('supports sparse fieldsets with ID', async () => {
        const saved = await repository.save(user)
        for (const [q, name, username] of fieldsets) {
          const url = `/users/${saved.id}?fields[users]=${q}`
          const res = await supertest(getRoot()).get(url)
          expect(res.body.data.attributes.name).toBe(name)
          expect(res.body.data.attributes.username).toBe(username)
        }
      })

      it('supports sparse fieldsets with username', async () => {
        const saved = await repository.save(user)
        for (const [q, name, username] of fieldsets) {
          const url = `/users/${saved.username}?fields[users]=${q}`
          const res = await supertest(getRoot()).get(url)
          expect(res.body.data.attributes.name).toBe(name)
          expect(res.body.data.attributes.username).toBe(username)
        }
      })
    })
  })
})
