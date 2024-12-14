import type Model from './model.ts'

export default interface AuthTokenRecord extends Model {
  id?: string
  uid: string
  refresh: string
  token_expiration: Date
  refresh_expiration: Date
}
