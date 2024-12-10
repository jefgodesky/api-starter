import { describe, beforeAll, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from './collections/users/model.ts'
import UserRepository from './collections/users/repository.ts'
import DB from './DB.ts'

describe('DB', () => {
  let users: UserRepository

  beforeAll(() => {
    users = new UserRepository()
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  describe('get', () => {
    it('returns null if no such record exists', async () => {
      const actual = await DB.get<User>('SELECT * FROM users WHERE id = $1', [crypto.randomUUID()])
      expect(actual).toBeNull()
    })

    it('returns the record ', async () => {
      const user = await users.save({ name: 'John Doe' })
      const actual = await DB.get<User>('SELECT * FROM users WHERE id = $1', [user.id!])
      expect(actual?.id).toBe(user.id)
    })
  })
})
