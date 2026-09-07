import { before, describe, it } from 'node:test'
import { expect } from '@std/expect'
import getRoot from '../../utils/root.ts'
import getUserLink from './link.ts'

describe('getUserLink', () => {
  let root: string
  const id = crypto.randomUUID()
  const name = 'John Doe'
  const username = 'john'

  before(() => {
    root = getRoot()
  })

  it('uses username', () => {
    const actual = getUserLink({ id, name, username })
    expect(actual).toBe(`${root}/users/${username}`)
  })

  it('uses ID as a fallback', () => {
    const actual = getUserLink({ id, name, username: null })
    expect(actual).toBe(`${root}/users/${id}`)
  })
})
