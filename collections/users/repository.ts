import { type Client } from '../../client.ts'
import Repository from '../base/repository.ts'
import User from './model.ts'

export default class UserRepository extends Repository<User> {
  constructor(client: Client) {
    super(client, 'users')
  }
}
