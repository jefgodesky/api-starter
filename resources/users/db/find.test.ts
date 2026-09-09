import { afterEach, beforeEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import { clear } from '../../../db/index.ts'
import seedUser from '../testing/seed.ts'
import findUser from './find.ts'

describe('findUser', () => {
  beforeEach(clear)
  afterEach(clear)

  it('can find a user by ID', async () => {
    const user = await seedUser()
    expect((await findUser(user.id))?.id).toBe(user.id)
  })

  it('can find a user by username', async () => {
    const user = await seedUser()
    expect((await findUser(user.username ?? ''))?.id).toBe(user.id)
  })

  it('returns undefined for an unknown username', async () => {
    await seedUser()
    expect(await findUser('lol-nope')).toBeUndefined()
  })

  it('returns undefined for an unknown ID', async () => {
    await seedUser()
    expect(await findUser(crypto.randomUUID())).toBeUndefined()
  })
})
