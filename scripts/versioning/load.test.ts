import { describe, it, expect } from 'vitest'
import loadVersions from './load.ts'

describe('loadVersions', () => {
  it('loads versions from versions.yaml', () => {
    const versions = loadVersions()
    expect(versions.length).toBeGreaterThanOrEqual(1)
  })
})
