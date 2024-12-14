import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import type Provider from '../../types/provider.ts'
import type ProviderID from '../../types/provider-id.ts'
import type ProviderResource from '../../types/provider-resource.ts'
import type Resource from '../../types/resource.ts'
import type Response from '../../types/response.ts'
import { PROVIDERS } from '../../types/provider.ts'
import DB from '../../DB.ts'
import expectUsersAccountsTokens from '../../utils/testing/expect-users-accounts-tokens.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import AccountController from './controller.ts'

describe('AccountController', () => {
  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  const setupUserAccount = async (): Promise<{ id: string, provider: Provider }> => {
    const { user, account } = await setupUser({ createToken: false })
    return { id: user.id ?? '', provider: account?.provider ?? PROVIDERS.GOOGLE }
  }

  describe('list', () => {
    it('returns undefined if no user can be found', async () => {
      const res = await AccountController.list(crypto.randomUUID())
      expect(res).toBeUndefined()
    })

    it('returns a list of providers', async () => {
      const { id, provider } = await setupUserAccount()
      const res = await AccountController.list(id)
      expect(res?.data).toHaveLength(1)
      expect((res?.data as Resource[]).map(provider => provider.id)).toEqual([provider])
    })
  })

  describe('get', () => {
    it('returns undefined if no user can be found', async () => {
      const res = await AccountController.get(crypto.randomUUID(), PROVIDERS.GOOGLE)
      expect(res).toBeUndefined()
    })

    it('returns a provider', async () => {
      const { id, provider } = await setupUserAccount()
      const res = await AccountController.get(id, provider)
      const p = res?.data as ProviderResource
      expect(p.type).toBe('provider')
      expect(p.id).toBe(provider)
    })
  })

  describe('create', () => {
    const expectProvider = (res: Response | null, mock: ProviderID) => {
      const p = res?.data as ProviderResource
      expect(res).not.toBeNull()
      expect(p.type).toBe('provider')
      expect(p.id).toBe(mock.provider)
    }

    it('returns null if no such user exists', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GOOGLE, pid: '1' }
      const res = await AccountController.create(crypto.randomUUID(), PROVIDERS.GOOGLE, 'test', mock)
      expect(res).toBeNull()
    })

    it('returns a provider if given a valid token for an existing account', async () => {
      const { id } = await setupUserAccount()
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GOOGLE, pid: '1' }
      const res = await AccountController.create(id, PROVIDERS.GOOGLE, 'test', mock)
      expectProvider(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 0 })
    })

    it('returns null if given an invalid GitHub ID token', async () => {
      const { id } = await setupUserAccount()
      const res = await AccountController.create(id, PROVIDERS.GITHUB, 'test')
      expect(res).toBeNull()
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 0 })
    })

    it('returns a provider if given a valid GitHub ID token', async () => {
      const { id } = await setupUserAccount()
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GITHUB, pid: '1' }
      const res = await AccountController.create(id, PROVIDERS.GITHUB, 'test', mock)
      expectProvider(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 2, tokens: 0 })
    })

    it('returns a provider if given a valid GitHub ID token for an existing account', async () => {
      const { id } = await setupUserAccount()
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GITHUB, pid: '1' }
      await AccountController.create(id, PROVIDERS.GITHUB, 'test', mock)
      const res = await AccountController.create(id, PROVIDERS.GITHUB, 'test', mock)
      expectProvider(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 2, tokens: 0 })
    })

    it('returns null if given an invalid Discord ID token', async () => {
      const { id } = await setupUserAccount()
      const res = await AccountController.create(id, PROVIDERS.DISCORD, 'test')
      expect(res).toBeNull()
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 0 })
    })

    it('returns a provider if given a valid Discord ID token', async () => {
      const { id } = await setupUserAccount()
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.DISCORD, pid: '1' }
      const res = await AccountController.create(id, PROVIDERS.DISCORD, 'test', mock)
      expectProvider(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 2, tokens: 0 })
    })

    it('returns a provider if given a valid Discord ID token for an existing account', async () => {
      const { id } = await setupUserAccount()
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.DISCORD, pid: '1' }
      await AccountController.create(id, PROVIDERS.DISCORD, 'test', mock)
      const res = await AccountController.create(id, PROVIDERS.DISCORD, 'test', mock)
      expectProvider(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 2, tokens: 0 })
    })
  })

  describe('delete', () => {
    it('returns false if no such user exists', async () => {
      const res = await AccountController.delete(crypto.randomUUID(), PROVIDERS.GOOGLE)
      expect(res).toBe(false)
      await expectUsersAccountsTokens({ users: 0, accounts: 0, tokens: 0 })
    })

    it('returns false if no such account exists', async () => {
      const { id } = await setupUserAccount()
      const res = await AccountController.delete(id, PROVIDERS.GITHUB)
      expect(res).toBe(false)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 0 })
    })

    it('deletes account', async () => {
      const { id, provider } = await setupUserAccount()
      const res = await AccountController.delete(id, provider)
      expect(res).toBe(true)
      await expectUsersAccountsTokens({ users: 1, accounts: 0, tokens: 0 })
    })
  })
})
