import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import localizeDocs from './localize-docs.ts'

describe('localizeDocs', () => {
  const docUsers = localizeDocs('users')

  it('returns the specified documentation', () => {
    const msg = docUsers('get', 200)
    expect(msg).toBe('Retrieves an individual user.\n')
  })

  it('returns the key if the status doesn’t exist', () => {
    const msg = docUsers('get', 999)
    expect(msg).toBe('docs.users.get.999')
  })

  it('returns the key if the route doesn’t exist', () => {
    const msg = docUsers('nope', 200)
    expect(msg).toBe('docs.users.nope.200')
  })
})
