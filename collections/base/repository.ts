import { type Client } from '../../client.ts'
import Model from './model.ts'
import getEnvNumber from '../../utils/get-env-number.ts'

const MAX_PAGE_SIZE = getEnvNumber('MAX_PAGE_SIZE', 100)
const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)

export default abstract class Repository<T extends Model> {
  protected client: Client
  protected tableName: string

  protected constructor (client: Client, tableName: string) {
    this.client = client
    this.tableName = tableName
  }

  async list (limit: number = DEFAULT_PAGE_SIZE, offset: number = 0): Promise<{ total: number, rows: T[] }> {
    limit = Math.min(limit, MAX_PAGE_SIZE)
    const query = `
      SELECT *, COUNT(*) OVER() AS total
      FROM ${this.tableName}
      LIMIT $1 OFFSET $2
    `
    const result = await this.client.queryObject<{ total: number } & T>(query, [limit, offset])
    const total = Number(result.rows[0]?.total ?? 0)
    const rows = result.rows.map(({ total, ...row }) => row as unknown as T)
    return { total, rows }
  }

  async get (id: string): Promise<T | null> {
    const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
    if (!isValidUUID) return null
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    const result = await this.client.queryObject<T>(query, [id])
    return result.rows.length ? result.rows[0] : null
  }

  async save (record: T): Promise<T> {
    if (record.id) return await this.update(record)
    return await this.create(record)
  }

  async delete (id: string): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`
    await this.client.queryObject(query, [id])
  }

  private async update (record: T): Promise<T> {
    const keys = Object.keys(record).filter((key) => key !== 'id')
    const values = keys.map((key) => (record as any)[key])
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ")
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`
    const result = await this.client.queryObject<T>(query, [record.id, ...values])
    return result.rows[0]
  }

  private async create (record: T): Promise<T> {
    const keys = Object.keys(record)
    const values = keys.map((key) => (record as any)[key])
    const columns = keys.join(', ')
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await this.client.queryObject<T>(query, values)
    return result.rows[0]
  }
}