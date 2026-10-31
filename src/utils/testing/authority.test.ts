import { describe, afterEach, it, expect, vi } from 'vitest'

describe('getTestAuthority', () => {
  const setEnv = async (
    port: string = '3000'
  ): Promise<() => string> => {
    vi.resetModules()
    vi.stubEnv('PORT', port)
    return (await import('./authority.ts')).default
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the test environment authority', async () => {
    const getTestAuthority = await setEnv()
    expect(getTestAuthority()).toEqual('http://api:3000')
  })
})
