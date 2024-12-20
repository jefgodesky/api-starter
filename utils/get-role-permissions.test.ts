import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { ROLES } from '../types/role.ts'
import getRolePermissions from './get-role-permissions.ts'

describe('getRolePermissions', () => {
  it('returns anonymous permissions if given no parameter', async () => {
    const actual = await getRolePermissions()
    expect(Array.isArray(actual)).toBe(true)
    expect(actual.length).toBeGreaterThan(0)
  })

  it('returns the permissions associated with a given role', async () => {
    const actual = await getRolePermissions(ROLES.ACTIVE)
    expect(Array.isArray(actual)).toBe(true)
    expect(actual.length).toBeGreaterThan(0)
  })
})
