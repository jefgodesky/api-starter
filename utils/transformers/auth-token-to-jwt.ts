import { signJWT } from '@cross/jwt'
import AuthToken from '../../collections/auth/tokens/model.ts'

const authTokenToJWT = async (token: AuthToken): Promise<string> => {
  const secret = Deno.env.get('JWT_SECRET') ?? ''
  return await signJWT({
    ...token,
    sub: token.user.id
  }, secret, { setIat: true })
}

export default authTokenToJWT
