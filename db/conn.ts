import postgres from 'postgres'
import isTest from '../utils/testing/is-test.ts'
import getEnvNumber from '../utils/get-env-num.ts'

const MAX_PAGE_SIZE = getEnvNumber('MAX_PAGE_SIZE', 100)
const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)
const POSTGRES_POOLS = getEnvNumber('POSTGRES_POOLS', 10)

export type Sql = ReturnType<typeof postgres>
export type QueryParams = NonNullable<Parameters<Sql['unsafe']>[1]>

class Conn {
  private static conn: Conn
  private sql: Sql

  constructor() {
    this.sql = postgres({
      host: Deno.env.get('POSTGRES_HOST') || 'localhost',
      port: getEnvNumber('POSTGRES_PORT', 5432),
      database: Deno.env.get('POSTGRES_DB') || 'api_db',
      username: Deno.env.get('POSTGRES_USER') || 'postgres',
      password: Deno.env.get('POSTGRES_PASSWORD') || 'password',
      max: POSTGRES_POOLS,
    })
  }

  static getSql(): Sql {
    if (!Conn.conn) Conn.conn = new Conn()
    return Conn.conn.sql
  }

  static async query<T>(
    query: string,
    params: QueryParams = [],
  ): Promise<T[]> {
    const rows = await Conn.getSql().unsafe<T[]>(query, params)
    return rows as T[]
  }

  static async clear(): Promise<void> {
    if (!isTest() || !Conn.conn) return
    const query =
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
    const results = await Conn.query<{ table_name: string }>(query)
    const tables = results.map((row) => row.table_name)
    if (tables.length > 0) {
      await Conn.query(`TRUNCATE TABLE ${tables.join(', ')} CASCADE;`)
    }
  }

  static async exists(
    query: string,
    params: QueryParams,
  ): Promise<boolean> {
    const results = await Conn.query(query, params)
    return results.length > 0
  }

  static async get<T>(
    query: string,
    params: QueryParams,
  ): Promise<T | null> {
    const results = await Conn.query<T>(query, params)
    return results.length ? results[0] : null
  }

  static async list<T>(
    tableName: string,
    {
      limit = DEFAULT_PAGE_SIZE,
      offset = 0,
      where = undefined,
      sort = undefined,
      params = [],
    }: {
      limit?: number
      offset?: number
      where?: string
      sort?: string
      params?: QueryParams
    } = {},
  ): Promise<{ total: number; rows: T[] }> {
    limit = Math.min(limit, MAX_PAGE_SIZE)
    let query = `SELECT *, COUNT(*) OVER() AS total FROM ${tableName}`
    if (where) query += ` WHERE ${where}`
    if (sort) query += ` ORDER BY ${sort}`

    const n = params.length + 1
    query += ` LIMIT $${n} OFFSET $${n + 1}`
    params = [...params, limit, offset]

    const results = await Conn.query<{ total: number } & T>(query, params)
    const total = Number(results[0]?.total ?? 0)
    const rows = results.map(({ total: _, ...row }) => row as unknown as T)
    return { total, rows }
  }

  static async close(): Promise<void> {
    if (!Conn.conn) return
    await Conn.conn.sql.end()
  }
}

export default Conn
export { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE }
