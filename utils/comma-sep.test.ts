import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import parseCommaSeparated from './comma-sep.ts'

describe('parseCommaSeparated', () => {
  const expected = ['a', 'b', 'c']

  it('parses a comma-separated list of strings into an array', () => {
    expect(parseCommaSeparated('a,b,c')).toEqual(expected)
  })

  it('trims white space', () => {
    const spaced = ' a  ,\n\rb , \t c    '
    expect(parseCommaSeparated(spaced)).toEqual(expected)
  })

  it('parses a null string into an empty array', () => {
    expect(parseCommaSeparated('')).toEqual([])
  })
})
