import Links, { isLinks } from './links.ts'
import UserResource, { isUserResource } from './user-resource.ts'
import isObject from '../utils/guards/object.ts'

export default interface UserRelationship {
  links?: Links
  data: UserResource | UserResource[]
}

const isUserRelationship = (candidate: unknown): candidate is UserRelationship => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (obj.links !== undefined && !isLinks(obj.links)) return false

  const isSingular = isUserResource(obj.data)
  const isPlural = Array.isArray(obj.data) && obj.data.every(item => isUserResource(item))
  if (!isSingular && !isPlural) return false

  const permitted = ['links', 'data']
  return Object.keys(obj).every(key => permitted.includes(key))
}

export { isUserRelationship }
