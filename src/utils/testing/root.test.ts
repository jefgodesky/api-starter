import { describe, afterEach, it, expect, vi } from 'vitest'
import { type Version } from '../version/types.ts'
import parseVersion from '../version/parse.ts'

describe('getTestRoot', () => {
  const setEnv = async (): Promise<(v?: Version) => string> => {
    vi.resetModules()
    vi.stubEnv('BASE_URL', 'http://localhost:3000')
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
    const v = parseVersion('3.2.1')
    expect(getTestRoot(v)).toEqual('http://api:3000/v3')
  })
})
