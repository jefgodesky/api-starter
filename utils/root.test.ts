import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import getRoot from './root.ts'

describe('getRoot', () => {
  it('returns the API root', () => {
    const url = new URL(getRoot())
    expect(url).toBeInstanceOf(URL)
  })
})
