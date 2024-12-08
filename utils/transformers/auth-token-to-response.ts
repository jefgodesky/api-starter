import { signJWT } from '@cross/jwt'
import AuthToken from '../../collections/auth/tokens/model.ts'
import { Response } from '../../jsonapi.d.ts'
import AuthTokenResource from '../../types/auth-token-resource.ts'
import getJSONAPI from '../get-jsonapi.ts'
import getRoot from '../get-root.ts'

const authTokenToResponse = async (token: AuthToken): Promise<Response> => {
  const secret = Deno.env.get('JWT_SECRET') ?? ''
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

export default authTokenToResponse
