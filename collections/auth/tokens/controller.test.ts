import { describe, beforeAll, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { validateJWT, type JWTPayload } from '@cross/jwt'
import type { ProviderID } from '../../../index.d.ts'
import { type Response } from '../../../jsonapi.d.ts'
import { PROVIDERS } from '../../../enums.ts'
import type User from '../../users/model.ts'
import DB from '../../../DB.ts'
import UserRepository from '../../users/repository.ts'
import AuthTokenController from './controller.ts'
import AuthTokenResource from '../../../types/auth-token-resource.ts'


describe('AuthTokenController', () => {
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

  describe('create', () => {
    const secret = Deno.env.get('JWT_SECRET') ?? ''

    const getPayloadAndUser = async (res: Response): Promise<{ payload: JWTPayload, user: User | null}> => {
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
      const { payload, user } = await getPayloadAndUser(res!)

      expect(res).not.toBeNull()
      expect(payload.user.name).toBe(mock.name)
      expect(user?.name).toBe(mock.name)
    })

    it('returns null if not given a valid Discord ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.DISCORD, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid Discord access token', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.DISCORD, pid: '1' }
      const res = await AuthTokenController.create(PROVIDERS.DISCORD, 'test', mock)
      const { payload, user } = await getPayloadAndUser(res!)

      expect(res).not.toBeNull()
      expect(payload.user.name).toBe(mock.name)
      expect(user?.name).toBe(mock.name)
    })

    it('returns null if not given a valid GitHub ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.GITHUB, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid GITHUB access token', async () => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GITHUB, pid: '1' }
      const res = await AuthTokenController.create(PROVIDERS.GITHUB, 'test', mock)
      const { payload, user } = await getPayloadAndUser(res!)

      expect(res).not.toBeNull()
      expect(payload.user.name).toBe(mock.name)
      expect(user?.name).toBe(mock.name)
    })
  })
})
