import type User from '../types/user.ts'
import getRolePermissions from './get-role-permissions.ts'

const getPermissions = async (user: User): Promise<string[]> => {
  const roles = user.roles ?? []
  let all: string[] = []

  for (const role of roles) {
    const rolePermissions = await getRolePermissions(role)
    all = [...all, ...rolePermissions]
  }

  return [...new Set(all)]
}

export default getPermissions
