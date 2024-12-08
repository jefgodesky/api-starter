import AuthToken, { AuthTokenRecord } from './model.ts'
import UserRepository from '../../users/repository.ts'
import { hash } from '@stdext/crypto/hash'
import { signJWT } from '@cross/jwt'
import { Response } from '../../../jsonapi.d.ts'
import getJSONAPI from '../../../utils/get-jsonapi.ts'
import getRoot from '../../../utils/get-root.ts'
import AuthTokenResource from '../../../types/auth-token-resource.ts'

const recordToToken = async (record: AuthTokenRecord): Promise<AuthToken | null> => {
  const users = new UserRepository()
  const user = await users.get(record.uid)
  if (!user) return null

  const refresh = hash('argon2', record.refresh)
  return {
    id: record.id,
    user,
    refresh,
    expiration: {
      token: record.token_expiration,
      refresh: record.refresh_expiration
    }
  }
}

const makeAuthTokenResponse = async (token: AuthToken): Promise<Response> => {
  const secret = Deno.env.get('JWT_SECRET') ?? ''
  console.log(token)
  const jwt = await signJWT({
    ...token,
    sub: token.user.id
  }, secret, { setIat: true })

  const data: AuthTokenResource = {
    type: 'token',
    id: token.id ?? '',
    attributes: {
      token: jwt,
      expiration: token.expiration.token.toString()
    }
  }

  return {
    jsonapi: getJSONAPI(),
    links: {
      self: getRoot() + '/auth/token',
      describedBy: getRoot() + '/docs'
    },
    data
  }
}

export {
  recordToToken,
  makeAuthTokenResponse
}
