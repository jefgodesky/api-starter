import { parse } from '@std/yaml'
import type Role from '../types/role.ts'

const getRolePermissions = async (role: Role): Promise<string[]> => {
  const yaml = await Deno.readTextFile(`/app/roles/${role}.yml`)
  // deno-lint-ignore no-explicit-any
  const data = parse(yaml) as any
  return ('permissions' in data) ? data.permissions : []
}

export default getRolePermissions
