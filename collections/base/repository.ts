import * as uuid from '@std/uuid'
import { HTTPException } from 'hono/http-exception'
import type Model from '../../types/db/model.ts'
import Conn, { type QueryParams } from '../../db/conn.ts'
import localize from '../../utils/localize.ts'

export default abstract class Repository<T extends Model> {
  protected tableName: string

  protected constructor(tableName: string) {
    this.tableName = tableName
  }

  async list(
    limit?: number,
    offset?: number,
  ): Promise<{ total: number; rows: T[] }> {
    return await Conn.list<T>(this.tableName, { offset, limit })
  }

  async get(id: string): Promise<T | null> {
    if (!uuid.v4.validate(id)) return null
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    return await Conn.get(query, [id])
  }

  async save(record: T): Promise<T | null> {
    if (record.id) return await this.update(record)
    return await this.create(record)
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`
    await Conn.query(query, [id])
  }

  protected async update(record: T): Promise<T | null> {
    const { id } = record
    if (!id) throw new HTTPException(400, { message: localize('update_error') })

    const keys = Object.keys(record)
      .filter((key) => key !== 'id') as (keyof T)[]
    const values = keys.map((key) => record[key]) as QueryParams
    const setClause = keys
      .map((key, index) => `${String(key)} = $${index + 2}`)
      .join(', ')
    const query =
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`

    try {
      const results = await Conn.query<T>(query, [id, ...values])
      return results[0]
    } catch (err) {
      console.error(err)
      throw new HTTPException(500, { message: localize('update_error') })
    }
  }

  protected async create(record: T): Promise<T | null> {
    const keys = Object.keys(record) as (keyof T)[]
    const values = keys.map((key) => record[key]) as QueryParams
    const columns = keys.join(', ')
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')
    const query =
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`

    try {
      const results = await Conn.query<T>(query, values)
      return results[0]
    } catch (err) {
      console.error(err)
      throw new HTTPException(500, { message: localize('create_error') })
    }
  }
}
