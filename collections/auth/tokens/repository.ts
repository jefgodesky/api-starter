import { verify } from '@stdext/crypto/hash'
import Repository from '../../base/repository.ts'
import AuthToken from './model.ts'

export default class AuthTokenRepository extends Repository<AuthToken> {
  constructor () {
    super('tokens')
  }

  async exchange (token: AuthToken): Promise<AuthToken | null> {
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
      expires: new Date(Date.now() + (10 * 60 * 1000))
    })
  }
}
