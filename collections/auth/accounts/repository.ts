import * as uuid from '@std/uuid'
import { type Provider, PROVIDERS } from '../../../enums.ts'
import DB from '../../../DB.ts'
import Repository from '../../base/repository.ts'
import Account from './model.ts'

export default class AccountRepository extends Repository<Account> {
  constructor () {
    super('accounts')
  }

  override async save (record: Account): Promise<Account> {
    const check = await this.getAccount(record.uid, record.provider)
    if (check) return check
    return await this.create(record)
  }

  async getAccount (uid: string, provider: Provider): Promise<Account | null> {
    const client = await DB.getClient()
    if (!uuid.v4.validate(uid)) return null
    if (!Object.values(PROVIDERS).includes(provider)) return null
    const query = `SELECT * FROM accounts WHERE uid = $1 AND provider = $2`
    const result = await client.queryObject<Account>(query, [uid, provider])
    return result.rows.length ? result.rows[0] : null
  }
}
