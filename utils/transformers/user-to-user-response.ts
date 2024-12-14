import type User from '../../types/user.ts'
import type Response from '../../types/response.ts'
import { type UserAttributesKeys, publicUserAttributes } from '../../types/user-attributes.ts'
import getJSONAPI from '../get-jsonapi.ts'
import getRoot from '../get-root.ts'
import userToLink from './user-to-link.ts'
import userToUserResource from './user-to-user-resource.ts'

const userToUserResponse = (user: User, fields: readonly UserAttributesKeys[] = publicUserAttributes): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: userToLink(user),
      describedBy: getRoot() + '/docs'
    },
    data: userToUserResource(user, fields)
  }
}

export default userToUserResponse
