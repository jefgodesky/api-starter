import { describe, beforeAll, beforeEach, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { validateJWT } from '@cross/jwt'
import type AuthToken from '../../types/auth-token.ts'
import type AuthTokenRecord from '../../types/auth-token-record.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import UserRepository from '../../collections/users/repository.ts'
import userToAuthTokenRecord from './user-to-auth-token-record.ts'
import getJWTSecret from '../get-jwt-secret.ts'
import authTokenRecordToAuthToken from './auth-token-record-to-auth-token.ts'
import expectAuthTokenJWT from '../testing/expect-auth-token-jwt.ts'
import authTokenToJWT from './auth-token-to-jwt.ts'

describe('authTokenToJWT', () => {
  let users: UserRepository
  let user: User
  let record: AuthTokenRecord
  let token: AuthToken | null

  beforeAll(() => {
    users = new UserRepository()
  })

  beforeEach(async () => {
    user = await users.save({ name: 'John Doe' })
    record = userToAuthTokenRecord(user)
    token = await authTokenRecordToAuthToken(record)
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  it('returns a JWT', async () => {
    const actual = await authTokenToJWT(token!)

    try {
      const payload = await validateJWT(actual, getJWTSecret())
      expectAuthTokenJWT(payload, user)
    } catch (err) {
      expect(err).not.toBeDefined()
    }
  })
})
