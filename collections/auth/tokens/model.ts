import Model from '../../base/model.ts'
import User from '../../users/model.ts'

export interface AuthTokenRecord extends Model {
  id?: string
  uid: string
  refresh: string
  token_expiration: Date
  refresh_expiration: Date
}

export default interface AuthToken extends Model {
  user: User
  refresh: string
  expiration: {
    token: Date
    refresh: Date
  }
}
