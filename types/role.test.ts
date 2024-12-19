import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { ROLES, isRole } from './role.ts'

describe('isRole', () => {
  it('returns false if given anything other than a string', () => {
    const primitives = [() => {}, null, undefined, true, false, 1]
    for (const primitive of primitives) {
      expect(isRole(primitive)).toBe(false)
    }
  })

  it('returns false if given a random string', () => {
    expect(isRole('test')).toBe(false)
  })

  it('returns true if given a random a role', () => {
    const roles: string[] = Object.values(ROLES) as string[]
    for (const role of roles) {
      expect(isRole(role)).toBe(true)
    }
  })
})
