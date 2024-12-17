import * as uuid from '@std/uuid'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import Repository from '../base/repository.ts'

export default class UserRepository extends Repository<User> {
  constructor () {
    super('users')
  }

  override async get (id: string): Promise<User | null> {
    if (!uuid.v4.validate(id)) return null
    const query = `SELECT * FROM users WHERE id = $1 AND active = true`
    return await DB.get(query, [id])
  }

  override async list (limit?: number, offset?: number): Promise<{ total: number, rows: User[] }> {
    return await DB.list<User>(this.tableName, { offset, limit, where: 'active = true' })
  }

  async getByUsername (username: string): Promise<User | null> {
    if (username.length > 255) return null
    const query = 'SELECT * FROM users WHERE username = $1'
    return await DB.get(query, [username])
  }

  async deactivate (id: string): Promise<true | false> {
    return await this.setActive(id, false)
  }

  async activate (id: string): Promise<true | false> {
    return await this.setActive(id, true)
  }

  private async setActive (id: string, value: boolean = false): Promise<true | false> {
    if (!uuid.v4.validate(id)) return false
    const res = await DB.query(`UPDATE users SET active = ${value} WHERE id = $1`, [id])
    return res.warnings.length === 0
  }
}
