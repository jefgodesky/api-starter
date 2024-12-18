import type Account from '../../types/account.ts'
import type AuthToken from '../../types/auth-token.ts'
import type Provider from '../../types/provider.ts'
import type User from '../../types/user.ts'
import { PROVIDERS } from '../../types/provider.ts'
import AuthTokenController from '../../collections/auth/tokens/controller.ts'
import getTokenExpiration from '../get-token-expiration.ts'
import getRefreshExpiration from '../get-refresh-expiration.ts'
import authTokenRecordToAuthToken from '../transformers/auth-token-record-to-auth-token.ts'
import AuthTokenRecord from '../../types/auth-token-record.ts'

type TestSetupUserOptions = {
  name?: string
  provider?: Provider
  createAccount?: boolean
  createToken?: boolean
}

const setupUser = async({
  name = 'John Doe',
  provider = PROVIDERS.GOOGLE,
  createAccount = true,
  createToken = true
}: TestSetupUserOptions = {}): Promise<{
  user: User,
  account?: Account,
  token?: AuthToken
}> => {
  const { users, accounts, tokens } = AuthTokenController.getRepositories()
  const data: { user: User, account?: Account, token?: AuthToken } = {
    user: await users.save({ name }) as User
  }

  if (createAccount) {
    data.account = await accounts.save({
      uid: data.user.id ?? '',
      provider,
      pid: '1'
    }) as Account
  }

  if (createToken) {
    const record = await tokens.save({
      uid: data.user.id ?? '',
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: getRefreshExpiration()
    }) as AuthTokenRecord
    const token = await authTokenRecordToAuthToken(record)
    if (token) data.token = token
  }

  return data
}

export default setupUser
