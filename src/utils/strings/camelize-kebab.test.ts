import { describe, it, expect } from 'vitest'
import camelizeKebab from './camelize-kebab.ts'

describe('camelize', () => {
  it('camelizes a kebab', () => {
    expect(camelizeKebab('test-string')).toBe('testString')
  })
})
