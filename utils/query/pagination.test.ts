import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import parsePagination, {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from './pagination.ts'

describe('parsePagination', () => {
  const base = 'https://example.com/index.html'

  it('returns defaults if not set', () => {
    const { offset, limit } = parsePagination(new URL(base))
    expect(offset).toBe(0)
    expect(limit).toBe(DEFAULT_PAGE_SIZE)
  })

  it('returns the pagination settings', () => {
    const url = new URL(`${base}?page[offset]=1&page[limit]=2`)
    const { offset, limit } = parsePagination(url)
    expect(offset).toBe(1)
    expect(limit).toBe(2)
  })

  it('won’t set limit beyond maximum', () => {
    const tooMuch = MAX_PAGE_SIZE + 1
    const url = new URL(`${base}?page[offset]=1&page[limit]=${tooMuch}`)
    const { offset, limit } = parsePagination(url)
    expect(offset).toBe(1)
    expect(limit).toBe(MAX_PAGE_SIZE)
  })

  it('returns defaults if set to nothing', () => {
    const url = new URL(`${base}?page[offset=&page[limit]=`)
    const { offset, limit } = parsePagination(url)
    expect(offset).toBe(0)
    expect(limit).toBe(DEFAULT_PAGE_SIZE)
  })
})
