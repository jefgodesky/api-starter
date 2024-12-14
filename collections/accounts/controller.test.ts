import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import type Resource from '../../types/resource.ts'
import DB from '../../DB.ts'
import Provider, { PROVIDERS } from '../../types/provider.ts'
import AccountController from './controller.ts'
import ProviderResource from '../../types/provider-resource.ts'

describe('AccountController', () => {
  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  const setupUserAccount = async (): Promise<{ id: string, provider: Provider }> => {
    const { users, accounts } = AccountController.getRepositories()
    const provider = PROVIDERS.GOOGLE
    const saved = await users.save({ name: 'John Doe' })
    await accounts.save({ uid: saved.id!, provider, pid: '1' })
    return { id: saved.id ?? '', provider }
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
})
