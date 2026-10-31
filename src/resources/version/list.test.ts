import { describe, it, expect } from 'vitest'
import listVersions from './list.ts'

describe('listVersions', () => {
  // This test will fall out of data when you create a new version.
  // That's intentional, because it reminds you to update the list,
  // which requires some manual changes!

  it('lists versions', () => {
    const actual = listVersions()
    expect(actual).toHaveLength(1)
    expect(actual[0].status).toBe('live')
    expect(actual[0].uri.endsWith('/v1')).toBe(true)
  })
})
