import { before, describe, it } from 'node:test'
import { expect } from '@std/expect'
import getRoot from './root.ts'
import getQueryString from './query-string.ts'
import { getParams } from './query-string.test.ts'
import getPaginationLinks, { getURL } from './paginate.ts'

describe('getURL', () => {
  const base = 'http://localhost:8080/test'

  it('returns the URL with offset and limit params', () => {
    const actual = getURL(base, new URLSearchParams(), 0, 10)
    expect(actual).toBe(`${base}?page[offset]=0&page[limit]=10`)
  })

  it('preserves existing query params', () => {
    const params = getParams()
    const actual = getURL(base, params, 0, 10)
    const pre = `${base}?${getQueryString(params)}`
    expect(actual).toBe(`${pre}&page[offset]=0&page[limit]=10`)
  })
})

describe('getPaginationLinks', () => {
  let base: string
  const empty = new URLSearchParams()

  before(() => {
    base = getRoot() + '/test'
  })

  it('handles first page', () => {
    const page = { offset: 0, limit: 10, total: 100 }
    const { first, last, prev, next } = getPaginationLinks(base, empty, page)
    expect(first).toBe(`${base}?page[offset]=0&page[limit]=10`)
    expect(last).toBe(`${base}?page[offset]=90&page[limit]=10`)
    expect(prev).toBeNull()
    expect(next).toBe(`${base}?page[offset]=10&page[limit]=10`)
  })

  it('handles a page in the middle', () => {
    const page = { offset: 30, limit: 10, total: 100 }
    const { first, last, prev, next } = getPaginationLinks(base, empty, page)
    expect(first).toBe(`${base}?page[offset]=0&page[limit]=10`)
    expect(last).toBe(`${base}?page[offset]=90&page[limit]=10`)
    expect(prev).toBe(`${base}?page[offset]=20&page[limit]=10`)
    expect(next).toBe(`${base}?page[offset]=40&page[limit]=10`)
  })

  it('handles last page', () => {
    const page = { offset: 90, limit: 10, total: 100 }
    const { first, last, prev, next } = getPaginationLinks(base, empty, page)
    expect(first).toBe(`${base}?page[offset]=0&page[limit]=10`)
    expect(last).toBe(`${base}?page[offset]=90&page[limit]=10`)
    expect(prev).toBe(`${base}?page[offset]=80&page[limit]=10`)
    expect(next).toBeNull()
  })

  it('handles a single page', () => {
    const page = { offset: 0, limit: 10, total: 5 }
    const { first, last, prev, next } = getPaginationLinks(base, empty, page)
    expect(first).toBe(`${base}?page[offset]=0&page[limit]=10`)
    expect(last).toBe(`${base}?page[offset]=0&page[limit]=10`)
    expect(prev).toBeNull()
    expect(next).toBeNull()
  })

  it('handles zero results', () => {
    const page = { offset: 0, limit: 10, total: 0 }
    const { first, last, prev, next } = getPaginationLinks(base, empty, page)
    expect(first).toBe(`${base}?page[offset]=0&page[limit]=10`)
    expect(last).toBe(`${base}?page[offset]=0&page[limit]=10`)
    expect(prev).toBeNull()
    expect(next).toBeNull()
  })

  it('preserves other query params', () => {
    const other = getParams()
    const expected = getQueryString(other)

    const page = { offset: 10, limit: 10, total: 100 }
    const { first, last, prev, next } = getPaginationLinks(base, other, page)

    for (const link of [first, last, prev, next]) {
      expect(link).toContain(expected)
    }
  })
})
