import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../../types/user.ts'
import { type UserAttributesKeys, allUserAttributes, createUserAttributes } from '../../../types/user-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import userToUserAttributes from './user-attributes.ts'

describe('userToUserAttributes', () => {
  const attributes = createUserAttributes()
  const user = createUser({ ...attributes })

  it('returns a UserAttributes object', () => {
    const actual = userToUserAttributes(user)
    expect(Object.keys(actual)).toHaveLength(2)
    expect(actual.name).toBe(user.name)
    expect(actual.username).toBe(user.username)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = Object.keys(object) as UserAttributesKeys[]
      const excluded = allUserAttributes.filter(attr => !fields.includes(attr))
      const actual = userToUserAttributes(user, fields)

      expect(Object.keys(actual)).toHaveLength(fields.length)
      for (const field of fields) expect(actual[field]).toBe(user[field])
      for (const ex of excluded) expect(actual[ex]).not.toBeDefined()
    }
  })
})
