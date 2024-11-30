import DB from '../../DB.ts'
import Repository from '../base/repository.ts'
import User from './model.ts'

export default class UserRepository extends Repository<User> {
  constructor () {
    super('users')
  }

  async getByUsername (username: string): Promise<User | null> {
    const client = await DB.getClient()
    if (username.length > 255) return null
    const query = 'SELECT * FROM users WHERE username = $1'
    const result = await client.queryObject<User>(query, [username])
    return result.rows.length ? result.rows[0] : null
  }
}
