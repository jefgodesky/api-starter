import { parse } from '@std/yaml'
import type Role from '../types/role.ts'

const getRolePermissions = async (role?: Role): Promise<string[]> => {
  const path = role ? `/app/roles/${role}.yml` : '/app/roles/anonymous.yml'
  const yaml = await Deno.readTextFile(path)
  // deno-lint-ignore no-explicit-any
  const data = parse(yaml) as any
  return ('permissions' in data) ? data.permissions : []
}

export default getRolePermissions
