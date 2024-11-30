import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import User from './model.ts'
import {
  type UserAttributesKeys,
  makeUserLink,
  makeUserAttributes,
  makeUserResource,
  makeUserResponse,
  makeUserPageResponse,
  isUserCreation,
  getUserFields
} from './resource.ts'

describe('UserResource methods', () => {
  const user: User = {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'John Doe',
    username: 'john'
  }

  const unsaved: User = {
    name: 'John Doe',
    username: 'john'
  }

  const fieldsets: [UserAttributesKeys[], UserAttributesKeys[], string[]][] = [
    [['name'], ['username'], [user.name]],
    [['username'], ['name'], [user.username ?? '']],
    [['name', 'username'], [], [user.name, user.username ?? '']]
  ]

  describe('makeUserLink', () => {
    it('returns a link to a UserResource', () => {
      const expected = 'http://localhost:8001/v1/users/11111111-1111-1111-1111-111111111111'
      expect(makeUserLink(user)).toBe(expected)
    })

    it('returns a link to the Users collection if user has no ID', () => {
      const expected = 'http://localhost:8001/v1/users'
      expect(makeUserLink(unsaved)).toBe(expected)
    })
  })

  describe('makeUserAttributes', () => {
    it('returns a UserAttributes object', () => {
      const actual = makeUserAttributes(user)
      expect(Object.keys(actual)).toHaveLength(2)
      expect(actual.name).toBe(user.name)
      expect(actual.username).toBe(user.username)
    })

    it('can return a sparse fieldset', () => {
      for (const [included, excluded, expected] of fieldsets) {
        const actual = makeUserAttributes(user, included)
        expect(Object.keys(actual)).toHaveLength(included.length)
        for (let i = 0; i < included.length; i++) expect(actual[included[i]]).toBe(expected[i])
        for (const ex of excluded) expect(actual[ex]).not.toBeDefined()
      }
    })
  })

  describe('makeUserResource', () => {
    it('returns a UserResource object', () => {
      const actual = makeUserResource(user)
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
        const actual = makeUserResource(user, included)
        expect(actual.type).toBe('users')
        expect(actual.id).toBe(user.id)
        expect(Object.keys(actual.attributes)).toHaveLength(included.length)
        for (let i = 0; i < included.length; i++) expect(actual.attributes[included[i]]).toBe(expected[i])
        for (const ex of excluded) expect(actual.attributes[ex]).not.toBeDefined()
      }
    })
  })

  describe('makeUserResponse', () => {
    it('generates a Response', () => {
      const actual = makeUserResponse(user)
      const expected = {
        jsonapi: { version: '1.1' },
        links: {
          self: 'http://localhost:8001/v1/users/11111111-1111-1111-1111-111111111111'
        },
        data: [
          {
            type: 'users',
            id: user.id,
            attributes: {
              name: user.name,
              username: user.username
            }
          }
        ]
      }
      expect(actual).toEqual(expected)
    })

      it('can return a sparse fieldset', () => {
      const withName = makeUserResponse(user, ['name'])
      const withUsername = makeUserResponse(user, ['username'])
      expect(withName.data[0].attributes?.name).toBe(user.name)
      expect(withName.data[0].attributes?.username).not.toBeDefined()
      expect(withUsername.data[0].attributes?.name).not.toBeDefined()
      expect(withUsername.data[0].attributes?.username).toBe(user.username)
    })
  })

  describe('makeUserPageResponse', () => {
    it('generates a paginated Response', () => {
      const actual = makeUserPageResponse([user], 2, 0, 1)
      const expected = {
        jsonapi: { version: '1.1' },
        links: {
          self: 'http://localhost:8001/v1/users',
          first: 'http://localhost:8001/v1/users?offset=0&limit=1',
          prev: 'http://localhost:8001/v1/users?offset=0&limit=1',
          next: 'http://localhost:8001/v1/users?offset=1&limit=1',
          last: 'http://localhost:8001/v1/users?offset=1&limit=1',
        },
        data: [
          {
            type: 'users',
            id: user.id,
            attributes: {
              name: user.name,
              username: user.username
            }
          }
        ]
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('isUserCreation', () => {
    it('returns false if given a primitive', () => {
      const primitives = [() => {}, null, undefined, true, false, 1, 'true']
      for (const primitive of primitives) {
        expect(isUserCreation(primitive)).toBe(false)
      }
    })

    it('returns false if given an object that is not a UserCreation', () => {
      expect(isUserCreation({ a: 1 })).toBe(false)
    })

    it('returns true if given an object that is a UserCreation', () => {
      expect(isUserCreation({
        data: {
          type: 'users',
          attributes: {
            name: 'John Doe',
            username: 'john'
          }
        }
      })).toBe(true)
    })
  })

  describe('getUserFields', () => {
    it('returns undefined when no fields are specified', () => {
      const url = new URL('http://localhost:8001/v1/users')
      expect(getUserFields(url)).not.toBeDefined()
    })

    it('returns the fields specified', () => {
      const scenarios = [
        ['name', ['name']],
        ['username', ['username']],
        ['name,username', ['name', 'username']]
      ]

      for (const [q, arr] of scenarios) {
        const url = new URL(`https://example.com/v1/users?this=1&fields[users]=${q}&that=2`)
        const actual = getUserFields(url)
        expect(actual).toEqual(arr)
      }
    })
  })
})
