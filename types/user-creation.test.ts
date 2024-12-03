import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { isUserCreation } from './user-creation.ts'

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