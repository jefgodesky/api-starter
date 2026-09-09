import { db } from '../../../db/index.ts'

const listUsers = (
  limit: number,
  offset: number,
) =>
  db.selectFrom('users')
    .selectAll()
    .limit(limit)
    .offset(offset)
    .execute()

export default listUsers
