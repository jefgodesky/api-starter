import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type User from '../../types/user.ts'
import checkRoleSelfPermission from './role-self.ts'

describe('checkRoleSelfPermission', () => {
  it('returns false if the client does not have the self version', () => {
    const user: User = { id: crypto.randomUUID(), name: 'John Doe' }
    const ctx = createMockContext({
      state: { permissions: [], user, client: user }
    })
    expect(checkRoleSelfPermission(ctx, 'role:self:test:grant')).toBe(false)
  })

  it('returns false if the permission is granted but there is no client', () => {
    const user: User = { id: crypto.randomUUID(), name: 'John Doe' }
    const ctx = createMockContext({
      state: { permissions: ['role:self:test:grant'], user }
    })
    expect(checkRoleSelfPermission(ctx, 'role:test:grant')).toBe(false)
  })

  it('returns false if the permission is granted but you\'re not the user', () => {
    const user: User = { id: crypto.randomUUID(), name: 'John Doe' }
    const client: User = { id: crypto.randomUUID(), name: 'Jane Doe' }
    const ctx = createMockContext({
      state: { permissions: ['role:self:test:grant'], user, client }
    })
    expect(checkRoleSelfPermission(ctx, 'role:test:grant')).toBe(false)
  })

  it('returns true if the permission is granted and you\'re the user', () => {
    const user: User = { id: crypto.randomUUID(), name: 'John Doe' }
    const ctx = createMockContext({
      state: { permissions: ['role:self:test:grant'], user, client: user }
    })
    expect(checkRoleSelfPermission(ctx, 'role:test:grant')).toBe(true)
  })
})
