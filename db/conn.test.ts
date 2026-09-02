import { after, afterEach, before, describe, it } from 'node:test'
import { expect } from '@std/expect'
import Conn from './conn.ts'

const tbl = '__db_test'
const seed = async (name: string, n = 0): Promise<string> => {
  const id = crypto.randomUUID()
  const params = [id, name, n]
  const sql = `INSERT INTO ${tbl} (id, name, n) VALUES ($1, $2, $3)`
  await Conn.query(sql, params)
  return id
}

describe('Conn', () => {
  before(async () => {
    await Conn.query(`DROP TABLE IF EXISTS ${tbl}`)
    await Conn.query(
      `CREATE TABLE ${tbl} (id uuid PRIMARY KEY, name text NOT NULL, n int NOT NULL DEFAULT 0)`,
    )
  })

  afterEach(async () => {
    await Conn.query(`TRUNCATE ${tbl}`)
  })

  after(async () => {
    await Conn.query(`DROP TABLE IF EXISTS ${tbl}`)
    await Conn.close()
  })

  describe('query', () => {
    it('binds parameters and returns rows as objects', async () => {
      const sql = 'SELECT $1::int AS n'
      const params = [42]
      const actual = await Conn.query<{ n: number }>(sql, params)
      expect(actual[0].n).toBe(42)
    })

    it('returns an empty rowset if nothing matches', async () => {
      const actual = await Conn.query('SELECT 1 AS x WHERE false')
      expect(actual).toHaveLength(0)
    })
  })

  describe('exists', () => {
    const sql = `SELECT 1 FROM ${tbl} WHERE id = $1`

    it('returns false if nothing exists', async () => {
      const actual = await Conn.exists(sql, [crypto.randomUUID()])
      expect(actual).toBe(false)
    })

    it('returns true if something exists', async () => {
      const id = await seed('John Doe')
      const actual = await Conn.exists(sql, [id])
      expect(actual).toBe(true)
    })
  })

  describe('get', () => {
    const sql = `SELECT * FROM ${tbl} WHERE id = $1`

    it('returns null if nothing matches', async () => {
      const actual = await Conn.get(sql, [crypto.randomUUID()])
      expect(actual).toBe(null)
    })

    it('returns the first row', async () => {
      const id = await seed('John Doe')
      const actual = await Conn.get<{ id: string }>(sql, [id])
      expect(actual?.id).toBe(id)
    })
  })

  describe('list', () => {
    const seedNames = async (...names: string[]): Promise<void> => {
      for (const name of names) {
        await seed(name)
      }
    }

    it('returns an empty page for an empty table', async () => {
      expect(await Conn.list(tbl)).toEqual({ total: 0, rows: [] })
    })

    it('reports the total', async () => {
      await seedNames('John Doe', 'Jane Doe')
      const actual = await Conn.list<{ name: string; total?: number }>(tbl)
      expect(actual.total).toBe(2)
      expect(actual.rows).toHaveLength(2)
      expect(actual.rows[0]).not.toHaveProperty('total')
    })

    it('can apply a where clause', async () => {
      await seedNames('John Doe', 'Jane Doe')
      const actual = await Conn.list(tbl, {
        where: 'name = $1',
        params: ['John Doe'],
      })
      expect(actual.total).toBe(1)
    })

    it('applies a sort clause', async () => {
      await seedNames('Charlie', 'Alice', 'Bob')
      const actual = await Conn.list<{ name: string }>(tbl, {
        sort: 'name ASC',
      })
      const expected = ['Alice', 'Bob', 'Charlie']
      expect(actual.rows.map((r) => r.name)).toEqual(expected)
    })

    it('paginates', async () => {
      await seedNames('Charlie', 'Alice', 'Bob')
      const page = await Conn.list(tbl, { offset: 1, limit: 1 })
      expect(page.total).toBe(3)
      expect(page.rows).toHaveLength(1)
    })
  })
})
