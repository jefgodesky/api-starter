import { describe, beforeAll, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { PROVIDERS } from '../../enums.ts'
import DB from '../../DB.ts'
import Account from './model.ts'
import User from '../users/model.ts'
import UserRepository from '../users/repository.ts'
import AccountRepository from './repository.ts'

describe('AccountRepository', () => {
  let repository: AccountRepository
  let acct: Account
  let users: UserRepository
  let user: User
  let uid: string = crypto.randomUUID()

  beforeAll(() => {
    users = new UserRepository()
    repository = new AccountRepository()
  })

  beforeEach(async () => {
    user = await users.save({ name: 'John Doe' })
    if (user.id) uid = user.id
    acct = {
      uid,
      provider: PROVIDERS.GOOGLE,
      pid: '1'
    }
  })

  afterAll(async () => {
    await DB.close()
  })

  afterEach(async () => {
    await DB.clear()
  })

  describe('save', () => {
    it('can create a new account', async () => {
      const saved = await repository.save(acct)
      const { total, rows } = await repository.list()

      expect(saved.uid).toBe(user.id)
      expect(total).toBe(1)
      expect(rows).toHaveLength(1)
      expect(rows[0].id).toBe(saved.id)
    })

    it('won\'t create the same account twice', async () => {
      const saved = await repository.save(acct)
      await repository.save(acct)
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
      const saved = await repository.save(acct)
      const actual = await repository.get(saved.id!)
      expect(actual).not.toBeNull()
      expect(saved.id).toBe(actual!.id)
      expect(actual?.uid).toBe(user.id)
      expect(actual?.provider).toBe(acct.provider)
      expect(actual?.pid).toBe(acct.pid)
    })
  })

  describe('getAccount', () => {
    it('returns null if given an invalid UUID', async () => {
      const actual = await repository.getAccount('lol-nope', PROVIDERS.GOOGLE)
      expect(actual).toBeNull()
    })

    it('returns null if given a user ID that does not exist', async () => {
      const actual = await repository.getAccount('00000000-0000-0000-0000-000000000000', PROVIDERS.GOOGLE)
      expect(actual).toBeNull()
    })

    it('returns null if no such account exists', async () => {
      const actual = await repository.getAccount(uid, PROVIDERS.DISCORD)
      expect(actual).toBeNull()
    })

    it('returns a single record based on ID', async () => {
      const saved = await repository.save(acct)
      const actual = await repository.getAccount(uid, acct.provider)
      expect(actual).not.toBeNull()
      expect(saved.uid).toBe(actual!.uid)
      expect(actual?.pid).toBe(acct.pid)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no records', async () => {
      const actual = await repository.list()
      expect(actual).toEqual({ total: 0, rows: [] })
    })

    it('returns all existing records', async () => {
      await repository.save(acct)
      const actual = await repository.list()
      expect(actual.total).toBe(1)
      expect(actual.rows).toHaveLength(1)
    })

    it('paginates results', async () => {
      const google = await repository.save({ uid, provider: PROVIDERS.GOOGLE, pid: '1' })
      const github = await repository.save({ uid, provider: PROVIDERS.GITHUB, pid: '1' })
      const discord = await repository.save({ uid, provider: PROVIDERS.DISCORD, pid: '1' })

      const p1 = await repository.list(1, 0)
      const p2 = await repository.list(1, 1)
      const p3 = await repository.list(1, 2)
      const scenarios: [{ total: number, rows: Account[] }, Account][] = [[p1, google], [p2, github], [p3, discord]]

      for (const [result, account] of scenarios) {
        expect(result.total).toBe(3)
        expect(result.rows).toHaveLength(1)
        expect(result.rows[0].provider).toBe(account.provider)
        expect(result.rows[0].uid).toBe(user.id)
        expect(result.rows[0].pid).toBe(account.pid)
      }
    })
  })
})
