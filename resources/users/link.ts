import { type User } from './db.ts'
import getRoot from '../../utils/root.ts'

const getUserLink = (
  user: User,
): string => {
  const slug = user.username ?? user.id
  return `${getRoot()}/users/${slug}`
}

export default getUserLink
