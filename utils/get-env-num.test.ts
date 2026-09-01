import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { isNumber } from '@revolutionarygamesco/common'
import getEnvNumber from './get-env-num.ts'

describe('getEnvNumber', () => {
  it('returns the environment variable value as a number', () => {
    expect(isNumber(getEnvNumber('MAX_PAGE_SIZE'))).toBe(true)
  })

  it('defaults to zero if not found', () => {
    expect(getEnvNumber('ENV_VAR_DOES_NOT_EXIST')).toBe(0)
  })

  it('defaults to specified fallback if not found', () => {
    const fallback = 42
    expect(getEnvNumber('ENV_VAR_DOES_NOT_EXIST', fallback)).toBe(fallback)
  })
})
