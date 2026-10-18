import { describe, afterEach, it, expect, vi } from 'vitest'

describe('getVersion', () => {
  const setEnv = async (
    port: string = '3000'
  ): Promise<() => string> => {
    vi.resetModules()
    vi.stubEnv('API_VERSION', '1.1')
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
})
