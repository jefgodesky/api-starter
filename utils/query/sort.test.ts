import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import parseSort from './sort.ts'

describe('parseSort', () => {
  const base = 'https://example.com/index.html'

  it('returns an empty array if not set', () => {
    expect(parseSort(new URL(base))).toEqual([])
  })

  it('returns the sort setting', () => {
    const url = new URL(`${base}?sort=age,name`)
    expect(parseSort(url)).toEqual([
      { column: 'age', order: 'asc' },
      { column: 'name', order: 'asc' },
    ])
  })

  it('can capture descending sort', () => {
    const url = new URL(`${base}?sort=-created,title`)
    expect(parseSort(url)).toEqual([
      { column: 'created', order: 'desc' },
      { column: 'title', order: 'asc' },
    ])
  })

  it('returns an empty array if set to nothing', () => {
    const url = new URL(`${base}?sort=`)
    expect(parseSort(url)).toEqual([])
  })
})
