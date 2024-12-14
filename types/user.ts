import type Model from './model.ts'

export default interface User extends Model {
  name: string
  username?: string
}
