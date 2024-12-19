import type Model from './model.ts'
import type Role from './role.ts'

export default interface User extends Model {
  name: string
  username?: string
  roles?: Role[]
}
