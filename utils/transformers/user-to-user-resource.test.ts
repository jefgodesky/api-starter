import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import type { UserAttributesKeys}  from '../../types/user-attributes.ts'
import userToUserResource from './user-to-user-resource.ts'

describe('userToUserResource', () => {
  const user: User = {
    id: crypto.randomUUID(),
    name: 'John Doe',
    username: 'john'
  }

  const fieldsets: [UserAttributesKeys[], UserAttributesKeys[], string[]][] = [
    [['name'], ['username'], [user.name]],
    [['username'], ['name'], [user.username ?? '']],
    [['name', 'username'], [], [user.name, user.username ?? '']]
  ]

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
    for (const [included, excluded, expected] of fieldsets) {
      const actual = userToUserResource(user, included)
      expect(actual.type).toBe('users')
      expect(actual.id).toBe(user.id)
      expect(Object.keys(actual.attributes)).toHaveLength(included.length)
      for (let i = 0; i < included.length; i++) expect(actual.attributes[included[i]]).toBe(expected[i])
      for (const ex of excluded) expect(actual.attributes[ex]).not.toBeDefined()
    }
  })
})
