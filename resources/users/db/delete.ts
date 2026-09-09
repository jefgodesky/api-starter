import { db } from '../../../db/index.ts'
import { idCol } from './find.ts'

const deleteUser = async (
  id: string,
): Promise<boolean> => {
  const result = await db.deleteFrom('users')
    .where(idCol(id), '=', id)
    .executeTakeFirst()
  return result.numDeletedRows > 0n
}

export default deleteUser
