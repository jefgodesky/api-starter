import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import { type UserAttributesKeys } from '../../types/user-attributes.ts'
import userToUserAttributes from './user-to-user-attributes.ts'

describe('userToUserAttributes', () => {
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

  it('returns a UserAttributes object', () => {
    const actual = userToUserAttributes(user)
    expect(Object.keys(actual)).toHaveLength(2)
    expect(actual.name).toBe(user.name)
    expect(actual.username).toBe(user.username)
  })

  it('can return a sparse fieldset', () => {
    for (const [included, excluded, expected] of fieldsets) {
      const actual = userToUserAttributes(user, included)
      expect(Object.keys(actual)).toHaveLength(included.length)
      for (let i = 0; i < included.length; i++) expect(actual[included[i]]).toBe(expected[i])
      for (const ex of excluded) expect(actual[ex]).not.toBeDefined()
    }
  })
})
