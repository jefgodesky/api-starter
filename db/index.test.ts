import { after, before, describe, it } from 'node:test'
import { expect } from '@std/expect'
import { sql } from 'kysely'
import { clear, db } from './index.ts'

describe('db', () => {
  it('can run a query', async () => {
    const { rows } = await sql<{ result: number }>`SELECT 1 + 1 AS result`
      .execute(db)
    expect(rows[0].result).toBe(2)
  })
})

describe('clear', () => {
  const tbl = 'test'

  before(async () => {
    await sql`CREATE TABLE IF NOT EXISTS ${
      sql.ref(tbl)
    } (id serial PRIMARY KEY)`
      .execute(db)
  })

  after(async () => {
    await sql`DROP TABLE IF EXISTS ${sql.ref(tbl)}`.execute(db)
  })

  it('clears all tables', async () => {
    await sql`INSERT INTO ${sql.ref(tbl)} DEFAULT VALUES`.execute(db)
    await clear()

    const { rows } = await sql<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM ${sql.ref(tbl)}
    `.execute(db)
    expect(rows[0].count).toBe(0)
  })

  it('preserves migration bookkeeping', async () => {
    const applied = async () => {
      const { rows } = await sql<{ count: number }>`
        SELECT COUNT(*)::int AS count FROM kysely_migration
      `.execute(db)
      return rows[0].count
    }
    const before = await applied()
    expect(before).toBeGreaterThan(0)
    await clear()
    expect(await applied()).toBe(before)
  })
})
