import { verify } from '@stdext/crypto/hash'
import Repository from '../../base/repository.ts'
import { AuthTokenRecord } from './model.ts'
import getTokenExpiration from '../../../utils/get-token-expiration.ts'
import DB from '../../../DB.ts'
import getEnvNumber from '../../../utils/get-env-number.ts'

const MAX_PAGE_SIZE = getEnvNumber('MAX_PAGE_SIZE', 100)
const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)

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

  async listByUserID (uid: string, limit: number = DEFAULT_PAGE_SIZE, offset: number = 0): Promise<{ total: number, rows: AuthTokenRecord[] }> {
    const client = await DB.getClient()
    limit = Math.min(limit, MAX_PAGE_SIZE)
    const query = `
      SELECT *, COUNT(*) OVER() AS total
      FROM tokens
      WHERE uid = $1
      LIMIT $2 OFFSET $3
    `
    const result = await client.queryObject<{ total: number } & AuthTokenRecord>(query, [uid, limit, offset])
    const total = Number(result.rows[0]?.total ?? 0)
    // deno-lint-ignore no-unused-vars
    const rows = result.rows.map(({ total, ...row }) => row as unknown as AuthTokenRecord)
    return { total, rows }
  }
}
