import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { usersType } from './schema.ts'
import getRoot from '../../utils/root.ts'
import getUserLink from './link.ts'

describe('getUserLink', () => {
  const id = crypto.randomUUID()
  const name = 'John Doe'
  const username = 'john'

  it('uses username', () => {
    const actual = getUserLink({ id, name, username })
    expect(actual).toBe([getRoot(), usersType, username].join('/'))
  })

  it('uses ID as a fallback', () => {
    const actual = getUserLink({ id, name, username: null })
    expect(actual).toBe([getRoot(), usersType, id].join('/'))
  })
})
