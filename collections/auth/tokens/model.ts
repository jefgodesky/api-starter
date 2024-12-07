import Model from '../../base/model.ts'

export default interface AuthToken extends Model {
  id?: string
  uid: string
  refresh: string
  expires: Date
}
