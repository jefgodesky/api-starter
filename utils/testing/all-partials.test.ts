import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import getAllPartials from './all-partials.ts'

describe('getAllPartials', () => {
  it('returns all possible partials of an object', () => {
    const full = { a: 1, b: 2 }
    expect(getAllPartials(full)).toEqual([
      {},
      { a: 1 },
      { b: 2 },
      full,
    ])
  })
})
