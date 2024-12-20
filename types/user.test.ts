import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { isUser } from './user.ts'

describe('isUser', () => {
  const id = crypto.randomUUID()
  const name = 'John Doe'
  const username = 'john'
  const roles = ['active', 'listed']

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 'test', 1]
    for (const primitive of primitives) {
      expect(isUser(primitive)).toBe(false)
    }
  })

  it('returns false if given an empty object', () => {
    expect(isUser({})).toBe(false)
  })

  it('returns true if given a valid User', () => {
    expect(isUser({ name })).toBe(true)
    expect(isUser({ id, name })).toBe(true)
    expect(isUser({ name, username })).toBe(true)
    expect(isUser({ name, roles })).toBe(true)
    expect(isUser({ id, name, username })).toBe(true)
    expect(isUser({ id, name, roles })).toBe(true)
    expect(isUser({ name, username, roles })).toBe(true)
    expect(isUser({ id, name, username, roles })).toBe(true)
  })

  it('returns false if given additional properties', () => {
    expect(isUser({ name, other: 'nope' })).toBe(false)
  })
})
