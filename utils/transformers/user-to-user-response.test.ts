import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { type UserAttributesKeys } from '../../types/user-attributes.ts'
import type User from '../../types/user.ts'
import type UserResource from '../../types/user-resource.ts'
import userToUserResponse from './user-to-user-response.ts'

describe('userToUserResponse', () => {
  const user: User = {
    id: crypto.randomUUID(),
    name: 'John Doe',
    username: 'john'
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
    const fields = ['name', 'username'] as readonly UserAttributesKeys[]
    for (const field of fields) {
      const res = userToUserResponse(user, [field])
      const data = res.data as UserResource
      for (const f of fields) {
        if (f === field) expect(data.attributes[f]).toBeDefined()
        if (f !== field) expect(data.attributes[f]).toBeUndefined()
      }
    }
  })
})
