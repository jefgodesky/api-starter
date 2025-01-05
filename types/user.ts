import type Model from './model.ts'
import isStringOrUndefined from '../utils/guards/string.ts'

export default interface User extends Model {
  name: string
  username?: string
  roles?: string[]
}

// deno-lint-ignore no-explicit-any
const isUser = (candidate: any): candidate is User => {
  if (typeof candidate !== 'object') return false
  if (typeof candidate?.name !== 'string') return false

  const permitted = ['id', 'name', 'username', 'roles']
  if (!Object.keys(candidate).every(key => permitted.includes(key))) return false
  if (!isStringOrUndefined(candidate.username)) return false

  const noRoles = candidate.roles === undefined
  // deno-lint-ignore no-explicit-any
  const allRoles = Array.isArray(candidate.roles) && candidate.roles.every((role: any) => typeof role === 'string')
  return noRoles || allRoles
}

export { isUser }
