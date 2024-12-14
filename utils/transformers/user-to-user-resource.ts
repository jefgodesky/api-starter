import type User from '../../types/user.ts'
import type UserResource from '../../types/user-resource.ts'
import { type UserAttributesKeys, publicUserAttributes } from '../../types/user-attributes.ts'
import userToUserAttributes from './user-to-user-attributes.ts'

const userToUserResource = (user: User, fields: readonly UserAttributesKeys[] = publicUserAttributes): UserResource => {
  return {
    type: 'users',
    id: user.id ?? 'ERROR',
    attributes: userToUserAttributes(user, fields)
  }
}

export default userToUserResource
