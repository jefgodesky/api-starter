import { describe, it, expect } from 'vitest'
import getImageTag from './image-tag.ts'

describe('getImageTag', () => {
  it('returns the tag from an image name', () => {
    expect(getImageTag('ghcr.io/jefgodesky/api-starter:v1')).toBe('v1')
  })

  it('returns undefined if there is no tag to get', () => {
    expect(getImageTag('ghcr.io/jefgodesky/api-starter')).toBeUndefined()
  })
})
