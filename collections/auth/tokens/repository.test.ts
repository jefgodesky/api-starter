import { describe, beforeAll, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import DB from '../../../DB.ts'
import AuthToken from './model.ts'
import User from '../../users/model.ts'
import UserRepository from '../../users/repository.ts'
import AuthTokenRepository from './repository.ts'

describe('AuthTokenRepository', () => {
  let repository: AuthTokenRepository
  let token: AuthToken
  let users: UserRepository
  let user: User
  let uid: string = crypto.randomUUID()

  beforeAll(() => {
    users = new UserRepository()
    repository = new AuthTokenRepository()
  })

  beforeEach(async () => {
    user = await users.save({ name: 'John Doe' })
    if (user.id) uid = user.id
    token = {
      uid,
      refresh: crypto.randomUUID(),
      expires: new Date(Date.now() + (10 * 60 * 1000))
    }
  })

  afterAll(async () => {
    await DB.close()
  })

  afterEach(async () => {
    await DB.clear()
  })

  describe('save', () => {
    it('can create a new token', async () => {
      const saved = await repository.save(token)
      const { total, rows } = await repository.list()

      expect(saved.uid).toBe(user.id)
      expect(total).toBe(1)
      expect(rows).toHaveLength(1)
      expect(rows[0].id).toBe(saved.id)
    })
  })

  describe('get', () => {
    it('returns null if given an invalid UUID', async () => {
      const actual = await repository.get('lol-nope')
      expect(actual).toBeNull()
    })

    it('returns null if nothing matches', async () => {
      const actual = await repository.get('00000000-0000-0000-0000-000000000000')
      expect(actual).toBeNull()
    })

    it('returns a single record based on ID', async () => {
      const saved = await repository.save(token)
      const actual = await repository.get(saved.id!)
      expect(actual).not.toBeNull()
      expect(saved.id).toBe(actual!.id)
      expect(actual?.uid).toBe(user.id)
      expect(actual?.refresh).toBe(token.refresh)
      expect(actual?.expires).toEqual(token.expires)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no records', async () => {
      const actual = await repository.list()
      expect(actual).toEqual({ total: 0, rows: [] })
    })

    it('returns all existing records', async () => {
      await repository.save(token)
      const actual = await repository.list()
      expect(actual.total).toBe(1)
      expect(actual.rows).toHaveLength(1)
    })

    it('paginates results', async () => {
      await repository.save(token)
      await repository.save(token)

      const scenarios = [
        await repository.list(1, 0),
        await repository.list(1, 1)
      ]

      for (const { total, rows } of scenarios) {
        expect(total).toBe(2)
        expect(rows).toHaveLength(1)
        expect(rows[0].uid).toBe(uid)
        expect(rows[0].refresh).toBe(token.refresh)
        expect(rows[0].expires).toEqual(token.expires)
      }
    })
  })
})
