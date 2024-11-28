import Model from '../base/model.ts'

export default interface User extends Model {
  name: string
  key: string
}
