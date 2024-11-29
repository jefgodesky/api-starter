import { describe, beforeAll, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import client, { clearDB } from '../../client.ts'
import User from './model.ts'
import UserRepository from './repository.ts'

describe('UserRepository', () => {
  let repository: UserRepository
  const john: User = { name: 'John Doe', username: 'john', key: '11111111-1111-1111-1111-111111111111' }
  const jane: User = { name: 'Jane Doe', username: 'jane', key: '22222222-2222-2222-2222-222222222222' }

  beforeAll(async () => {
    await client.connect()
    repository = new UserRepository(client)
  })

  afterAll(async () => {
    await client.end()
  })

  afterEach(async () => {
    await clearDB()
  })

  const populateTestUsers = async (): Promise<void> => {
    await repository.save(john)
    await repository.save(jane)
  }

  describe('save', () => {
    it('can create a new user', async () => {
      const saved = await repository.save(john)
      const fetched = await repository.list()

      expect(saved.id).toBeDefined()
      expect(fetched).toHaveLength(1)
      expect(fetched[0].id).toBe(saved.id)
    })

    it('can update an existing user', async () => {
      const newKey = '33333333-3333-3333-3333-333333333333'
      const saved = await repository.save(john)
      saved.key = newKey
      await repository.save(saved)
      const fetched = await repository.list()

      expect(saved.key).toBe(newKey)
      expect(fetched).toHaveLength(1)
      expect(fetched[0].key).toBe(newKey)
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
      const saved = await repository.save(john)
      const actual = await repository.get(saved.id!)
      expect(actual).not.toBeNull()
      expect(saved.id).toBe(actual!.id)
      expect(actual?.username).toBe(john.username)
    })
  })

  describe('getByUsername', () => {
    it('returns null if given a username that is too long', async () => {
      let name = ''
      for (let i = 0; i < 260; i++) name = `${name}a`
      const actual = await repository.getByUsername(name)
      expect(actual).toBeNull()
    })

    it('returns null if nothing matches', async () => {
      const actual = await repository.getByUsername('lolnope')
      expect(actual).toBeNull()
    })

    it('returns a single record based on username', async () => {
      const saved = await repository.save(john)
      const actual = await repository.getByUsername(john.username ?? 'lolnope')
      expect(actual).not.toBeNull()
      expect(saved.id).toBe(actual!.id)
      expect(actual?.username).toBe(john.username)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no records', async () => {
      const actual = await repository.list()
      expect(actual).toEqual([])
    })

    it('returns all existing records', async () => {
      await populateTestUsers()
      const actual = await repository.list()
      expect(actual).toHaveLength(2)
    })

    it('paginates results', async () => {
      await populateTestUsers()
      const p1 = await repository.list(1, 0)
      const p2 = await repository.list(1, 1)
      const scenarios: [User[], User][] = [[p1, john], [p2, jane]]
      for (const [result, user] of scenarios) {
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe(user.name)
      }
    })
  })
})
