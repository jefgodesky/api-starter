import { intersect } from '@std/collections'
import type User from '../../types/user.ts'
import UserAttributes, {
  allUserAttributes,
  publicUserAttributes,
  type UserAttributesKeys
} from '../../types/user-attributes.ts'

const userToUserAttributes = (user: User, fields: readonly UserAttributesKeys[] = publicUserAttributes): UserAttributes => {
  fields = intersect(fields, allUserAttributes)
  const attributes: UserAttributes = {}
  for (const field of fields) attributes[field] = user[field]
  return attributes
}

export default userToUserAttributes
