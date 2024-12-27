import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type User from '../types/user.ts'
import isSelf from './is-self.ts'

describe('isSelf', () => {
  const john: User = { id: crypto.randomUUID(), name: 'Jonn Doe' }
  const jane: User = { id: crypto.randomUUID(), name: 'Jane Doe' }

  it('returns false if context doesn\'t have client or user', () => {
    expect(isSelf(createMockContext())).toBe(false)
  })

  it('returns false if context doesn\'t have client', () => {
    const ctx = createMockContext({ state: { user: john } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if context client has no ID', () => {
    const ctx = createMockContext({ state: { client: { name: john.name }, user: john } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if context doesn\'t have user', () => {
    const ctx = createMockContext({ state: { client: john } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if context user has no ID', () => {
    const ctx = createMockContext({ state: { client: john, user: { name: john.name } } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if user and client are different', () => {
    const ctx = createMockContext({ state: { client: john, user: jane } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns true if user and client are the same', () => {
    const ctx = createMockContext({ state: { client: john, user: john } })
    expect(isSelf(ctx)).toBe(true)
  })
})
