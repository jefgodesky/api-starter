import { validateJWT } from '@cross/jwt'
import AuthToken, { AuthTokenRecord}  from './model.ts'
import type Account from '../accounts/model.ts'
import { type ProviderID } from '../../../index.d.ts'
import { type Provider, PROVIDERS } from '../../../enums.ts'
import { type Response } from '../../../jsonapi.d.ts'
import AuthTokenRepository from './repository.ts'
import AccountRepository from '../accounts/repository.ts'
import UserRepository from '../../users/repository.ts'
import verifyGoogleToken from '../../../utils/auth/verify-google.ts'
import verifyDiscordToken from '../../../utils/auth/verify-discord.ts'
import verifyGitHubToken from '../../../utils/auth/verify-github.ts'
import userToAuthTokenRecord from '../../../utils/transformers/user-to-auth-token-record.ts'
import userProviderIdToAccount from '../../../utils/transformers/user-provider-id-to-account.ts'
import authTokenToAuthTokenRecord from '../../../utils/transformers/auth-token-to-auth-token-record.ts'
import authTokenRecordToAuthToken from '../../../utils/transformers/auth-token-record-to-auth-token.ts'
import authTokenToResponse from '../../../utils/transformers/auth-token-to-response.ts'
import isTest from '../../../utils/is-test.ts'
import getJWTSecret from '../../../utils/get-jwt-secret.ts'
import jwtToAuthTokenRecord from '../../../utils/transformers/jwt-to-auth-token-record.ts'

class AuthTokenController {
  private static tokens: AuthTokenRepository
  private static users: UserRepository
  private static accounts: AccountRepository

  constructor () {
    AuthTokenController.getRepositories()
  }

  static getRepositories (): {
    tokens: AuthTokenRepository,
    users: UserRepository,
    accounts: AccountRepository
  } {
    if (!AuthTokenController.tokens) AuthTokenController.tokens = new AuthTokenRepository()
    if (!AuthTokenController.users) AuthTokenController.users = new UserRepository()
    if (!AuthTokenController.accounts) AuthTokenController.accounts = new AccountRepository()

    return {
      tokens: AuthTokenController.tokens,
      users: AuthTokenController.users,
      accounts: AuthTokenController.accounts
    }
  }

  static async create (provider: Provider, token: string, override?: ProviderID): Promise<Response | null> {
    const { tokens, users, accounts } = AuthTokenController.getRepositories()

    const verification: Record<Provider, (token: string) => Promise<ProviderID | false>> = {
      [PROVIDERS.GOOGLE]: verifyGoogleToken,
      [PROVIDERS.DISCORD]: verifyDiscordToken,
      [PROVIDERS.GITHUB]: verifyGitHubToken
    }

    let v = await verification[provider](token)
    if (!v && override && isTest()) v = override
    if (!v) return null

    const existing = await accounts.getByProviderAndProviderID(v.provider, v.pid)

    const user = existing
      ? await users.get(existing.uid)
      : await users.save({ name: v.name })

    if (!user) return null
    const acct: Account = existing ?? userProviderIdToAccount(user, v)
    if (!existing) await accounts.save(acct)

    let record: AuthTokenRecord = userToAuthTokenRecord(user)
    record = await tokens.save(record)

    const t: AuthToken | null = await authTokenRecordToAuthToken(record)
    if (!t) return null
    return authTokenToResponse(t)
  }

  static async refresh (jwt: string): Promise<Response | null> {
    const record = await jwtToAuthTokenRecord(jwt)
    if (!record) return null
    if (record.refresh_expiration.getTime() < Date.now()) return null

    const { tokens } = AuthTokenController.getRepositories()
    const newRecord = await tokens.exchange(record)
    const newToken = newRecord ? await authTokenRecordToAuthToken(newRecord) : null
    if (!newToken) return null
    return authTokenToResponse(newToken)
  }
}

export default AuthTokenController
