import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import usersToUserPageResponse from './users-to-user-page-response.ts'

describe('usersToUserPageResponse', () => {
  const user: User = {
    id: crypto.randomUUID(),
    name: 'John Doe',
    username: 'john'
  }

  it('generates a paginated Response', () => {
    const actual = usersToUserPageResponse([user], 2, 0, 1)
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
