import { db } from '../../../db/index.ts'
import { type User, type UserUpdate } from './types.ts'
import { id as finder } from './find.ts'

const updateUser = (
  id: string,
  patch: UserUpdate,
): Promise<User | undefined> =>
  db.updateTable('users').set(patch)
    .where(finder(id), '=', id)
    .returningAll().executeTakeFirst()

export default updateUser
