import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { isUserAttributes } from './user-attributes.ts'

describe('isUserAttributes', () => {
  const name = 'John Doe'
  const username = 'johnny'

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isUserAttributes(primitive)).toBe(false)
    }
  })

  it('returns true if given a UserAttributes object', () => {
    expect(isUserAttributes({})).toBe(true)
    expect(isUserAttributes({ name })).toBe(true)
    expect(isUserAttributes({ username })).toBe(true)
    expect(isUserAttributes({ name, username })).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isUserAttributes({ name, username, other: true })).toBe(false)
  })
})
