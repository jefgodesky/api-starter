import { Context } from '@oak/oak'
import checkExplicitPermission from './explicit.ts'
import isSelf from '../is-self.ts'

const checkRoleSelfPermission = (ctx: Context, permission: string): boolean => {
  const selfVersion = permission.replace('role:', 'role:self:')
  return isSelf(ctx) && checkExplicitPermission(ctx, selfVersion)
}

export default checkRoleSelfPermission
