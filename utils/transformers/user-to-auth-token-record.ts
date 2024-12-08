import type User from '../../collections/users/model.ts'
import type { AuthTokenRecord } from '../../collections/auth/tokens/model.ts'
import getTokenExpiration from '../get-token-expiration.ts'
import getRefreshExpiration from '../get-refresh-expiration.ts'

const userToAuthTokenRecord = (user: User): AuthTokenRecord => {
  return {
    uid: user.id ?? '',
    refresh: crypto.randomUUID(),
    token_expiration: getTokenExpiration(),
    refresh_expiration: getRefreshExpiration()
  }
}

export default userToAuthTokenRecord

