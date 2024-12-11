import AuthToken, { AuthTokenRecord } from '../../collections/auth/tokens/model.ts'

const authTokenToAuthTokenRecord = (token: AuthToken): AuthTokenRecord => {
  const record: AuthTokenRecord = {
    uid: token.user.id ?? '',
    refresh: token.refresh,
    token_expiration: token.expiration.token,
    refresh_expiration: token.expiration.refresh
  }

  if (token.id) record.id = token.id
  return record
}

export default authTokenToAuthTokenRecord
