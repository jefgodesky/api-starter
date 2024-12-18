import * as uuid from '@std/uuid'
import { verify } from '@stdext/crypto/hash'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import Repository from '../../base/repository.ts'
import UserRepository from '../../users/repository.ts'
import getTokenExpiration from '../../../utils/get-token-expiration.ts'
import DB from '../../../DB.ts'

export default class AuthTokenRepository extends Repository<AuthTokenRecord> {
  constructor () {
    super('tokens')
  }

  override async get (id: string): Promise<AuthTokenRecord | null> {
    if (!uuid.v4.validate(id)) return null
    const record = await super.get(id)
    if (!record) return null
    const users = new UserRepository()
    const check = await users.get(record.uid)
    return check ? record : null
  }

  override async create (record: AuthTokenRecord): Promise<AuthTokenRecord | null> {
    const check = await DB.get<{ id: string }>('SELECT id FROM users WHERE id = $1 AND active = true', [record.uid])
    if (check === null) return null
    return super.create(record)
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
