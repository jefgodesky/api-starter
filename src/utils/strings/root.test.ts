import { describe, afterEach, it, expect, vi } from 'vitest'
import { type Version } from '../version/types.ts'
import parseVersion from '../version/parse.ts'

describe('getRoot', () => {
  const setEnv = async (): Promise<(v?: Version) => string> => {
    vi.resetModules()
    vi.stubEnv('BASE_URL', 'https://test.com:3000')
    return (await import('./root.ts')).default
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the API root', async () => {
    const getRoot = await setEnv()
    expect(getRoot()).toEqual('https://test.com:3000/v1')
  })

  it('can take a different version', async () => {
    const getRoot = await setEnv()
    const v = parseVersion('3.2.1')
    expect(getRoot(v)).toEqual('https://test.com:3000/v3')
  })
})
