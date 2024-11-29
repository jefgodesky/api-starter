import { type Client } from '../../client.ts'
import Repository from '../base/repository.ts'
import User from './model.ts'

export default class UserRepository extends Repository<User> {
  constructor(client: Client) {
    super(client, 'users')
  }

  async getByUsername (username: string): Promise<User | null> {
    if (username.length > 255) return null
    const query = 'SELECT * FROM users WHERE username = $1'
    const result = await this.client.queryObject<User>(query, [username])
    return result.rows.length ? result.rows[0] : null
  }
}
