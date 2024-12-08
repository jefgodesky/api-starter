import { describe, beforeAll, beforeEach, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { validateJWT } from '@cross/jwt'
import AuthToken, { AuthTokenRecord } from '../../collections/auth/tokens/model.ts'
import type User from '../../collections/users/model.ts'
import DB from '../../DB.ts'
import UserRepository from '../../collections/users/repository.ts'
import userToAuthTokenRecord from './user-to-auth-token-record.ts'
import getJWTSecret from '../get-jwt-secret.ts'
import authTokenRecordToAuthToken from './auth-token-record-to-auth-token.ts'
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
