import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import getQueryString from './query-string.ts'

export const getParams = (): URLSearchParams => {
  const params = new URLSearchParams()
  params.set('a', '1')
  params.set('b', '2')
  return params
}

describe('getQueryString', () => {
  it('returns the query string', () => {
    const actual = getQueryString(getParams())
    expect(actual).toBe('a=1&b=2')
  })

  it('does not encode', () => {
    const params = new URLSearchParams()
    params.set('page[offset]', '0')
    params.set('page[limit]', '10')

    const actual = getQueryString(params)
    expect(actual).toBe('page[offset]=0&page[limit]=10')
  })
})
