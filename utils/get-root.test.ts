import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRoot from './get-root.ts'

describe('getRoot', () => {
  it('returns the API root', () => {
    const actual = getRoot()
    expect(actual).toBe('http://localhost:8001/v1')
  })
})
