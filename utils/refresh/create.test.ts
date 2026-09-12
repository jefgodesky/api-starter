import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import createRefreshToken from './create.ts'

describe('createRefreshToken', () => {
  it('returns a token that is at least 32 characters long', () => {
    expect(createRefreshToken()).toMatch(/^[0-9a-f]{32,}$/)
  })

  it('does not repeat', () => {
    const tokens = new Set(Array.from({ length: 100 }, createRefreshToken))
    expect(tokens.size).toBe(100)
  })
})
