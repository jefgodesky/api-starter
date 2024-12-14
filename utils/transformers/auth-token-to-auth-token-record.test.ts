import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type AuthToken from '../../types/auth-token.ts'
import authTokenToAuthTokenRecord from './auth-token-to-auth-token-record.ts'

describe('authTokenToAuthTokenRecord', () => {
  it('returns an AuthToken', async () => {
    const token: AuthToken = {
      id: crypto.randomUUID(),
      user: {
        id: crypto.randomUUID(),
        name: 'John Doe'
      },
      refresh: 'this should be a real hash actually',
      expiration: {
        token: new Date(Date.now()),
        refresh: new Date(Date.now())
      }
    }

    const actual = await authTokenToAuthTokenRecord(token)
    expect(actual.id).toBe(token.id)
    expect(actual.uid).toBe(token.user.id)
    expect(actual.refresh).toBe(token.refresh)
    expect(actual.token_expiration).toBe(token.expiration.token)
    expect(actual.refresh_expiration).toBe(token.expiration.refresh)
  })
})
