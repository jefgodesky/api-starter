import { describe, beforeAll, it, expect } from 'vitest'
import parseVersion from '../../resources/version/utils/parse.ts'
import versionPath from './path.ts'

describe('versionPath', () => {
  let v: string = 'v1'

  beforeAll(() => {
    v = (parseVersion()).path
  })

  it('versions the path', () => {
    const actual = versionPath('test')
    expect(actual).toBe(`/${v}/test`)
  })

  it('drops trailing slash', () => {
    const actual = versionPath('/')
    expect(actual).toBe(`/${v}`)
  })
})
