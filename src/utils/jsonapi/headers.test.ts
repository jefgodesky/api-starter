import { describe, it, expect } from 'vitest'
import { JSONAPI_MEDIA } from './constants.js'
import makeLink from './link.js'
import makeHeaders from './headers.ts'

describe('makeHeaders', () => {
  it('adds the JSON:API Content-Type header', () => {
    const actual = makeHeaders()
    expect(actual['Content-Type']).toBe(JSONAPI_MEDIA)
  })

  it('adds links', () => {
    const l1 = makeLink('https://api.test.com/v1/test', 'test')
    const l2 = makeLink('https://api.test.com/v2/test', 'test')
    const actual = makeHeaders([l1, l2])
    expect(actual['Links']).toBe(`${l1}, ${l2}`)
  })
})
