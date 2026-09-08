import { type User } from './db.ts'
import { usersType } from './schema.ts'
import getRoot from '../../utils/root.ts'

const getUserLink = (
  user: User,
): string => {
  const slug = user.username ?? user.id
  return [getRoot(), usersType, slug].join('/')
}

export default getUserLink
