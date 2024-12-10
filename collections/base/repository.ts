import * as uuid from '@std/uuid'
import DB from '../../DB.ts'
import Model from './model.ts'
import getEnvNumber from '../../utils/get-env-number.ts'

const MAX_PAGE_SIZE = getEnvNumber('MAX_PAGE_SIZE', 100)
const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)

export default abstract class Repository<T extends Model> {
  protected tableName: string

  protected constructor (tableName: string) {
    this.tableName = tableName
  }

  async list (limit: number = DEFAULT_PAGE_SIZE, offset: number = 0): Promise<{ total: number, rows: T[] }> {
    const client = await DB.getClient()
    limit = Math.min(limit, MAX_PAGE_SIZE)
    const query = `
      SELECT *, COUNT(*) OVER() AS total
      FROM ${this.tableName}
      LIMIT $1 OFFSET $2
    `
    const result = await client.queryObject<{ total: number } & T>(query, [limit, offset])
    const total = Number(result.rows[0]?.total ?? 0)
    // deno-lint-ignore no-unused-vars
    const rows = result.rows.map(({ total, ...row }) => row as unknown as T)
    return { total, rows }
  }

  async get (id: string): Promise<T | null> {
    if (!uuid.v4.validate(id)) return null
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    return await DB.get(query, [id])
  }

  async save (record: T): Promise<T> {
    if (record.id) return await this.update(record)
    return await this.create(record)
  }

  async delete (id: string): Promise<void> {
    const client = await DB.getClient()
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`
    await client.queryObject(query, [id])
  }

  protected async update (record: T): Promise<T> {
    const client = await DB.getClient()
    const keys = Object.keys(record).filter((key) => key !== 'id')
    // deno-lint-ignore no-explicit-any
    const values = keys.map((key) => (record as any)[key])
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ")
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`
    const result = await client.queryObject<T>(query, [record.id, ...values])
    return result.rows[0]
  }

  protected async create (record: T): Promise<T> {
    const client = await DB.getClient()
    const keys = Object.keys(record)
    // deno-lint-ignore no-explicit-any
    const values = keys.map((key) => (record as any)[key])
    const columns = keys.join(', ')
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await client.queryObject<T>(query, values)
    return result.rows[0]
  }
}
