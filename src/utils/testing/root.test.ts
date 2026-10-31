import { describe, afterEach, it, expect, vi } from 'vitest'
import { type SemVer, type Version } from '../../resources/version/schemas.ts'
import parseVersion from '../../resources/version/utils/parse.ts'

describe('getTestRoot', () => {
  const setEnv = async (
    port: string = '3000'
  ): Promise<(v?: Version) => string> => {
    vi.resetModules()
    vi.stubEnv('PORT', port)
    return (await import('./root.ts')).default
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the test API root', async () => {
    const getTestRoot = await setEnv()
    expect(getTestRoot()).toEqual('http://api:3000/v1')
  })

  it('can take a different version', async () => {
    const getTestRoot = await setEnv()
    const v = parseVersion('3.2.1' as SemVer)
    expect(getTestRoot(v)).toEqual('http://api:3000/v3')
  })
})
