import Model from '../base/model.ts'

export default interface Account extends Model {
  uid: string
  provider: 'google' | 'discord' | 'github' | 'apple'
  pid: string
}
