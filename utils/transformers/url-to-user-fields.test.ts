import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import urlToUserFields from './url-to-user-fields.ts'

describe('urlToUserFields', () => {
  it('returns undefined when no fields are specified', () => {
    const url = new URL('http://localhost:8001/v1/users')
    expect(urlToUserFields(url)).not.toBeDefined()
  })

  it('returns the fields specified', () => {
    const scenarios = [
      ['name', ['name']],
      ['username', ['username']],
      ['name,username', ['name', 'username']]
    ]

    for (const [q, arr] of scenarios) {
      const url = new URL(`https://example.com/v1/users?this=1&fields[users]=${q}&that=2`)
      const actual = urlToUserFields(url)
      expect(actual).toEqual(arr)
    }
  })
})
