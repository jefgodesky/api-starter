import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import hashRefreshToken from './hash.ts'

describe('hashRefreshToken', () => {
  const orig = 'Hello, world!'

  it('hashes the string', async () => {
    expect(await hashRefreshToken(orig)).toMatch(/^[0-9a-f]{64}$/)
  })

  it('always hashes to the same value', async () => {
    const a = await hashRefreshToken(orig)
    const b = await hashRefreshToken(orig)
    expect(a).toBe(b)
  })

  it('never returns the input', async () => {
    expect(await hashRefreshToken(orig)).not.toBe(orig)
  })
})
