import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type AuthToken from '../../types/auth-token.ts'
import authTokenToJWT from './auth-token-to-jwt.ts'
import jwtToAuthTokenRecord from './jwt-to-auth-token-record.ts'

describe('jwtToAuthTokenRecord', () => {
  it('returns an AuthTokenRecord', async () => {
    const token: AuthToken = {
      id: crypto.randomUUID(),
      user: {
        id: crypto.randomUUID(),
        name: 'John Doe'
      },
      refresh: 'refresh hash',
      expiration: {
        token: new Date(Date.now()),
        refresh: new Date(Date.now())
      }
    }

    const jwt = await authTokenToJWT(token)
    const actual = await jwtToAuthTokenRecord(jwt)
    expect(actual?.id).toBe(token.id)
    expect(actual?.uid).toBe(token.user.id)
    expect(actual?.token_expiration).toEqual(token.expiration.token)
    expect(actual?.refresh_expiration).toEqual(token.expiration.refresh)
  })
})
