import { describe, afterEach, it, expect, vi } from 'vitest'

describe('getAuthority', () => {
  const setEnv = async (
    port: string = '3000'
  ): Promise<() => string> => {
    vi.resetModules()
    vi.stubEnv('API_DOMAIN', 'test.com')
    vi.stubEnv('API_PROTOCOL', 'https')
    vi.stubEnv('PORT', port)
    return (await import('./authority.ts')).default
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the scheme, host, and port', async () => {
    const getAuthority = await setEnv()
    expect(getAuthority()).toEqual('https://test.com:3000')
  })

  it('drops port if it’s 80', async () => {
    const getAuthority = await setEnv('80')
    expect(getAuthority()).toEqual('https://test.com')
  })
})
