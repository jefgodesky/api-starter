import type Provider from '../../../types/provider.ts'
import Model from '../../base/model.ts'

export default interface Account extends Model {
  id?: string
  uid: string
  provider: Provider
  pid: string
}
