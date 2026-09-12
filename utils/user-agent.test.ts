import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import getUserAgent from './user-agent.ts'

describe('getUserAgent', () => {
  it('concatenates a user agent string', () => {
    const url = 'https://github.com/jefgodesky/api-starter'
    const actual = getUserAgent('api-starter', '1.0.0', url)
    expect(actual).toBe(`api-starter/v1.0.0 (+${url})`)
  })
})
