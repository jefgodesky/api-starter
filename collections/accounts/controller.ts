import * as uuid from '@std/uuid'
import type Provider from '../../types/provider.ts'
import type ProviderID from '../../types/provider-id.ts'
import type ProviderResource from '../../types/provider-resource.ts'
import type Response from '../../types/response.ts'
import UserRepository from '../users/repository.ts'
import AccountRepository from './repository.ts'
import verifyOAuthToken from '../../utils/auth/verify-oauth.ts'
import isTest from '../../utils/testing/is-test.ts'
import providerResourcesToResponse from '../../utils/transformers/provider-resources-to-response.ts'
import accountToProviderResource from '../../utils/transformers/account-to-provider-resource.ts'

class AccountController {
  private static users: UserRepository
  private static accounts: AccountRepository

  constructor () {
    AccountController.getRepositories()
  }

  static getRepositories (): {
    users: UserRepository,
    accounts: AccountRepository
  } {
    if (!AccountController.users) AccountController.users = new UserRepository()
    if (!AccountController.accounts) AccountController.accounts = new AccountRepository()

    return {
      users: AccountController.users,
      accounts: AccountController.accounts
    }
  }

  static async list (id: string): Promise<Response | undefined> {
    if (!uuid.v4.validate(id)) return undefined
    const { accounts } = AccountController.getRepositories()
    const accts = await accounts.listProviders(id)
    const data: ProviderResource[] = accts.map(id => ({ type: 'provider', id }))
    return data.length === 0
      ? undefined
      : providerResourcesToResponse(data)
  }

  static async get (id: string, provider: Provider): Promise<Response | undefined> {
    if (!uuid.v4.validate(id)) return undefined
    const { accounts } = AccountController.getRepositories()
    const acct = await accounts.getByUIDAndProvider(id, provider)
    return acct === null
      ? undefined
      : providerResourcesToResponse(accountToProviderResource(acct))
  }

  static async create (uid: string, provider: Provider, token: string, override?: ProviderID): Promise<Response | null> {
    if (!uuid.v4.validate(uid)) return null
    const { users, accounts } = AccountController.getRepositories()
    const user = await users.get(uid)
    if (!user) return null

    let verification = await verifyOAuthToken(provider, token)
    if (verification === false && isTest() && override) verification = override
    if (!verification) return null

    const acct = await accounts.save({ uid, provider, pid: verification.pid })
    return acct ? providerResourcesToResponse(accountToProviderResource(acct)) : null
  }

  static async delete (uid: string, provider: Provider): Promise<boolean | null> {
    const { accounts } = AccountController.getRepositories()
    const account = await accounts.getByUIDAndProvider(uid, provider)
    if (!account || !account.id) return false
    await accounts.delete(account.id)
    return true
  }
}

export default AccountController
