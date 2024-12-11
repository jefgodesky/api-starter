import { signJWT } from '@cross/jwt'
import AuthToken from '../../collections/auth/tokens/model.ts'
import getJWTSecret from '../get-jwt-secret.ts'
import getTokenExpiration from '../get-token-expiration.ts'

const authTokenToJWT = async (token: AuthToken): Promise<string> => {
  return await signJWT({
    ...token,
    sub: token.user.id,
    exp: getTokenExpiration().getTime() / 1000
  }, getJWTSecret(), { setIat: true })
}

export default authTokenToJWT
