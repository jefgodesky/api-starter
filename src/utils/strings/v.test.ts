import { describe, afterEach, it, expect, vi } from 'vitest'

describe('getVersion', () => {
  const setEnv = async (): Promise<(version?: string) => string> => {
    vi.resetModules()
    vi.stubEnv('API_VERSION', '1.1')
    return (await import('./v.ts')).default
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the version string', async () => {
    const getVersion = await setEnv()
    expect(getVersion('2.2')).toEqual('v2')
  })

  it('pulls API version from the environment', async () => {
    const getVersion = await setEnv()
    expect(getVersion()).toEqual('v1')
  })
})
