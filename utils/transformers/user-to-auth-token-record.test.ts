import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import userToAuthTokenRecord from './user-to-auth-token-record.ts'

describe('userToAuthTokenRecord', () => {
  it('creates an AuthTokenRecord', () => {
    const user: User = { id: crypto.randomUUID(), name: 'John Doe' }
    const actual = userToAuthTokenRecord(user)
    expect(actual.uid).toBe(user.id)
    expect(actual.refresh).toBeDefined()
    expect(actual.token_expiration).toBeInstanceOf(Date)
    expect(actual.refresh_expiration).toBeInstanceOf(Date)
  })
})
