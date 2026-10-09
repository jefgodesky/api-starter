import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import t, { loadDict } from './intl.ts'

describe('loadDict', () => {
  it('loads the specified dictionary', () => {
    Deno.env.set('LANG', 'en-us')
    const dict = loadDict()
    expect(dict['not-found']).toBeDefined()
  })
})

describe('t', () => {
  it('gets the message for a key', () => {
    Deno.env.set('LANG', 'en-us')
    const actual = t('test.msg')
    expect(actual).toBe('Hello, world!')
  })

  it('returns error if the key does not exist', () => {
    Deno.env.set('LANG', 'en-us')
    const actual = t('test.nope')
    expect(actual).toBe('test.nope does not exist.')
  })
})
