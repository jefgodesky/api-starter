import { intersect } from '@std/collections'
import type { Context } from '@oak/oak'
import { Response } from '../../jsonapi.d.ts'
import type UserAttributes from '../../types/user-attributes.ts'
import type UserResource from '../../types/user-resource.ts'
import type User from './model.ts'
import getRoot from '../../utils/get-root.ts'
import getJSONAPI from '../../utils/get-jsonapi.ts'
import addPaginationLinks from '../../utils/add-pagination-links.ts'
import getEnvNumber from '../../utils/get-env-number.ts'

const allUserAttributes = ['name', 'username'] as const
const publicUserAttributes = ['name', 'username'] as const
type UserAttributesKeys = (typeof allUserAttributes)[number]

const makeUserLink = (user: User): string => {
  const endpoint = user.id ? `/users/${user.id}` : '/users'
  return getRoot() + endpoint
}

const makeUserAttributes = (user: User, fields: readonly UserAttributesKeys[] = publicUserAttributes): UserAttributes => {
  fields = intersect(fields, allUserAttributes)
  const attributes: UserAttributes = {}
  for (const field of fields) attributes[field] = user[field]
  return attributes
}

const makeUserResource = (user: User, fields: readonly UserAttributesKeys[] = publicUserAttributes): UserResource => {
  return {
    type: 'users',
    id: user.id ?? 'ERROR',
    attributes: makeUserAttributes(user, fields)
  }
}

const makeUserResponse = (user: User, fields: readonly UserAttributesKeys[] = publicUserAttributes): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: makeUserLink(user)
    },
    data: makeUserResource(user, fields)
  }
}

const makeUserPageResponse = (
  users: User[],
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10),
  fields: readonly UserAttributesKeys[] = publicUserAttributes
): Response => {
  const self = getRoot() + '/users'
  const links = addPaginationLinks({ self }, self, total, offset, limit)
  const data = users.map(user => makeUserResource(user, fields))
  return {
    jsonapi: getJSONAPI(),
    links,
    data
  }
}

const getUserFields = (input: Context | URL): readonly UserAttributesKeys[] | undefined => {
  const url = (input as Context)?.request?.url ?? input
  const fields = url.searchParams.get('fields[users]')

  if (fields) {
    const requested = fields.split(',')
    return intersect(requested, allUserAttributes) as readonly UserAttributesKeys[]
  }

  return undefined
}

export {
  type UserAttributesKeys,
  allUserAttributes,
  makeUserLink,
  makeUserAttributes,
  makeUserResource,
  makeUserResponse,
  makeUserPageResponse,
  getUserFields
}
