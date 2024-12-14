import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import { signJWT, type JWTPayload } from '@cross/jwt'
import type AuthToken from '../types/auth-token.ts'
import getJWTSecret from '../utils/get-jwt-secret.ts'
import getRefreshExpiration from '../utils/get-refresh-expiration.ts'
import getTokenExpiration from '../utils/get-token-expiration.ts'
import addUser from './add-user.ts'

describe('addUser', () => {
  const getToken = async (
    expired: boolean = false,
    name: string = 'John Doe'
  ): Promise<{ jwt: string, name: string }> => {
    const tokenExpiration = expired
      ? new Date(Date.now() - (5 * 60 * 1000))
      : getTokenExpiration()

    const token: AuthToken = {
      user: { name },
      refresh: 'hash-of-refresh-token',
      expiration: {
        token: tokenExpiration,
        refresh: getRefreshExpiration()
      }
    }

    const payload: JWTPayload = {
      ...token,
      exp: Math.round(tokenExpiration.getTime() / 1000)
    }

    const jwt = await signJWT(payload, getJWTSecret())
    return { jwt, name }
  }

  it('proceeds if not given an authorization header', async () => {
    const ctx = createMockContext()
    await addUser(ctx, createMockNext())
    expect(ctx.state.user).not.toBeDefined()
  })

  it('proceeds if not given a valid authorization header', async () => {
    const ctx = createMockContext({
      headers: [['Authorization', 'Bearer bad']]
    })
    await addUser(ctx, createMockNext())
    expect(ctx.state.user).not.toBeDefined()
  })

  it('proceeds if given an expired token', async () => {
    const { jwt } = await getToken(true)
    const ctx = createMockContext({
      headers: [['Authorization', `Bearer ${jwt}`]]
    })
    await addUser(ctx, createMockNext())

    expect(ctx.state.user).not.toBeDefined()
  })

  it('attaches the user', async () => {
    const { jwt, name } = await getToken()
    const ctx = createMockContext({
      headers: [['Authorization', `Bearer ${jwt}`]]
    })
    await addUser(ctx, createMockNext())

    expect(ctx.state.user).toBeDefined()
    expect(ctx.state.user?.name).toBe(name)
  })
})
