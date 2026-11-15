import { describe, it, expect } from 'vitest'
import zodPathToPointer from './zod-path-to-pointer.ts'

describe('zodPathToPointer', () => {
  it.each([
    ['an empty array', '', []],
    ['[test]', '/test', ['test']],
    ['[tags, 0, name]', '/tags/0/name', ['tags', 0, 'name']],
    ['[a/b]', '/a~1b', ['a/b']]
  ] as Array<[string, string, string[]]>)('maps path %s to %s', (_description, expected, path) => {
    expect(zodPathToPointer(path)).toBe(expected)
  })
})
