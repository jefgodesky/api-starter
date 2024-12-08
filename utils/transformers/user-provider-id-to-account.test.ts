import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../collections/users/model.ts'
import { type ProviderID } from '../../index.d.ts'
import { PROVIDERS } from '../../enums.ts'
import userProviderIDToAccount from './user-provider-id-to-account.ts'

describe('userProviderIDToAccount', () => {
  it('returns an Account', () => {
    const user: User = {
      id: crypto.randomUUID(),
      name: 'John Doe',
    }

    const pid: ProviderID = {
      name: 'John Doe',
      provider: PROVIDERS.GOOGLE,
      pid: '1'
    }

    const actual = userProviderIDToAccount(user, pid)
    expect(actual.uid).toBe(user.id)
    expect(actual.provider).toBe(pid.provider)
    expect(actual.pid).toBe(pid.pid)
  })
})
