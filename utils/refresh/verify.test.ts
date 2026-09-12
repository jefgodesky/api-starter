import { beforeEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import createRefreshToken from './create.ts'
import hashRefreshToken from './hash.ts'
import verifyRefreshToken from './verify.ts'

describe('verifyRefreshToken', () => {
  let token: string
  let hashed: string

  beforeEach(async () => {
    token = createRefreshToken()
    hashed = await hashRefreshToken(token)
  })

  it('accepts a valid token', async () => {
    expect(await verifyRefreshToken(token, hashed)).toBe(true)
  })

  it('rejects an invalid token', async () => {
    expect(await verifyRefreshToken(token + '1', hashed)).toBe(false)
  })

  it('rejects a bad hash', async () => {
    expect(await verifyRefreshToken(token, 'nope')).toBe(false)
  })
})
