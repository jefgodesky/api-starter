import { describe, it, expect } from 'vitest'
import readYAML from './read-yaml.ts'

describe('readYAML', () => {
  it('returns content from a YAML file', () => {
    const actual = readYAML('versions.yaml')
    expect(actual.versions.length).toBeGreaterThan(0)
  })
})
