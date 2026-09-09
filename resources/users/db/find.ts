import { validate } from '@std/uuid'
import { db } from '../../../db/index.ts'

export const id = (identifier: string): 'id' | 'username' =>
  validate(identifier) ? 'id' : 'username'

const findUser = (identifier: string) =>
  db.selectFrom('users').selectAll()
    .where(id(identifier), '=', identifier)
    .executeTakeFirst()

export default findUser
