import type User from '../../types/user.ts'
import type UserResource from '../../types/user-resource.ts'
import { type UserAttributesKeys, publicUserAttributes } from '../../types/user-attributes.ts'
import userToLink from './user-to-link.ts'
import userToUserAttributes from './user-to-user-attributes.ts'

const userToIncludedResource = (user: User, fields: readonly UserAttributesKeys[] = publicUserAttributes): UserResource => {
  return {
    links: {
      self: userToLink(user)
    },
    type: 'users',
    id: user.id ?? 'ERROR',
    attributes: userToUserAttributes(user, fields)
  }
}

export default userToIncludedResource
