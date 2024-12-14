import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { PROVIDERS } from '../../types/provider.ts'
import accountToProviderResource from './account-to-provider-resource.ts'

describe('accountToProviderResource', () => {
  it('returns a provider response', () => {
    const actual = accountToProviderResource({
      uid: crypto.randomUUID(),
      provider: PROVIDERS.GOOGLE,
      pid: crypto.randomUUID(),
    })

    expect(actual.type).toBe('provider')
    expect(actual.id).toBe(PROVIDERS.GOOGLE)
  })
})
