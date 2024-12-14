import { describe, beforeAll, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type AuthTokenRecord from '../../types/auth-token-record.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import UserRepository from '../../collections/users/repository.ts'
import AuthTokenResource from '../../types/auth-token-resource.ts'
import getTokenExpiration from '../get-token-expiration.ts'
import getRefreshExpiration from '../get-refresh-expiration.ts'
import authTokenRecordToAuthToken from './auth-token-record-to-auth-token.ts'
import authTokenToResponse from './auth-token-to-response.ts'

describe('authTokenToResponse', () => {
  let user: User
  let users: UserRepository
  const record: AuthTokenRecord = {
    uid: 'NOT SET',
    refresh: crypto.randomUUID(),
    token_expiration: getTokenExpiration(),
    refresh_expiration: getRefreshExpiration()
  }

  beforeAll(() => {
    users = new UserRepository()
  })

  beforeEach(async () => {
    user = await users.save({ name: 'John Doe' })
    record.uid = user?.id ?? ''
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  it('generates a Response', async () => {
    const token = await authTokenRecordToAuthToken(record)
    const actual = await authTokenToResponse(token!)
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
    expect(actual).toEqual(expected)
  })
})
