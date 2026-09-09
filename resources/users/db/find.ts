import { validate } from '@std/uuid'
import { db } from '../../../db/index.ts'

const findUser = (identifier: string) => {
  const q = db.selectFrom('users').selectAll()
  return (validate(identifier)
    ? q.where('id', '=', identifier)
    : q.where('username', '=', identifier)).executeTakeFirst()
}

export default findUser
