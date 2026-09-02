import { after, afterEach, before, beforeEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import type Model from '../../types/db/model.ts'
import Conn from '../../db/conn.ts'
import Repository from './repository.ts'

const tbl = 'repo_test'

interface Test extends Model {
  name: string
  n: number
}

class TestRepository extends Repository<Test> {
  constructor() {
    super(tbl)
  }

  async createDirectly(record: Test): Promise<Test | null> {
    return await this.create(record)
  }

  async updateDirectly(record: Test): Promise<Test | null> {
    return await this.update(record)
  }
}

describe('Repository', () => {
  const repo = new TestRepository()

  before(async () => {
    await Conn.query(`DROP TABLE IF EXISTS ${tbl}`)
    await Conn.query(`
      CREATE TABLE ${tbl} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        n INT NOT NULL DEFAULT 0
      )
    `)
  })

  afterEach(async () => {
    await Conn.query(`TRUNCATE ${tbl}`)
  })

  after(async () => {
    await Conn.query(`DROP TABLE IF EXISTS ${tbl}`)
    await Conn.close()
  })

  describe('list', () => {
    beforeEach(async () => {
      await repo.save({ name: 'A', n: 1 })
      await repo.save({ name: 'B', n: 2 })
    })

    it('returns rows', async () => {
      const actual = await repo.list()
      expect(actual.total).toBe(2)
      expect(actual.rows).toHaveLength(2)
    })

    it('applies limit and offset', async () => {
      const actual = await repo.list(1, 1)
      expect(actual.total).toBe(2)
      expect(actual.rows).toHaveLength(1)
    })
  })

  describe('get', () => {
    it('returns null if given a bad UUID', async () => {
      expect(await repo.get('not-a-uuid')).toBe(null)
    })

    it('returns null if nothing matches', async () => {
      expect(await repo.get(crypto.randomUUID())).toBe(null)
    })

    it('returns the record', async () => {
      const saved = await repo.save({ name: 'A', n: 1 })
      const actual = await repo.get(saved?.id as string)
      expect(actual?.name).toBe('A')
    })
  })

  describe('save', () => {
    it('creates a new record if there’s no ID', async () => {
      const actual = await repo.save({ name: 'A', n: 1 })
      expect(actual?.id).toBeDefined()
      expect(actual?.name).toBe('A')
      expect((await repo.list()).total).toBe(1)
    })

    it('updates the existing record if there’s an ID', async () => {
      const created = await repo.save({ name: 'A', n: 1 })
      const actual = await repo.save({ ...created!, name: 'Updated' })
      expect(actual?.id).toBe(created?.id)
      expect(actual?.name).toBe('Updated')
      expect((await repo.list()).total).toBe(1)
    })

    it('throws an error when create fails', async () => {
      const id = crypto.randomUUID()
      const sql = `INSERT INTO ${tbl} (id, name, n) VALUES ($1, $2, $3)`
      const params = [id, 'A', 1]
      await Conn.query(sql, params)
      const record = { id, name: 'A', n: 2 }
      await expect(repo.createDirectly(record)).rejects.toThrow()
    })

    it('throws an error when update is called without an ID', async () => {
      await expect(repo.updateDirectly({ name: 'A', n: 1 })).rejects.toThrow()
    })

    it('throws an error when update fails', async () => {
      const created = await repo.save({ name: 'A', n: 1 })
      await Conn.query(`ALTER TABLE ${tbl} DROP COLUMN n`)
      await expect(repo.updateDirectly({ ...created!, n: 2 })).rejects.toThrow()
      await Conn.query(`ALTER TABLE ${tbl} ADD COLUMN n INT NOT NULL DEFAULT 0`)
    })
  })

  describe('delete', () => {
    it('deletes the row', async () => {
      const created = await repo.save({ name: 'A', n: 1 })
      await repo.delete(created?.id as string)
      expect(await repo.get(created?.id as string)).toBe(null)
    })
  })
})
