import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'

export default interface UserAttributes {
  name?: string
  username?: string
}

const allUserAttributes = ['name', 'username'] as const
const publicUserAttributes = ['name', 'username'] as const
type UserAttributesKeys = (typeof allUserAttributes)[number]

const isUserAttributes = (candidate: any): candidate is UserAttributes => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  const strings = ['name', 'username']
  if (!Object.keys(obj).every(key => strings.includes(key))) return false
  return strings.every(key => isStringOrUndefined(obj[key]))
}

export {
  isUserAttributes,
  allUserAttributes,
  publicUserAttributes,
  type UserAttributesKeys
}
