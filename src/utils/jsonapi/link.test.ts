import { describe, it, expect } from 'vitest'
import makeLink from './link.ts'

describe('makeLink', () => {
  const href = 'https://api.test.com/v1/test'
  const rel = 'test'
  const baseline = `<${href}>; rel="${rel}"`

  it('can make a link with just an href and a rel', () => {
    const actual = makeLink(href, rel)
    expect(actual).toBe(baseline)
  })

  it('can include params', () => {
    const actual = makeLink(href, rel, { test: 'yes' })
    expect(actual).toBe(baseline + '; test="yes"')
  })
})
