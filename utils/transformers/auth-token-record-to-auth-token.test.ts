import { describe, beforeAll, beforeEach, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { verify } from '@stdext/crypto/hash'
import { type AuthTokenRecord } from '../../collections/auth/tokens/model.ts'
import type User from '../../collections/users/model.ts'
import UserRepository from '../../collections/users/repository.ts'
import DB from '../../DB.ts'
import getTokenExpiration from '../get-token-expiration.ts'
import getRefreshExpiration from '../get-refresh-expiration.ts'
import authTokenRecordToAuthToken from './auth-token-record-to-auth-token.ts'

describe('authTokenRecordToAuthToken', () => {
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

  it('returns null if user cannot be found', async () => {
    const record: AuthTokenRecord = {
      uid: crypto.randomUUID(),
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: getRefreshExpiration()
    }

    const actual = await authTokenRecordToAuthToken(record)
    expect(actual).toBeNull()
  })

  it('turns an AuthTokenRecord into an AuthToken', async () => {
    const record: AuthTokenRecord = {
      uid: user.id ?? '',
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: getRefreshExpiration()
    }

    const actual = await authTokenRecordToAuthToken(record)
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
