import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import bytesToHex from './hex.ts'

describe('bytesToHex', () => {
  it('returns a hexadecimal string', () => {
    const valid = '0123456789abcdef'.split('')
    const chars = bytesToHex(new Uint8Array(32)).split('')
    for (const char of chars) {
      expect(valid).toContain(char)
    }
  })
})
