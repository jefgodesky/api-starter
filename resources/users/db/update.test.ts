import { afterEach, beforeEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import { clear, db } from '../../../db/index.ts'
import seedUser from '../testing/seed.ts'
import updateUser from './update.ts'

describe('updateUser', () => {
  const name = 'Jack Doe'

  beforeEach(clear)
  afterEach(clear)

  it('updates by ID', async () => {
    const user = await seedUser()
    const updated = await updateUser(user.id, { name })
    expect(updated?.id).toBe(user.id)
    expect(updated?.name).toBe(name)
  })

  it('updates by username', async () => {
    const user = await seedUser()
    const updated = await updateUser(user.username ?? '', { name })
    expect(updated?.id).toBe(user.id)
    expect(updated?.name).toBe(name)
  })

  it('saves the update', async () => {
    const user = await seedUser()
    await updateUser(user.username ?? '', { name })
    const row = await db.selectFrom('users')
      .selectAll()
      .where('id', '=', user.id)
      .executeTakeFirst()
    expect(row?.name).toBe(name)
  })

  it('returns undefined for unknown ID/username', async () => {
    await seedUser()
    expect(await updateUser('lol-nope', { name })).toBeUndefined()
  })
})
