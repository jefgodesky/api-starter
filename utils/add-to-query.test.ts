import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import addToQuery from './add-to-query.ts'

describe('addToQuery', () => {
  it('adds a query string to a URL', () => {
    const base = 'http://localhost:8001/v1/tests'
    const actual = addToQuery(base, 'this=1&that=2')
    expect(actual).toBe('http://localhost:8001/v1/tests?this=1&that=2')
  })

  it('appends to an existing querystring', () => {
    const base = 'http://localhost:8001/v1/tests?prev=y'
    const actual = addToQuery(base, 'this=1&that=2')
    expect(actual).toBe('http://localhost:8001/v1/tests?prev=y&this=1&that=2')
  })
})
