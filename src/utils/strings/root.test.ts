import { describe, afterEach, it, expect, vi } from 'vitest'
import { type Version } from '../version/types.ts'
import parseVersion from '../version/parse.ts'

describe('getRoot', () => {
  const setEnv = async (
    port: string = '3000'
  ): Promise<(v?: Version) => string> => {
    vi.resetModules()
    vi.stubEnv('API_DOMAIN', 'test.com')
    vi.stubEnv('API_PROTOCOL', 'https')
    vi.stubEnv('PORT', port)
    return (await import('./root.ts')).default
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the API root', async () => {
    const getRoot = await setEnv()
    expect(getRoot()).toEqual('https://test.com:3000/v1')
  })

  it('drops port if it’s 80', async () => {
    const getRoot = await setEnv('80')
    expect(getRoot()).toEqual('https://test.com/v1')
  })

  it('can take a different version', async () => {
    const getRoot = await setEnv()
    const v = parseVersion('3.2.1')
    expect(getRoot(v)).toEqual('https://test.com:3000/v3')
  })
})
