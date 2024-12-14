import { verify } from '@stdext/crypto/hash'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import Repository from '../../base/repository.ts'
import getTokenExpiration from '../../../utils/get-token-expiration.ts'
import DB from '../../../DB.ts'

export default class AuthTokenRepository extends Repository<AuthTokenRecord> {
  constructor () {
    super('tokens')
  }

  async exchange (token: AuthTokenRecord): Promise<AuthTokenRecord | null> {
    if (!token.id) return null
    const stored = await this.get(token.id)
    if (!stored) return null

    let verified = false
    try {
      verified = verify('argon2', stored.refresh, token.refresh)
    // deno-lint-ignore no-empty
    } catch {}

    if (!verified) return null
    await this.delete(token.id)

    return await this.create({
      uid: token.uid,
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: token.refresh_expiration
    })
  }

  async listByUserID (uid: string, limit?: number, offset?: number): Promise<{ total: number, rows: AuthTokenRecord[] }> {
    return await DB.list<AuthTokenRecord>(this.tableName, {
      where: 'uid = $1',
      params: [uid],
      limit,
      offset
    })
  }
}
