import { describe, it, expect } from 'vitest'
import parseVersion from './parse.ts'

describe('parseVersion', () => {
  it.each([
    ['0.0.1', [0, 0, 1]],
    ['1.0.0', [1, 0, 0]],
    ['1.2.3', [1, 2, 3]],
    ['3.2.1', [3, 2, 1]]
  ] as Array<[string, number[]]>)('parses a semantic version like %s', (v, expected) => {
    const { major, minor, patch, prerelease, build, path } = parseVersion(v)
    expect(major).toBe(expected[0])
    expect(minor).toBe(expected[1])
    expect(patch).toBe(expected[2])
    expect(prerelease).not.toBeDefined()
    expect(build).not.toBeDefined()
    expect(path).toBe(`v${expected[0]}`)
  })

  it.each([
    ['1.0.0-alpha', 'alpha'],
    ['1.0.0-alpha.1', 'alpha.1'],
    ['1.0.0-0.3.7', '0.3.7'],
    ['1.0.0-x.7.z.92', 'x.7.z.92'],
    ['1.0.0-x-y-z.--', 'x-y-z.--']
  ] as Array<[string, string]>)('can parse a prelease string like %s', (v, expected) => {
    const { prerelease } = parseVersion(v)
    expect(prerelease).toBe(expected)
  })

  it.each([
    ['1.0.0-alpha+001', '001'],
    ['1.0.0+20130313144700', '20130313144700'],
    ['1.0.0-beta+exp.sha.5114f85', 'exp.sha.5114f85'],
    ['1.0.0+21AF26D3----117B344092BD', '21AF26D3----117B344092BD']
  ] as Array<[string, string]>)('can parse build metadata like %s', (v, expected) => {
    const { build } = parseVersion(v)
    expect(build).toBe(expected)
  })
})
