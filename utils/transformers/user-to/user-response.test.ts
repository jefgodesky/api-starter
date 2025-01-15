import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import UserAttributes, { type UserAttributesKeys, allUserAttributes } from '../../../types/user-attributes.ts'
import type User from '../../../types/user.ts'
import type UserResource from '../../../types/user-resource.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import userToUserResponse from './user-response.ts'

describe('userToUserResponse', () => {
  const attributes: UserAttributes = {
    name: 'John Doe',
    username: 'john',
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: attributes.name!,
    username: attributes.username
  }

  it('generates a Response', () => {
    const actual = userToUserResponse(user)
    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self: `http://localhost:8001/v1/users/${user.id}`,
        describedBy: 'http://localhost:8001/v1/docs'
      },
      data: {
        type: 'users',
        id: user.id,
        attributes: {
          name: user.name,
          username: user.username
        }
      }
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = Object.keys(object) as UserAttributesKeys[]
      const excluded = allUserAttributes.filter(attr => !fields.includes(attr))
      const res = userToUserResponse(user, fields)
      const attributes = (res.data as UserResource).attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.length)
      for (const field of fields) expect(attributes[field]).toBe(user[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })
})
