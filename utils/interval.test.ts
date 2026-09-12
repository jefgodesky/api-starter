import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { isWithinRange } from '@revolutionarygamesco/common'
import parseInterval, {
  MS_PER_D,
  MS_PER_H,
  MS_PER_M,
  MS_PER_S,
  MS_PER_W,
} from './interval.ts'

describe('parseInterval', () => {
  it('returns 0 if given a string it does not understand', () => {
    expect(parseInterval('Hello, world!')).toBe(0)
    expect(parseInterval('3 months')).toBe(0)
    expect(parseInterval('3 years')).toBe(0)
    expect(parseInterval('2 decades')).toBe(0)
    expect(parseInterval('1 minute and 30 seconds')).toBe(0)
  })

  const spans: Array<[string, number]> = [
    ['second', MS_PER_S],
    ['minute', MS_PER_M],
    ['hour', MS_PER_H],
    ['day', MS_PER_D],
    ['week', MS_PER_W],
  ]

  const cases: Array<[string, number]> = []
  for (const [span, ms] of spans) {
    for (let i = 1; i < 11; i++) {
      const interval = i === 1 ? `1 ${span}` : `${i} ${span}s`
      cases.push([interval, ms * i])
    }
  }

  for (const [interval, expected] of cases) {
    it(`parses ${interval} into ${expected}ms`, () => {
      expect(parseInterval(interval)).toBe(expected)
    })
  }

  it('can handle floats', () => {
    const est = 12 * 60 * 60
    const actual = parseInterval('0.5 days')
    const range = [
      (est - 30) * 1000,
      (est + 30) * 1000,
    ]
    expect(isWithinRange(actual, range)).toBe(true)
  })
})
