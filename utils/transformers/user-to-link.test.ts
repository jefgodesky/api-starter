import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import userToLink from './user-to-link.ts'

describe('userToLink', () => {
  it('returns a link to a UserResource', () => {
    const user: User = {
      id: crypto.randomUUID(),
      name: 'John Doe',
      username: 'john'
    }

    const expected = `http://localhost:8001/v1/users/${user.id}`
    expect(userToLink(user)).toBe(expected)
  })

  it('returns a link to the Users collection if user has no ID', () => {
    const user: User = {
      name: 'John Doe',
      username: 'john'
    }

    const expected = 'http://localhost:8001/v1/users'
    expect(userToLink(user)).toBe(expected)
  })
})
