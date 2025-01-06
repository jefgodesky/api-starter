import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getNumberFromQueryString from './get-number-from-query-string.ts'

describe('getNumberFromQueryString', () => {
  it('returns undefined if parameter does not exist', () => {
    const url = new URL('http://localhost:8001/v1/test')
    expect(getNumberFromQueryString(url, 'test')).toBe(undefined)
  })

  it('returns undefined if parameter cannot be parsed into a number', () => {
    const url = new URL('http://localhost:8001/v1/test?test=no')
    expect(getNumberFromQueryString(url, 'test')).toBe(undefined)
  })

  it('returns the parameter as a number', () => {
    const url = new URL('http://localhost:8001/v1/test?test=42')
    expect(getNumberFromQueryString(url, 'test')).toBe(42)
  })
})
