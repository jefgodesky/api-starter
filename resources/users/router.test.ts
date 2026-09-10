import { afterEach, before, beforeEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import { type User } from './db/types.ts'
import { clear, db } from '../../db/index.ts'
import { usersType } from './schema.ts'
import getRoot from '../../utils/root.ts'
import api from '../../api.ts'

const JSONAPI = 'application/vnd.api+json'
const headers = { 'Accept': JSONAPI, 'Content-Type': JSONAPI }

const seed = (
  name = 'John Doe',
  username: string | null = 'john',
): Promise<User> =>
  db.insertInto('users').values({ name, username })
    .returningAll().executeTakeFirstOrThrow()

const expectUser = async (
  res: Response,
  user: User,
): Promise<void> => {
  const doc = await res.json()
  expect(res.status).toBe(200)
  expect(doc.data.type).toBe(usersType)
  expect(doc.data.id).toBe(user.id)
  expect(doc.data.attributes).toEqual({
    name: user.name,
    username: user.username,
  })
}

describe('/users', () => {
  let endpoint: string

  before(() => {
    endpoint = [getRoot(), usersType].join('/')
  })

  beforeEach(clear)
  afterEach(clear)

  describe('GET /users/:id', () => {
    it('returns a user by ID', async () => {
      const user = await seed()
      const url = [endpoint, user.id].join('/')
      const res = await api.request(url, { headers })
      await expectUser(res, user)
    })

    it('returns a user by username', async () => {
      const user = await seed()
      const url = [endpoint, user.username].join('/')
      const res = await api.request(url, { headers })
      await expectUser(res, user)
    })

    it('applies sparse fieldset', async () => {
      const user = await seed()
      const url = `${endpoint}/${user.id}?fields[${usersType}]=name`
      const res = await api.request(url, { headers })
      const doc = await res.json()
      expect(doc.data.attributes).toEqual({ name: user.name })
    })

    it('returns 404 if given an unknown ID', async () => {
      const url = `${endpoint}/${crypto.randomUUID()}`
      const res = await api.request(url, { headers })
      expect(res.status).toBe(404)
      expect((await res.json()).errors[0].status).toBe('404')
    })

    it('returns 404 if given an unknown username', async () => {
      const url = `${endpoint}/lol-nope`
      const res = await api.request(url, { headers })
      expect(res.status).toBe(404)
      expect((await res.json()).errors[0].status).toBe('404')
    })

    it('returns 406 if given an invalid Accept header', async () => {
      const user = await seed()
      const res = await api.request(
        `${endpoint}/${user.id}`,
        { headers: { Accept: 'application/json' } },
      )
      expect(res.status).toBe(406)
    })
  })

  describe('GET /users', () => {
    beforeEach(async () => {
      await seed()
      await seed('Jane Doe', null)
    })

    it('returns a page of users', async () => {
      const res = await api.request(endpoint, { headers })
      const doc = await res.json()
      expect(res.status).toBe(200)
      expect(Array.isArray(doc.data)).toBe(true)
      expect(doc.data).toHaveLength(2)
      expect(doc.links.self).toBeDefined()
      expect(doc.links.first).toBeDefined()
    })

    it('paginates', async () => {
      const url = `${endpoint}?page[limit]=1`
      const res = await api.request(url, { headers })
      const doc = await res.json()
      expect(doc.data).toHaveLength(1)
      expect(doc.links.next).not.toBeNull()
    })
  })

  describe('PATCH /users/:id', () => {
    const name = 'Jonathan Doe'
    const makePatch = (id: string) => {
      return {
        data: {
          type: usersType,
          id,
          attributes: { name },
        },
      }
    }

    it('updates the user by ID', async () => {
      const user = await seed()
      const name = 'Jonathan Doe'
      const url = `${endpoint}/${user.id}`
      const res = await api.request(url, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(makePatch(user.id)),
      })

      await expectUser(res, { ...user, name })
    })

    it('updates the user by username', async () => {
      const user = await seed()
      const name = 'Jonathan Doe'
      const url = `${endpoint}/${user.username}`
      const res = await api.request(url, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(makePatch(user.id)),
      })

      await expectUser(res, { ...user, name })
    })

    it('returns 409 if the URL and body disagree on ID', async () => {
      const user = await seed()
      const url = `${endpoint}/${user.username}`
      const res = await api.request(url, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(makePatch(crypto.randomUUID())),
      })
      expect(res.status).toBe(409)
    })

    it('returns 422 if body is invalid', async () => {
      const user = await seed()
      const url = `${endpoint}/${user.username}`
      const patch = makePatch(user.id)
      patch.data.type = 'testers'
      const res = await api.request(url, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(patch),
      })
      expect(res.status).toBe(422)
    })
  })

  describe('DELETE /users/:id', () => {
    const del = { method: 'DELETE', headers }

    it('deletes by ID', async () => {
      const user = await seed()
      const url = `${endpoint}/${user.id}`
      const res = await api.request(url, del)
      expect(res.status).toBe(204)

      const check = await api.request(url, { headers })
      expect(check.status).toBe(404)
    })

    it('deletes by username', async () => {
      const user = await seed()
      const url = `${endpoint}/${user.username}`
      const res = await api.request(url, del)
      expect(res.status).toBe(204)

      const check = await api.request(url, { headers })
      expect(check.status).toBe(404)
    })
  })
})
