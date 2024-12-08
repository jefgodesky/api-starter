import { describe, beforeAll, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { verify } from '@stdext/crypto/hash'
import DB from '../../../DB.ts'
import User from '../../users/model.ts'
import UserRepository from '../../users/repository.ts'
import { AuthTokenRecord } from './model.ts'
import {
  recordToToken,
  makeAuthTokenResponse
} from './resource.ts'
import AuthTokenResource from '../../../types/auth-token-resource.ts'

describe('AuthTokenResource methods', () => {
  let user: User
  let users: UserRepository

  beforeAll(() => {
    users = new UserRepository()
  })

  beforeEach(async () => {
    user = await users.save({ name: 'John Doe' })
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  describe('recordToToken', () => {
    it('returns null if user cannot be found', async () => {
      const record: AuthTokenRecord = {
        uid: crypto.randomUUID(),
        refresh: crypto.randomUUID(),
        token_expiration: new Date(Date.now() + 60000),
        refresh_expiration: new Date(Date.now() + 120000)
      }

      const actual = await recordToToken(record)
      expect(actual).toBeNull()
    })

    it('turns an AuthTokenRecord into an AuthToken', async () => {
      const record: AuthTokenRecord = {
        uid: user.id ?? '',
        refresh: crypto.randomUUID(),
        token_expiration: new Date(Date.now() + 60000),
        refresh_expiration: new Date(Date.now() + 120000)
      }

      const actual = await recordToToken(record)
      expect(actual?.user.id).toBe(user.id)
      expect(actual?.user.name).toBe(user.name)
      expect(actual?.expiration.token).toEqual(record.token_expiration)
      expect(actual?.expiration.refresh).toEqual(record.refresh_expiration)

      try {
        const verified = verify('argon2', record.refresh, actual?.refresh ?? '')
        expect(verified).toBe(true)
      } catch {
        expect('Refresh token hash verification failed.').toBe(true)
      }
    })
  })

  describe('makeAuthTokenResponse', () => {
    const record: AuthTokenRecord = {
      uid: user?.id ?? '',
      refresh: crypto.randomUUID(),
      token_expiration: new Date(Date.now() + 60000),
      refresh_expiration: new Date(Date.now() + 120000)
    }

    beforeEach(() => {
      record.uid = user?.id ?? ''
    })

    it('generates a Response', async () => {
      const token = await recordToToken(record)
      const actual = await makeAuthTokenResponse(token!)
      const data = actual.data as AuthTokenResource

      const expectedData: AuthTokenResource = {
        type: 'token',
        id: token?.id ?? '',
        attributes: {
          token: data.attributes.token,
          expiration: record.token_expiration.toString()
        }
      }

      const expected = {
        jsonapi: { version: '1.1' },
        links: {
          self: 'http://localhost:8001/v1/auth/token',
          describedBy: 'http://localhost:8001/v1/docs'
        },
        data: expectedData
      }
      console.log(actual)
      expect(actual).toEqual(expected)
    })
  })
})
