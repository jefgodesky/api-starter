import * as uuid from '@std/uuid'
import { Context, Status, createHttpError } from '@oak/oak'
import type Provider from '../../types/provider.ts'
import type ProviderID from '../../types/provider-id.ts'
import type ProviderResource from '../../types/provider-resource.ts'
import type Response from '../../types/response.ts'
import type TokenAccessAttributes from '../../types/token-access-attributes.ts'
import type TokenCreation from '../../types/token-creation.ts'
import UserRepository from '../users/repository.ts'
import AccountRepository from './repository.ts'
import verifyOAuthToken from '../../utils/auth/verify-oauth.ts'
import isTest from '../../utils/testing/is-test.ts'
import providerResourcesToResponse from '../../utils/transformers/provider-resources-to-response.ts'
import accountToProviderResource from '../../utils/transformers/account-to-provider-resource.ts'
import getMessage from '../../utils/get-message.ts'
import sendJSON from '../../utils/send-json.ts'

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

  static async create (ctx: Context, override?: ProviderID): Promise<void> {
    const uid = ctx.state.user.id
    const body = await ctx.request.body.json() as TokenCreation
    const { provider, token } = body.data.attributes as TokenAccessAttributes

    if (!uuid.v4.validate(uid)) throw createHttpError(Status.InternalServerError)
    const { users, accounts } = AccountController.getRepositories()
    const user = await users.get(uid)
    if (!user) throw createHttpError(Status.NotFound, getMessage('user_not_found'))

    let verification = await verifyOAuthToken(provider, token)
    if (verification === false && isTest() && override) verification = override
    if (!verification) throw createHttpError(Status.BadRequest, getMessage('invalid_auth_token'))

    const acct = await accounts.save({ uid, provider, pid: verification.pid })
    if (!acct) throw createHttpError(Status.InternalServerError)
    sendJSON(ctx, providerResourcesToResponse(accountToProviderResource(acct)))
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
