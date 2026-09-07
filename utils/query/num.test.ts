import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import parseNumber from './num.ts'

describe('parseNumber', () => {
  const base = 'https://example.com/index.html'

  it('returns the fallback if the param is not set', () => {
    expect(parseNumber(new URL(base), 'test', 0)).toBe(0)
  })

  it('returns the number if it is set', () => {
    const url = `${base}?test=42`
    expect(parseNumber(new URL(url), 'test', 0)).toBe(42)
  })

  it('can capture a float', () => {
    const url = `${base}?test=3.1415`
    expect(parseNumber(new URL(url), 'test', 0)).toBe(3.1415)
  })

  it('returns the fallback if it is not a number', () => {
    const url = `${base}?test=hello`
    expect(parseNumber(new URL(url), 'test', 0)).toBe(0)
  })
})
