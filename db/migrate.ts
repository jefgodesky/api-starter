import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import { db } from './index.ts'

const migrationFolder = path.join(import.meta.dirname!, 'migrations')
const provider = new FileMigrationProvider({ fs, path, migrationFolder })
const migrator = new Migrator({ db, provider })

const { error, results } = await migrator.migrateToLatest()

for (const { status, migrationName: name } of results ?? []) {
  const emoji = status === 'Success' ? '✅' : '❌'
  const c = status === 'Success' ? console.log : console.error
  c(`${emoji} ${name}`)
}

await db.destroy()

if (error) {
  console.error('Migration failed:', error)
  Deno.exit(1)
}
