export const ROLES = {
  ACTIVE: 'active',
  ADMIN: 'admin'
} as const

type Role = typeof ROLES[keyof typeof ROLES]

const isRole = (candidate: unknown): candidate is Role => {
  if (typeof candidate !== 'string') return false
  return (Object.values(ROLES) as Role[]).includes(candidate as Role)
}

export default Role
export { isRole }
