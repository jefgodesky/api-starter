import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType('provider')
    .asEnum(['google', 'discord', 'github'])
    .execute()

  await db.schema
    .createTable('accounts')
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
    .addColumn('provider', sql`provider`, (col) => col.notNull())
    .addColumn('pid', 'varchar(255)', (col) => col.notNull())
    .addUniqueConstraint('accounts_provider_pid_key', ['provider', 'pid'])
    .addUniqueConstraint('accounts_uid_provider_key', ['uid', 'provider'])
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('accounts').execute()
  await db.schema.dropType('provider').execute()
}
