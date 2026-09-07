import postgres from 'postgres'
import { Kysely, sql } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import type { Database } from './tables.ts'
import getEnvNumber from '../utils/get-env-num.ts'
import isTest from '../utils/testing/is-test.ts'

const POSTGRES_POOLS = getEnvNumber('POSTGRES_POOLS', 10)

const client = postgres({
  host: Deno.env.get('POSTGRES_HOST') || 'localhost',
  port: getEnvNumber('POSTGRES_PORT', 5432),
  database: Deno.env.get('POSTGRES_DB') || 'api_db',
  username: Deno.env.get('POSTGRES_USER') || 'postgres',
  password: Deno.env.get('POSTGRES_PASSWORD') || 'password',
  max: POSTGRES_POOLS,
})

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({ postgres: client }),
})

export const clear = async (): Promise<void> => {
  if (!isTest()) return
  const { rows } = await sql<{ table_name: string }>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'kysely_migration%'
  `.execute(db)
  const tables = rows.map((r) => r.table_name)
  if (tables.length > 0) {
    await sql.raw(`TRUNCATE TABLE ${tables.join(', ')} CASCADE`).execute(db)
  }
}

export const close = async (): Promise<void> => {
  await db.destroy()
}
