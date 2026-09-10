import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { getAPIVersion } from './version.ts'

describe('getAPIVersion', () => {
  it('returns the major version', () => {
    expect(getAPIVersion('1.2.3')).toBe('v1')
  })
})
