import type User from '../../collections/users/model.ts'
import getEnvNumber from '../get-env-number.ts'
import { Response } from '../../jsonapi.d.ts'
import getRoot from '../get-root.ts'
import addPaginationLinks from '../add-pagination-links.ts'
import getJSONAPI from '../get-jsonapi.ts'
import { type UserAttributesKeys, publicUserAttributes } from '../../types/user-attributes.ts'
import userToUserResource from './user-to-user-resource.ts'

const usersToUserPageResponse = (
  users: User[],
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10),
  fields: readonly UserAttributesKeys[] = publicUserAttributes
): Response => {
  const self = getRoot() + '/users'
  const links = addPaginationLinks({ self }, self, total, offset, limit)
  const data = users.map(user => userToUserResource(user, fields))
  return {
    jsonapi: getJSONAPI(),
    links,
    data
  }
}

export default usersToUserPageResponse
