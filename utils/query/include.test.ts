import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import parseInclude from './include.ts'

describe('parseInclude', () => {
  const base = 'https://example.com/index.html'

  it('returns undefined if not set', () => {
    const url = new URL(base)
    expect(parseInclude(url)).toBe(undefined)
  })

  it('returns the include setting', () => {
    const url = new URL(`${base}?include=date,comments.author`)
    expect(parseInclude(url)).toEqual(['date', 'comments.author'])
  })

  it('returns an empty array if set to nothing', () => {
    const url = new URL(`${base}?include=`)
    expect(parseInclude(url)).toEqual([])
  })
})
