import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { ROLES } from '../types/role.ts'
import getRolePermissions from './get-role-permissions.ts'
import getPermissions from './get-permissions.ts'

describe('getPermissions', () => {
  it('returns the permissions that a user has', async() => {
    const actual = await getPermissions({
      id: crypto.randomUUID(),
      name: 'John Doe',
      roles: [ROLES.ACTIVE, ROLES.ADMIN]
    })

    const active = await getRolePermissions(ROLES.ACTIVE)
    const admin = await getRolePermissions(ROLES.ADMIN)

    expect(active.every(p => actual.includes(p))).toBe(true)
    expect(admin.every(p => actual.includes(p))).toBe(true)
    expect(new Set(actual).size).toBe(actual.length) // No duplicates
  })
})
