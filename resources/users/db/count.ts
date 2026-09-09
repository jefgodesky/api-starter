import { db } from '../../../db/index.ts'

const countUsers = async (): Promise<number> => {
  const q = db.selectFrom('users')
    .select((eb) => eb.fn.countAll<number>().as('n'))
  return (await q.executeTakeFirstOrThrow()).n
}

export default countUsers
