import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import checkEnvFlag, { FALSY_FLAG_VALUES } from './flag.ts'

describe('checkEnvFlag', () => {
  const key = 'ChECK_ENV_FLAG_TEST_KEY'

  it('returns true for truthy values', () => {
    const values = ['true', '1', '-1', 'hello']
    for (const value of values) {
      Deno.env.set(key, value)
      const actual = checkEnvFlag(key)
      Deno.env.delete(key)
      expect(actual).toBe(true)
    }
  })

  it('returns false for falsy values', () => {
    for (const value of FALSY_FLAG_VALUES) {
      Deno.env.set(key, value)
      const actual = checkEnvFlag(key)
      Deno.env.delete(key)
      expect(actual).toBe(false)
    }
  })

  it('returns false if flag does not exist', () => {
    Deno.env.delete(key)
    const actual = checkEnvFlag(key)
    expect(actual).toBe(false)
  })
})
