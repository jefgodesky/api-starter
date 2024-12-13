import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { validateJWT, type JWTPayload } from '@cross/jwt'
import type { ProviderID } from '../../../types/provider-id.ts'
import { PROVIDERS } from '../../../types/provider.ts'
import type Response from '../../../types/response.ts'
import type User from '../../users/model.ts'
import type AuthTokenResource from '../../../types/auth-token-resource.ts'
import DB from '../../../DB.ts'
import AuthTokenController from './controller.ts'
import authTokenToJWT from '../../../utils/transformers/auth-token-to-jwt.ts'
import userToAuthTokenRecord from '../../../utils/transformers/user-to-auth-token-record.ts'
import authTokenRecordToAuthToken from '../../../utils/transformers/auth-token-record-to-auth-token.ts'
import getJWTSecret from '../../../utils/get-jwt-secret.ts'


describe('AuthTokenController', () => {
  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  describe('create', () => {
    const secret = Deno.env.get('JWT_SECRET') ?? ''

    const expectToken = async (res: Response | null, mock: ProviderID): Promise<void> => {
      const { payload, user } = await getPayloadAndUser(res!)
      expect(res).not.toBeNull()
      expect(payload.user.name).toBe(mock.name)
      expect(user?.name).toBe(mock.name)
    }

    const expectUsersAccountsTokens = async (expected: { users: number, accounts: number, tokens: number }): Promise<void> => {
      const repositories = AuthTokenController.getRepositories()
      const users = await repositories.users.list()
      const accounts = await repositories.accounts.list()
      const tokens = await repositories.tokens.list()
      expect(users?.total).toBe(expected.users)
      expect(accounts?.total).toBe(expected.accounts)
      expect(tokens?.total).toBe(expected.tokens)
    }

    const getPayloadAndUser = async (res: Response): Promise<{ payload: JWTPayload, user: User | null}> => {
      const { users } = AuthTokenController.getRepositories()
      const jwt = (res?.data as AuthTokenResource)?.attributes.token ?? ''
      const payload = await validateJWT(jwt, secret)
      const user = await users.get(payload.user.id)
      return { payload, user }
    }

    it('returns null if not given a valid Google ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.GOOGLE, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid Google ID token', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GOOGLE, pid: '1' }
      const res = await AuthTokenController.create(PROVIDERS.GOOGLE, 'test', mock)
      await expectToken(res, mock)
    })

    it('returns a new token if given a valid Google ID token for an existing account', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GOOGLE, pid: '1' }
      await AuthTokenController.create(PROVIDERS.GOOGLE, 'test', mock)
      const res = await AuthTokenController.create(PROVIDERS.GOOGLE, 'test', mock)
      await expectToken(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 2 })
    })

    it('returns null if not given a valid Discord ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.DISCORD, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid Discord access token', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.DISCORD, pid: '1' }
      const res = await AuthTokenController.create(PROVIDERS.DISCORD, 'test', mock)
      await expectToken(res, mock)
    })

    it('returns a new token if given a valid Discord ID token for an existing account', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.DISCORD, pid: '1' }
      await AuthTokenController.create(PROVIDERS.DISCORD, 'test', mock)
      const res = await AuthTokenController.create(PROVIDERS.DISCORD, 'test', mock)
      await expectToken(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 2 })
    })

    it('returns null if not given a valid GitHub ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.GITHUB, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid GITHUB access token', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GITHUB, pid: '1' }
      const res = await AuthTokenController.create(PROVIDERS.GITHUB, 'test', mock)
      await expectToken(res, mock)
    })

    it('returns a new token if given a valid GitHub ID token for an existing account', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GITHUB, pid: '1' }
      await AuthTokenController.create(PROVIDERS.GITHUB, 'test', mock)
      const res = await AuthTokenController.create(PROVIDERS.GITHUB, 'test', mock)
      await expectToken(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 2 })
    })
  })

  describe('refresh', () => {
    it('returns null if given an invalid token', async () => {
      const res = await AuthTokenController.refresh('nope')
      expect(res).toBeNull()
    })

    it('returns null if the refresh expiration has expired', async () => {
      const { users, tokens } = AuthTokenController.getRepositories()
      const user = await users.save({ name: 'John Doe' })
      let record = userToAuthTokenRecord(user)
      record.refresh_expiration = new Date(Date.now() - (60 * 1000))
      record = await tokens.save(record)
      const token = await authTokenRecordToAuthToken(record)
      const jwt = await authTokenToJWT(token!)

      const res = await AuthTokenController.refresh(jwt)
      expect(res).toBeNull()
    })

    it('refreshes the token', async () => {
      const { users, tokens } = AuthTokenController.getRepositories()
      const user = await users.save({ name: 'John Doe' })
      let record = userToAuthTokenRecord(user)
      record = await tokens.save(record)
      const token = await authTokenRecordToAuthToken(record)
      const jwt = await authTokenToJWT(token!)

      const res = await AuthTokenController.refresh(jwt)
      const actualJWT = (res?.data as AuthTokenResource)?.attributes.token ?? ''
      try {
        const payload = await validateJWT(actualJWT, getJWTSecret(), { validateExp: true })
        expect(payload.sub).toBe(user.id)
        expect(payload.user.id).toBe(user.id)
        expect(payload.user.name).toBe(user.name)
        expect(payload.refresh).toBeDefined()
        expect(payload.expiration.token).toBeDefined()
        expect(payload.expiration.refresh).toBeDefined()
      } catch (err) {
        expect(err).not.toBeDefined()
      }
    })
  })
})