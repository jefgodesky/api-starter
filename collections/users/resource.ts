import { intersect } from '@std/collections'
import { BaseResource, Response } from '../../jsonapi.d.ts'
import type User from './model.ts'
import getRoot from '../../utils/get-root.ts'
import getJSONAPI from '../../utils/get-jsonapi.ts'

export interface UserAttributes {
  name?: string
  username?: string
}

export interface UserResource extends BaseResource {
  attributes: UserAttributes
}

const allUserAttributes = ['name', 'username'] as const
type UserAttributesKeys = (typeof allUserAttributes)[number]

const makeUserLink = (user: User): string => {
  const endpoint = user.id ? `/users/${user.id}` : '/users'
  return getRoot() + endpoint
}

const makeUserAttributes = (user: User, fields: readonly UserAttributesKeys[] = allUserAttributes): UserAttributes => {
  fields = intersect(fields, allUserAttributes)
  const attributes: UserAttributes = {}
  for (const field of fields) attributes[field] = user[field]
  return attributes
}

const makeUserResponse = (user: User, fields: readonly UserAttributesKeys[] = allUserAttributes): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: makeUserLink(user)
    },
    data: [
      {
        type: 'users',
        id: user.id ?? 'ERROR',
        attributes: makeUserAttributes(user, fields)
      }
    ]
  }
}

export {
  type UserAttributesKeys,
  allUserAttributes,
  makeUserLink,
  makeUserAttributes,
  makeUserResponse
}
