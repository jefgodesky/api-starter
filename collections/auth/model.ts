import { type Provider } from '../../enums.ts'
import Model from '../base/model.ts'

export default interface Account extends Model {
  id?: string
  uid: string
  provider: Provider
  pid: string
}
