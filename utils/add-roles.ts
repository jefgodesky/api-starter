import type Role from '../types/role.ts'
import type User from '../types/user.ts'
import RoleRepository from '../collections/users/roles/repository.ts'

const addRoles = async (user: User): Promise<User> => {
  const repository = new RoleRepository()
  const roles = user.id ? await repository.get(user.id) as Role[] ?? [] : []
  return {
    ...user,
    roles
  }
}

export default addRoles
