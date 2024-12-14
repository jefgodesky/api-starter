import type Provider from './provider.ts'
import type Model from './model.ts'

export default interface Account extends Model {
  id?: string
  uid: string
  provider: Provider
  pid: string
}
