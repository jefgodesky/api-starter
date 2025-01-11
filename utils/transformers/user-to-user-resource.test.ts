import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import UserAttributes, { type UserAttributesKeys, allUserAttributes }  from '../../types/user-attributes.ts'
import getAllFieldCombinations from '../testing/get-all-field-combinations.ts'
import userToUserResource from './user-to-user-resource.ts'

describe('userToUserResource', () => {
  const attributes: UserAttributes = {
    name: 'John Doe',
    username: 'john',
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: attributes.name!,
    username: attributes.username
  }

  it('returns a UserResource object', () => {
    const actual = userToUserResource(user)
    const expected = {
      type: 'users',
      id: user.id,
      attributes: {
        name: user.name,
        username: user.username
      }
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = Object.keys(object) as UserAttributesKeys[]
      const excluded = allUserAttributes.filter(attr => !fields.includes(attr))
      const actual = userToUserResource(user, fields)

      expect(Object.keys(actual.attributes)).toHaveLength(fields.length)
      for (const field of fields) expect(actual.attributes[field]).toBe(user[field])
      for (const ex of excluded) expect(actual.attributes[ex]).not.toBeDefined()
    }
  })
})
