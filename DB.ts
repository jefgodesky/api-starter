import { Client } from 'https://deno.land/x/postgres@v0.19.3/mod.ts'
import isTest from './utils/is-test.ts'

class DB {
  private static conn: DB
  private client: Client

  constructor () {
    this.client = new Client({
      user: Deno.env.get('POSTGRES_USER') || 'postgres',
      password: Deno.env.get('POSTGRES_PASSWORD') || 'password',
      database: Deno.env.get('POSTGRES_DB') || 'api_db',
      hostname: Deno.env.get('POSTGRES_HOST') || 'localhost',
      port: parseInt(Deno.env.get('POSTGRES_PORT') || '5432')
    })
  }

  static async clear (): Promise<void> {
    if (!isTest() || !DB.conn) return
    const client = DB.conn.client
    const query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_type = \'BASE TABLE\''
    const result = await client.queryObject<{ table_name: string }>(query)
    const tables = result.rows.map((row) => row.table_name)
    if (tables.length > 0) await client.queryArray(`TRUNCATE TABLE ${tables.join(', ')} CASCADE;`)
  }

  static async getClient (): Promise<Client> {
    if (!DB.conn) {
      DB.conn = new DB()
      await DB.conn.client.connect()
    }
    return DB.conn.client
  }

  static async close (): Promise<void> {
    if (!DB.conn) return
    await DB.conn.client.end()
  }
}

export default DB
