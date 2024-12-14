import type Model from './model.ts'
import type User from './user.ts'

export default interface AuthToken extends Model {
  id?: string
  user: User
  refresh: string
  expiration: {
    token: Date
    refresh: Date
  }
}
