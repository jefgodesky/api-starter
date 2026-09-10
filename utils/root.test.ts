import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import getRoot, { getUnversionedRoot } from './root.ts'

describe('getRoot', () => {
  it('returns the API root', () => {
    const url = new URL(getRoot())
    expect(url).toBeInstanceOf(URL)
  })
})

describe('getUnversionedRoot', () => {
  it('returns the unversioned API root', () => {
    const url = new URL(getUnversionedRoot())
    expect(url).toBeInstanceOf(URL)
  })
})
