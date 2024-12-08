import { hash } from '@stdext/crypto/hash'
import AuthToken, { type AuthTokenRecord } from '../../collections/auth/tokens/model.ts'
import UserRepository from '../../collections/users/repository.ts'

const authTokenRecordToAuthToken = async (record: AuthTokenRecord): Promise<AuthToken | null> => {
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

export default authTokenRecordToAuthToken
