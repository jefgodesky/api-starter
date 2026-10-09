import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import getEnvStr from './str.ts'

describe('getEnvStr', () => {
  const key = 'GET_ENV_STR_TEST_KEY'
  const value = 'Hello, world!'

  it('returns the environment variable', () => {
    Deno.env.set(key, value)
    const actual = getEnvStr(key, key)
    Deno.env.delete(key)
    expect(actual).toBe(value)
  })

  it('returns the fallback if environment variable doesn’t exist', () => {
    Deno.env.delete(key)
    const actual = getEnvStr(key, key)
    expect(actual).toBe(key)
  })
})
