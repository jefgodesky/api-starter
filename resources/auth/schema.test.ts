import { afterEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import { sql } from 'kysely'
import { close, db } from '../../db/index.ts'
import { PROVIDERS } from './schema.ts'

describe('PROVIDERS', () => {
  afterEach(close)

  it('matches the database', async () => {
    const { rows } = await sql<{ label: string }>`
      SELECT e.enumlabel AS label
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'provider'
      ORDER BY e.enumsortorder
    `.execute(db)

    const actual = rows.map((r) => r.label).toSorted().join('/')
    const expected = [...PROVIDERS].toSorted().join('/')
    expect(actual).toBe(expected)
  })
})
