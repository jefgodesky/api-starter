import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('tokens')
    .addColumn(
      'id',
      'uuid',
      (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn(
      'uid',
      'uuid',
      (col) => col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('refresh', 'varchar(64)', (col) => col.notNull())
    .addColumn('xtkn', 'timestamptz', (col) => col.notNull())
    .addColumn('xref', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('tokens_uid_index')
    .on('tokens')
    .column('uid')
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('tokens').execute()
}
