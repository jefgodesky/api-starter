import Model from '../../base/model.ts'

export default interface AuthToken extends Model {
  uid: string
  refresh: string
  token_expiration: Date
  refresh_expiration: Date
}
