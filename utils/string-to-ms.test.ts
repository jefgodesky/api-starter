import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import stringToMS from './string-to-ms.ts'

describe('stringToMS', () => {
  it('returns 0 if given a string it does not understand', () => {
    expect(stringToMS('Hello, world!')).toBe(0)
    expect(stringToMS('3 months')).toBe(0)
    expect(stringToMS('3 years')).toBe(0)
    expect(stringToMS('2 decades')).toBe(0)
  })

  it('returns the number of milliseconds in 1 second', () => {
    expect(stringToMS('1 second')).toBe(1000)
  })

  it('returns the number of milliseconds in 2 seconds', () => {
    expect(stringToMS('2 seconds')).toBe(2 * 1000)
  })

  it('returns the number of milliseconds in 1 minute', () => {
    expect(stringToMS('1 minute')).toBe(60 * 1000)
  })

  it('returns the number of milliseconds in 2 minutes', () => {
    expect(stringToMS('2 minutes')).toBe(2 * 60 * 1000)
  })

  it('returns the number of milliseconds in 1 hour', () => {
    expect(stringToMS('1 hour')).toBe(60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 2 hours', () => {
    expect(stringToMS('2 hours')).toBe(2 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 1 day', () => {
    expect(stringToMS('1 day')).toBe(24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 2 days', () => {
    expect(stringToMS('2 days')).toBe(2 * 24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 1 week', () => {
    expect(stringToMS('1 week')).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 2 weeks', () => {
    expect(stringToMS('2 weeks')).toBe(2 * 7 * 24 * 60 * 60 * 1000)
  })

  it('can handle floats', () => {
    const est = 12 * 60 * 60
    expect(stringToMS('0.5 days')).toBeGreaterThan((est - 30) * 1000)
    expect(stringToMS('0.5 days')).toBeLessThan((est + 30) * 1000)
  })
})