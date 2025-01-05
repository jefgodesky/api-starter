import type Model from './model.ts'
import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'

export default interface User extends Model {
  name: string
  username?: string
  roles?: string[]
}

const isUser = (candidate: unknown): candidate is User => {
  if (!isObject(candidate)) return false

  const obj = candidate as Record<string, unknown>
  if (typeof obj.name !== 'string') return false

  const permitted = ['id', 'name', 'username', 'roles']
  if (!Object.keys(obj).every(key => permitted.includes(key))) return false
  if (!isStringOrUndefined(obj.username)) return false

  const noRoles = obj.roles === undefined
  const allRoles = Array.isArray(obj.roles) && obj.roles.every(role => isStringOrUndefined(role))
  return noRoles || allRoles
}

export { isUser }
