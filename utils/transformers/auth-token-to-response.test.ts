import { describe, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import DB from '../../DB.ts'
import AuthTokenResource from '../../types/auth-token-resource.ts'
import authTokenToResponse from './auth-token-to-response.ts'
import AuthToken from '../../types/auth-token.ts'
import setupUser from '../testing/setup-user.ts'

describe('authTokenToResponse', () => {
  let token: AuthToken

  beforeEach(async () => {
    const data = await setupUser()
    token = data.token as AuthToken
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  it('generates a Response', async () => {
    const actual = await authTokenToResponse(token!)
    const data = actual.data as AuthTokenResource

    const expectedData: AuthTokenResource = {
      type: 'token',
      id: token?.id ?? '',
      attributes: {
        token: data.attributes.token,
        expiration: token.expiration.token.toString()
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
