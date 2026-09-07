import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import parseFields from './fields.ts'

describe('parseFields', () => {
  const base = 'https://example.com/index.html'

  it('returns nothing if not set', () => {
    const url = new URL(base)
    expect(parseFields(url)).toEqual({})
  })

  it('returns the fields set', () => {
    const url = new URL(`${base}?fields[articles]=title,body`)
    expect(parseFields(url)).toEqual({ articles: ['title', 'body'] })
  })

  it('returns an empty array if set to nothing', () => {
    const url = new URL(`${base}?fields[articles]=`)
    expect(parseFields(url)).toEqual({ articles: [] })
  })
})
