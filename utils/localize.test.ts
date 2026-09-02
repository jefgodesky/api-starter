import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import localize from './localize.ts'

describe('localize', () => {
  it('returns the requested message', () => {
    const msg = localize('authentication_required')
    expect(msg).toBe('This operation requires authentication.')
  })

  it('returns the key if it doesn’t exist', () => {
    const msg = localize('lol_nope')
    expect(msg).toBe('lol_nope')
  })
})
