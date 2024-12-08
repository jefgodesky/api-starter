import AuthToken, { AuthTokenRecord } from './model.ts'
import UserRepository from '../../users/repository.ts'
import { hash } from '@stdext/crypto/hash'

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

export {
  recordToToken
}
