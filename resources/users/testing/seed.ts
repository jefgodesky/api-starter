import { db } from '../../../db/index.ts'

const seedUser = () =>
  db.insertInto('users').values({ name: 'John Doe', username: 'john' })
    .returningAll().executeTakeFirstOrThrow()

export default seedUser
