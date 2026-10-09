import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import getEnvNum from './num.ts'

describe('getEnvNum', () => {
  const key = 'GET_ENV_NUM_TEST_KEY'

  it('returns the environment variable', () => {
    Deno.env.set(key, '42')
    const actual = getEnvNum(key, 1)
    Deno.env.delete(key)
    expect(actual).toBe(42)
  })

  it('can handle a float', () => {
    Deno.env.set(key, '3.1415')
    const actual = getEnvNum(key, 1)
    Deno.env.delete(key)
    expect(actual).toBeCloseTo(3.1415)
  })

  it('returns the fallback if value can’t be parsed', () => {
    Deno.env.set(key, 'lol no')
    const actual = getEnvNum(key, 1)
    Deno.env.delete(key)
    expect(actual).toBe(1)
  })

  it('returns the fallback if environment variable doesn’t exist', () => {
    Deno.env.delete(key)
    const actual = getEnvNum(key, 1)
    expect(actual).toBe(1)
  })
})
