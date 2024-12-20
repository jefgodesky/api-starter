import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { ROLES } from '../types/role.ts'
import getRolePermissions from './get-role-permissions.ts'

describe('getRolePermissions', () => {
  it('returns the permissions associated with a given role', async () => {
    const actual = await getRolePermissions(ROLES.ACTIVE)
    expect(Array.isArray(actual)).toBe(true)
    expect(actual.length).toBeGreaterThan(0)
  })
})
