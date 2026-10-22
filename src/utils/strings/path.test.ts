import { describe, it, expect } from 'vitest'
import getVersion from './v.js'
import versionPath from './path.ts'

describe('versionPath', () => {
  it('versions the path', () => {
    const actual = versionPath('test')
    expect(actual).toBe(`/${getVersion()}/test`)
  })

  it('drops trailing slash', () => {
    const actual = versionPath('/')
    expect(actual).toBe(`/${getVersion()}`)
  })
})
