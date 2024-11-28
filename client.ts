import { Client } from 'https://deno.land/x/postgres@v0.19.3/mod.ts'

const client = new Client({
  user: Deno.env.get('POSTGRES_USER') || 'postgres',
  password: Deno.env.get('POSTGRES_PASSWORD') || 'password',
  database: Deno.env.get('POSTGRES_DB') || 'api_db',
  hostname: Deno.env.get('POSTGRES_HOST') || 'localhost',
  port: parseInt(Deno.env.get('POSTGRES_PORT') || '5432')
})

const clearDB = async (): Promise<void> => {
  const query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_type = \'BASE TABLE\''
  const result = await client.queryObject<{ table_name: string }>(query)
  const tables = result.rows.map((row) => row.table_name)
  if (tables.length > 0) await client.queryArray(`TRUNCATE TABLE ${tables.join(', ')} CASCADE;`)
}

export default client
export { clearDB }
export type { Client }
