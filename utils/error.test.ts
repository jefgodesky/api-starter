import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import localize from './localize.ts'
import { getError } from './error.ts'

describe('getError', () => {
  const key = 'authentication_required'
  const msg = localize(`errors.${key}`)

  it('returns an error object', () => {
    const { status, title } = getError(401, key)
    expect(status).toBe('401')
    expect(title).toBe(msg)
  })
})
