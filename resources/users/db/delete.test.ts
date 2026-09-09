import { afterEach, beforeEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import { clear, db } from '../../../db/index.ts'
import seedUser from '../testing/seed.ts'
import deleteUser from './delete.ts'

const expectGone = async (id: string): Promise<void> => {
  const found = await db.selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
  expect(found).toBe(undefined)
}

describe('deleteUser', () => {
  beforeEach(clear)
  afterEach(clear)

  it('deletes by ID', async () => {
    const user = await seedUser()
    expect(await deleteUser(user.id)).toBe(true)
    await expectGone(user.id)
  })

  it('deletes by username', async () => {
    const user = await seedUser()
    expect(await deleteUser(user.username ?? '')).toBe(true)
    await expectGone(user.id)
  })

  it('returns false for unknown ID/username', async () => {
    await seedUser()
    expect(await deleteUser('lol-nope')).toBe(false)
  })
})
